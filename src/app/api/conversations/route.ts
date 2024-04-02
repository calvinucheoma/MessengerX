import getCurrentUser from '@/app/actions/getCurrentUser';
import { NextResponse } from 'next/server';
import prisma from '@/app/libs/prismadb';
import { pusherServer } from '@/app/libs/pusher';

export const POST = async (req: Request) => {
  try {
    const currentUser = await getCurrentUser();

    const body = await req.json();

    const { userId, isGroup, members, name } = body;

    if (!currentUser?.id || !currentUser?.email) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    if (isGroup && (!members || members.length < 2 || !name)) {
      return new NextResponse('Invalid data', { status: 400 });
    }

    if (isGroup) {
      const newConversation = await prisma.conversation.create({
        data: {
          name,
          isGroup,
          users: {
            connect: [
              ...members.map((member: { value: string }) => ({
                id: member.value,
              })),
              {
                id: currentUser.id,
              },
            ],
          },
        },
        include: {
          users: true,
        },
      });

      newConversation.users.forEach((user) => {
        if (user.email) {
          pusherServer.trigger(user.email, 'conversation:new', newConversation);
        }
      });

      return NextResponse.json(newConversation);
    }

    const existingConversations = await prisma.conversation.findMany({
      where: {
        OR: [
          {
            userIds: {
              equals: [currentUser.id, userId],
              // we check if there is a conversation that has only these 2 users: the user we are currently logged in
              // as, and the user we are trying to start a new conversation with. If it already exists, we are not
              // going to create a new one for them.
            },
          },
          {
            userIds: {
              equals: [userId, currentUser.id],
            },
          },
          // We repeat this process identically twice to fix the error where we had an existing conversation
          // but for some reason, another one was created. So this covers all of the cases
        ],
      },
      // we do not 'include' our 'users' here as we do not need it and as such we do not want to go hard on our database
    });

    const singleConversation = existingConversations[0];

    if (singleConversation) {
      return NextResponse.json(singleConversation);
    }

    const newConversation = await prisma.conversation.create({
      data: {
        users: {
          connect: [
            {
              id: currentUser.id,
            },
            {
              id: userId,
            },
          ],
        },
      },
      include: {
        users: true,
      },
    });

    newConversation.users.map((user) => {
      if (user.email) {
        pusherServer.trigger(user.email!, 'conversation:new', newConversation);
      }
    });

    return NextResponse.json(newConversation);
  } catch (error: any) {
    return new NextResponse('Internal Error', { status: 500 });
  }
};

/*
     The 'connect' keyword is used within the Prisma client's 'create' method to establish a relational 
     connection between entities. Specifically, it's used to connect the 'users' field of a new conversation with 
     existing user entities in the database.

    Additionally, using 'connect' allows Prisma to optimize database queries by avoiding unnecessary data 
    duplication and ensuring consistency in the database schema.
*/

/*
  In JavaScript, arrays can contain elements of any data type, including other arrays. When you spread the result 
  of 'members.map' within another array '[...]', it effectively flattens the array of arrays into a single array.

  So, even though the 'connect' property expects an array of objects, it can still accept an array containing 
  arrays of objects, thanks to JavaScript's flexibility with array manipulation. The Prisma library likely 
  handles this scenario internally and processes the data correctly.

  In summary, while the syntax may seem unconventional, it works due to JavaScript's ability to handle nested 
  arrays and array operations effectively. However, for readability and clarity, it's usually preferable to avoid 
  unnecessary array nesting when possible. For example, the code could be written as:

    const newConversation = await prisma.conversation.create({
      data: {
        name,
        isGroup,
        users: {
          connect: members.map((member: { value: string }) => ({
            id: member.value,
          })).concat({
            id: currentUser.id,
          }),
        },
      },
      include: {
        users: true,
      },
  });



*/
