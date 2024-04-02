import bcrypt from 'bcrypt';
import prisma from '@/app/libs/prismadb';
import { NextResponse } from 'next/server';

export const POST = async (req: Request) => {
  try {
    const body = await req.json();

    const { email, name, password } = body;

    if (!email || !name || !password) {
      return new NextResponse('Missing info', { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        email,
        name,
        hashedPassword,
      },
    });

    return NextResponse.json(user, { status: 201 });
    //  when sending a response using '.json' like we did above, it does not require using the 'new' keyword before 'NextResponse'
  } catch (error: any) {
    console.log(error, 'REGISTRATION_ERROR');
    return new NextResponse('Internal server error', { status: 500 });
  }
};
