import { useEffect, useState } from 'react';
import useActiveList from './useActiveList';
import { Channel, Members } from 'pusher-js';
import { pusherClient } from '../libs/pusher';

const useActiveChannel = () => {
  const { set, add, remove } = useActiveList();

  const [activeChannel, setActiveChannel] = useState<Channel | null>(null);

  useEffect(() => {
    let channel = activeChannel;

    if (!channel) {
      channel = pusherClient.subscribe('presence-messenger');
      // it has to be named 'presence-' and then something (any other name of our choice)
      setActiveChannel(channel);
    }

    channel.bind('pusher:subscription_succeeded', (members: Members) => {
      const initialMembers: string[] = [];

      members.each((member: Record<string, any>) =>
        initialMembers.push(member.id)
      );
      set(initialMembers);
      // 'members' is a special class from pusher and it is not treated as a normal array which is why we use 'each'method and not other
      // array methods like 'forEach' and 'map
    });
    // when we subscribe to this 'presence' channel, we get a list of all active members and we are going to set them in our global store
    // which we would use later on to compare who is active and who is not.

    channel.bind('pusher:member_added', (member: Record<string, any>) => {
      add(member.id);
    });

    channel.bind('pusher:member_removed', (member: Record<string, any>) => {
      remove(member.id);
    });

    return () => {
      if (activeChannel) {
        pusherClient.unsubscribe('presence-messenger');
        setActiveChannel(null);
      }
    };
  }, [activeChannel, set, add, remove]);
};

export default useActiveChannel;
