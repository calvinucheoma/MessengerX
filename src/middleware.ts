import { withAuth } from 'next-auth/middleware';

export default withAuth({
  pages: {
    signIn: '/', // this is our initial sign In page
  },
});

export const config = {
  matcher: ['/users/:path*', '/conversations/:path*'],

  // this is a good practice to protect all of the routes inside the 'users' route
  // So if we are not authenticated and we try to navigate to the /users path, we are automatically redirected
  // to the home page which is the login page in this app
};
