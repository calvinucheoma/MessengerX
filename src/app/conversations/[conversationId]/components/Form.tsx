'use client';

import useConversation from '@/app/hooks/useConversation';
import axios from 'axios';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import { HiPaperAirplane, HiPhoto } from 'react-icons/hi2';
import MessageInput from './MessageInput';
import { CldUploadButton } from 'next-cloudinary';

const Form = () => {
  const { conversationId } = useConversation();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      message: '',
    },
  });

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setValue('message', '', { shouldValidate: true });
    axios.post(`/api/messages`, { ...data, conversationId });
  };

  const handleUpload = (result: any) => {
    axios.post('/api/messages', {
      image: result?.info?.secure_url,
      conversationId,
    });
  };

  return (
    <div className="py-4 px-4 bg-white border-t flex items-center gap-2 lg:gap-4 w-full">
      <CldUploadButton
        options={{ maxFiles: 1 }}
        onSuccess={handleUpload}
        uploadPreset="mjgviag3"
      >
        <HiPhoto size={30} className="text-sky-500 cursor-pointer" />
      </CldUploadButton>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex items-center gap-2 lg:gap-4 w-full"
      >
        <MessageInput
          id="message"
          register={register}
          errors={errors}
          required
          placeholder="Write a message"
        />
        <button
          type="submit"
          className="rounded-full p-2 bg-sky-500 cursor-pointer hover:bg-sky-600 transition"
        >
          <HiPaperAirplane size={18} className="text-white" />
        </button>
      </form>
    </div>
  );
};

export default Form;

// 'shouldValidate' re-renders the function

/*
             HOW TO USE CLOUDINARY IN OUR NEXTJS APPLICATION

  •We start by installing a package called 'next-cloudinary'.

  •In our Cloudinary dashboard, after copying our cloudinary name displayed on our dashboard, we go to our.env file
   and paste this name in the variable name NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME.
  
  •Then, we go to cloudinary website again and on the bottom left corner of our screen, we click on the settings icon
   there and then click on 'Upload' section on the sidebar that opens in our settings page. Inside this section,
   we scroll down to where we find 'Upload presets' header and then click on the 'Add upload preset' link. 
   It takes us to a new page where we then have to changed Signing mode select option from 'signed' to 'unsigned'
   and then click on the 'Save' button at the top of our screen. It then takes us back to the Upload page where we
   now see a new preset that is unsigned, and we have to copy the unisgned text there(not the link address) and
   paste it in our 'uploadPreset' prop in our <CldUploadButton>.

*/
