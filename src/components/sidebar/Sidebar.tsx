import getCurrentUser from '@/app/actions/getCurrentUser';
import DesktopSidebar from './DesktopSidebar';
import MobileFooter from './MobileFooter';

const Sidebar = async ({ children }: { children: React.ReactNode }) => {
  const currentUser = await getCurrentUser();
  return (
    <div className="h-full">
      <DesktopSidebar currentUser={currentUser!} />
      {/*Exclamation point means it is possible for the user to be null also */}
      <MobileFooter />
      <main className="lg:pl-20 h-full">{children}</main>
    </div>
  );
};

export default Sidebar;
