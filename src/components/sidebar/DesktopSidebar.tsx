'use client';

import useRoutes from '@/app/hooks/useRoutes';
import { use, useState } from 'react';
import DesktopItem from './DesktopItem';
import { User } from '@prisma/client';
import Avatar from '../Avatar';
import SettingsModal from './SettingsModal';

interface DesktopSidebarProps {
  currentUser: User;
}

const DesktopSidebar: React.FC<DesktopSidebarProps> = ({ currentUser }) => {
  const routes = useRoutes();
  const [isOpen, setIsOpen] = useState(false);

  // console.log(currentUser);

  return (
    <>
      <SettingsModal
        currentUser={currentUser}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
      <div
        className="
            hidden 
            lg:fixed 
            lg:inset-y-0 
            lg:left-0 
            lg:z-40 
            lg:w-20 
            xl:px-6 
            lg:overflow-y-auto 
            lg:bg-white 
            lg:border-r-[1px] 
            lg:pb-4 
            lg:flex 
            lg:flex-col 
            justify-between
        "
      >
        <nav className="mt-4 flex flex-col justify-between">
          <ul role="list" className="flex flex-col items-center space-y-1">
            {routes.map((item) => (
              <DesktopItem
                key={item.label}
                href={item.href}
                label={item.label}
                icon={item.icon}
                active={item.active}
                onClick={item.onClick}
              />
            ))}
          </ul>
        </nav>
        <nav className="mt-4 flex flex-col justify-between items-center">
          <div
            onClick={() => setIsOpen(true)}
            className="cursor-pointer hover:opacity-75 transition"
          >
            <Avatar user={currentUser} />
          </div>
        </nav>
      </div>
    </>
  );
};

export default DesktopSidebar;

/*
    The 'inset' property in CSS is used to set the top, right, bottom, and left properties of a positioned element
    simultaneously. It's essentially a shorthand for setting all four sides of an element's box model.
    Syntax: inset: <top> <right> <bottom> <left>;
    The 'inset' property is commonly used in combination with the 'position' property to precisely position elements
    on the page. It's especially useful for creating responsive layouts and aligning elements within containers.
*/

/*
    The 'space-y-1' class in Tailwind CSS is used to apply vertical spacing between child elements within a 
    container. Specifically, it adds a 'margin-bottom' property to all direct child elements of the container, 
    except for the last child, with a value of '0.25rem' by default, which equals 4 pixels.
*/
