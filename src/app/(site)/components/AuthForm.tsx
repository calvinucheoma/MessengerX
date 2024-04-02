'use client';

import Button from '@/components/Button';
import Input from '@/components/inputs/Input';
import { useCallback, useEffect, useState } from 'react';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import AuthSocialButton from './AuthSocialButton';
import { BsGithub, BsGoogle } from 'react-icons/bs';
import axios from 'axios';
import toast from 'react-hot-toast';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

type Variant = 'LOGIN' | 'REGISTER';

const AuthForm = () => {
  const [variant, setVariant] = useState<Variant>('LOGIN');

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const session = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session?.status === 'authenticated') {
      router.push('/users');
    }
  }, [session?.status, router]);

  const toggleVariant = useCallback(() => {
    if (variant === 'LOGIN') {
      setVariant('REGISTER');
    } else {
      setVariant('LOGIN');
    }
  }, [variant]);

  /* 
  'useCallback' is used to memoize the toggleVariant function. It is used when you need to memoize functions.
   Without 'useCallback', each time the component re-renders, a new instance of the 'toggleVariant' function would
   be created. This could potentially lead to unnecessary re-renders of child components that receive 'toggleVariant' as a prop.
   
   By using 'useCallback' with '[variant]' as the dependency array, the 'toggleVariant' function is only re-created
   when the 'variant' state changes. This ensures that the function reference remains stable between re-renders when
   the 'variant' state remains unchanged.

   Memoizing the function with 'useCallback' ensures that the function is not recreated on every render, which can
   be particularly important in performance-sensitive scenarios or when passing the function as a prop to child components.

   While it's possible to achieve the same functionality using 'useEffect', using 'useCallback' in this context is
   more appropriate and efficient as it optimizes performance by memoizing the function and prevents unnecessary 
   re-renders of child components.

   We can also use 'useMemo' here instead as it achieves the desired optimization effect, however, using 'useCallback' 
   in this context would be more semantically appropriate, as its purpose is specifically to memoize functions, 
   while 'useMemo' is typically used to memoize the result of expensive computations, not functions. However, 
   since JavaScript functions are first-class citizens, and memoization can also be applied to functions, using 
   'useMemo' to memoize the 'toggleVariant' function would achieve the same optimization effect. It would ensure 
   that the function is only recreated when its dependencies change, similar to 'useCallback'.
 */

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  });

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setIsLoading(true);

    if (variant === 'REGISTER') {
      // Axios call to our Register route
      axios
        .post('/api/register', data)
        .then(() => signIn('credentials', data))
        .catch(() => toast.error('Something went wrong...'))
        .finally(() => setIsLoading(false));
    }

    if (variant === 'LOGIN') {
      // NextAuth SignIn
      signIn('credentials', { ...data, redirect: false })
        .then((callback) => {
          if (callback?.error) {
            toast.error('Invalid credentials');
          }

          if (callback?.ok && !callback?.error) {
            toast.success('Successfully logged in!');
            router.push('/users');
          }
        })
        .finally(() => setIsLoading(false));
    }
  };

  const socialAction = (action: string) => {
    setIsLoading(true);

    // NextAuth Social SignIn
    signIn(action, { redirect: false })
      .then((callback) => {
        if (callback?.error) {
          toast.error('Invalid credentials');
        }
        if (callback?.ok && !callback?.error) {
          toast.success('Successfully logged in!');
        }
      })
      .finally(() => setIsLoading(false));
  };

  // If we do not see the user in the database after logging in using a google or github provider, we delete all the
  // users in the database and 'accounts' section and then hard-reload on our browser. We now sign in using these providers again.
  // Usually, the user would appear in the 'Accounts' table but not the 'Users' table.

  return (
    <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div className="bg-white px-4 py-8 shadow sm:rounded-lg sm:px-10">
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          {variant === 'REGISTER' && (
            <Input label="Name" id="name" register={register} errors={errors} />
          )}
          <Input
            label="Email address"
            id="email"
            type="email"
            register={register}
            errors={errors}
            disabled={isLoading}
          />
          <Input
            label="Password"
            id="password"
            type="password"
            register={register}
            errors={errors}
            disabled={isLoading}
          />
          <div>
            <Button disabled={isLoading} fullWidth type="submit">
              {variant === 'LOGIN' ? 'Sign In' : 'Register'}
            </Button>
          </div>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-2 text-gray-500">
                Or continue with
              </span>
            </div>
          </div>

          <div className="mt-6 flex gap-2">
            <AuthSocialButton
              icon={BsGithub}
              onClick={() => socialAction('github')}
            />
            <AuthSocialButton
              icon={BsGoogle}
              onClick={() => socialAction('google')}
            />
          </div>
        </div>

        <div className="flex gap-2 justify-center text-sm mt-6 px-2 text-gray-500">
          <div>
            {variant === 'LOGIN'
              ? 'New to Messenger?'
              : 'Already have an account?'}
          </div>
          <div onClick={toggleVariant} className="underline cursor-pointer">
            {variant === 'LOGIN' ? 'Create an account' : 'Login'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;

/*
    In CSS, the inset property is used to specify the distance of an absolutely positioned element from the top, right, bottom, and left edges of its containing element.

    When applied, inset behaves similarly to using top, right, bottom, and left properties together. However, it provides a more concise way of expressing these values.

    The inset property accepts up to four values, representing the offsets from the top, right, bottom, and left edges of the containing element, respectively. The values can be specified in any order.

*/
