'use client'; // <-- Essential for usePathname()

import React from 'react';
import { Home, MessageSquare, Users } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavItemProps {
    href: string;
    icon: React.ElementType;
    label: string;
    isActive: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ href, icon: Icon, label, isActive }) => {
    // Define color styles for active/inactive states using Reverb theme variables
    const activeClass = isActive
        ? 'bg-reverb-teal text-echo-white dark:bg-acoustic-blue dark:text-echo-white shadow-md'
        : 'text-soft-grey dark:text-soft-grey hover:bg-echo-white/60 dark:hover:bg-off-white-surface/20 transition-colors';

    return (
        <Link
            href={href}
            className={`flex items-center p-3 rounded-xl font-medium ${activeClass}`}
        >
            <Icon size={22} className="mr-3 flex-shrink-0" />
            <span className="text-sm">{label}</span>
        </Link>
    );
};

const SidebarNav: React.FC = () => {
    const currentPath = usePathname();

    const paths = {
        home: '/app',
        messages: '/app/messages',
        contacts: '/app/contacts',
    };

    return (
        <nav className="flex flex-col space-y-2 w-full">
            <NavItem
                href={paths.home}
                icon={Home}
                label="Home"
                isActive={currentPath === paths.home}
            />
            <NavItem
                href={paths.messages}
                icon={MessageSquare}
                label="Messages"
                isActive={currentPath.startsWith(paths.messages) || currentPath === '/app'}
            />
            <NavItem
                href={paths.contacts}
                icon={Users}
                label="Contacts"
                isActive={currentPath.startsWith(paths.contacts)}
            />
        </nav>
    );
};

export default SidebarNav;
