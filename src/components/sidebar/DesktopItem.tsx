'use client';

import clsx from 'clsx';
import Link from 'next/link';

interface DesktopItemProps {
  label: string;
  icon: any;
  href: string;
  onClick?: () => void;
  active?: boolean;
}

const DesktopItem: React.FC<DesktopItemProps> = ({
  label,
  icon: Icon,
  href,
  onClick,
  active,
}) => {
  const handleClick = () => {
    if (onClick) {
      return onClick();
    }
  };

  return (
    <li onClick={handleClick}>
      <Link
        href={href}
        className={clsx(
          `
        group
        flex
        gap-x-3
        rounded-md
        p-3
        text-sm
        leading-6
        font-semibold
        text-gray-500
        hover:text-black
        hover:bg-gray-100
      `,
          active && 'bg-gray-100 text-black'
        )}
      >
        <Icon className="h-6 w-6 shrink-0" />
        <span className="sr-only">{label}</span>
      </Link>
    </li>
  );
};

export default DesktopItem;

/*
    The 'sr-only' class in Tailwind CSS is used to visually hide an element while keeping it accessible to 
    screen readers. It's commonly used to provide descriptive text or labels for visually impaired users without 
    cluttering the visual interface for sighted users.

    By applying the sr-only class to an element, you effectively hide it from sighted users while ensuring that 
    screen readers can still access its content. This is useful for providing context or descriptive text for 
    elements like icons, buttons, or other interactive elements that may not have visible labels.

*/
