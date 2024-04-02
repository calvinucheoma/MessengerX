'use client';

import { FullMessageType } from '@/app/types';
import Avatar from '@/components/Avatar';
import clsx from 'clsx';
import { format } from 'date-fns';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { useState } from 'react';
import ImageModal from './ImageModal';

interface MessageBoxProps {
  isLast?: boolean;
  data: FullMessageType;
}

const MessageBox: React.FC<MessageBoxProps> = ({ isLast, data }) => {
  const session = useSession();

  const [imageModalOpen, setImageModalOpen] = useState(false);

  const isOwn = session?.data?.user?.email === data?.sender?.email;

  const seenList = (data.seen || [])
    .filter((user) => user.email !== data?.sender?.email)
    .map((user) => user.name)
    .join(', ');
  // we add the empty array in case data.seen is undefined as JS would throw an error if we try to use .map or .filter on an undefined array
  // The '.join()' method in JavaScript is used to join all elements of an array into a single string.
  // It concatenates each element of the array with a specified separator (or a comma by default) between each pair
  // of adjacent elements. This method is commonly used when you need to convert an array into a string representation
  // If you want to display the elements of an array in a user interface or log message, you can use .join() to
  // format the array into a readable string.

  const container = clsx('flex gap-3 p-4', isOwn && 'justify-end');

  const avatar = clsx(isOwn && 'order-2');

  const body = clsx('flex flex-col gap-2', isOwn && 'items-end');

  const message = clsx(
    'text-sm w-fit overflow-hidden',
    isOwn ? 'bg-sky-500 text-white' : 'bg-gray-100',
    data.image ? 'rounded-md p-0' : 'rounded-full py-2 px-3'
  );

  return (
    <div className={container}>
      <div className={avatar}>
        <Avatar user={data.sender} />
      </div>
      <div className={body}>
        <div className="flex items-center gap-1">
          <div className="text-sm text-gray-500">{data.sender.name}</div>
          <div className="text-xs text-gray-400">
            {format(new Date(data.createdAt), 'p')}
          </div>
        </div>
        <div className={message}>
          <ImageModal
            src={data.image}
            isOpen={imageModalOpen}
            onClose={() => setImageModalOpen(false)}
          />
          {data.image ? (
            <Image
              src={data.image}
              height="288"
              width="288"
              alt="image"
              className="object-cover cursor-pointer hover:scale-110 transition translate"
              onClick={() => setImageModalOpen(true)}
            />
          ) : (
            <div>{data.body}</div>
          )}
        </div>
        {isLast && isOwn && seenList.length > 0 && (
          <div className="text-xs font-light text-gray-500">
            {`Seen by ${seenList}`}
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageBox;
