'use client';

import useOtherUser from '@/app/hooks/useOtherUser';
import { FullConversationType } from '@/app/types';
import Avatar from '@/components/Avatar';
import AvatarGroup from '@/components/AvatarGroup';
import clsx from 'clsx';
import { format } from 'date-fns';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useCallback, useMemo } from 'react';

interface ConversationBoxProps {
  data: FullConversationType;
  selected?: boolean;
}

const ConversationBox: React.FC<ConversationBoxProps> = ({
  data,
  selected,
}) => {
  const otherUser = useOtherUser(data);
  const session = useSession();
  const router = useRouter();

  const handleClick = useCallback(() => {
    router.push(`/conversations/${data.id}`);
  }, [data.id, router]);

  const lastMessage = useMemo(() => {
    const messages = data.messages || [];
    return messages[messages.length - 1];
  }, [data.messages]);

  const userEmail = useMemo(() => {
    return session.data?.user?.email;
  }, [session.data?.user?.email]);
  // the session hook needs some time to load so that is why we put it in the useMemo here so it is immediately
  // updated once it is loaded.

  const hasSeen = useMemo(() => {
    if (!lastMessage) {
      return false;
    }

    const seenArray = lastMessage.seen || [];
    // To prevent javascript from returning an error that we cannot use filter on an undefined variable, we
    // use the  '|| []' for safety

    if (!userEmail) {
      return false;
    }
    // we check if the userEmail is empty because as the session hook takes some time to load, if userEmail is not
    // available then there would be nothing we can use to compare it to in the seenArray filter code below

    return seenArray.filter((user) => user.email === userEmail).length !== 0;
    // the seenArray holds all the users who have seen the message sent and we filter them to only find the current
    // logged in user by finding the email that matches the logged in user. If we find the logged in user's email,
    // it means that the length is not equal to 0 and this returns a 'true' value.
  }, [userEmail, lastMessage]);

  const lastMessageText = useMemo(() => {
    if (lastMessage?.image) {
      return 'Sent an image';
    }

    if (lastMessage?.body) {
      return lastMessage.body;
    }

    return 'Start a conversation';
  }, [lastMessage]);

  return (
    <div
      onClick={handleClick}
      className={clsx(
        `
    w-full
    relative
    flex
    items-center
    space-x-3
    hover:bg-neutral-100
    rounded-lg
    transition
    cursor-pointer
    p-3
  `,
        selected ? 'bg-neutral-100' : 'bg-white'
      )}
    >
      {data.isGroup ? (
        <AvatarGroup users={data.users} />
      ) : (
        <Avatar user={otherUser} />
      )}

      <div className="min-w-0 flex-1">
        <div className="focus:outline-none">
          <div className="flex justify-between items-center mb-1">
            <p className="text-md font-medium text-gray-900">
              {data.name || otherUser.name}
            </p>
            {lastMessage?.createdAt && (
              <p className="text-xs text-gray-400 font-light">
                {format(new Date(lastMessage.createdAt), 'p')}
              </p>
            )}
          </div>
          <p
            className={clsx(
              `
            truncate
            text-sm
          `,
              hasSeen ? 'text-gray-500' : 'text-blue-500 font-medium'
            )}
          >
            {lastMessageText}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ConversationBox;
