import Sidebar from '@/components/sidebar/Sidebar';
import ConversationList from './components/ConversationList';
import getConversations from '../actions/getConversations';
import getUsers from '../actions/getUsers';

export default async function ConversationsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const conversations = await getConversations();
  const users = await getUsers();

  return (
    <Sidebar>
      <div className="h-full">
        <ConversationList initialItems={conversations!} users={users} />
        {/* the exclamation mark (!) is used to assert that a value is not null or undefined. */}
        {children}
      </div>
    </Sidebar>
  );
}
