import prisma from '../libs/prismadb';
import getSession from './getSession';

const getCurrentUser = async () => {
  try {
    const session = await getSession();

    if (!session?.user?.email) {
      return null;
    }

    const currentUser = await prisma.user.findUnique({
      where: {
        email: session.user.email as string,
      },
    });

    if (!currentUser) {
      return null;
    }

    return currentUser;
  } catch (error: any) {
    return null;
    // we do not want to throw any errors because it will break the application. This is not an API route but a server action
  }
};

export default getCurrentUser;
