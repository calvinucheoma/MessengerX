import { authOptions } from '@/app/libs/authOptions';
import NextAuth from 'next-auth/next';

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

/*
  I had to move 'authOptions' object into a different folder and then export it from there because I was getting an
  error when deploying the project to Vercel which stated that: 
  Type error: Route "src/app/api/auth/[...nextauth]/route.ts" does not match the required types of a Next.js Route.
  "authOptions" is not a valid Route export field.

  So, I went online to stack overflow to find the cause of the error and I found a solution to the error.I was getting
  the error because "you are only allowed to export HTTP Methods (GET, HEAD, POST, PUT, DELETE, etc). If an unsupported 
  method is called, Next.js will return an error". So in summary, you are not allowed to export any arbitrary object when using a route.ts
  file in NextJS. You can only export objects named GET, POST, PATCH, etc. Since you are exporting authOptions, the build is failing.

*/
