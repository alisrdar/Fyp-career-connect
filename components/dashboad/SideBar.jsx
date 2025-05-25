// components/Sidebar.jsx
'use client'

import React from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Image from 'next/image'
import ThemeToggler from '../ui/ThemeToggler'
import { useDarkMode } from '@/context/ThemeContext'
import Link from 'next/link'
import { LogOut } from 'lucide-react'
import {
    HomeIcon,
    DocumentTextIcon,
    MapIcon,
    BookmarkIcon,
    UserIcon,
    QuestionMarkCircleIcon,
    Bars3Icon,
    XMarkIcon,
    ChevronRightIcon,
} from '@heroicons/react/24/outline'

const navSections = [
    {
        title: 'Main',
        items: [
            { label: 'Dashboard', icon: HomeIcon, path: '/dashboard' },
            { label: 'Assessments', icon: DocumentTextIcon, path: '/quiz' },
            { label: 'Career Paths', icon: MapIcon, path: '/dashboard/recommendations' },
            { label: 'Resources', icon: BookmarkIcon, path: '/resources' },
        ],
    },
    {
        title: 'General',
        items: [
            { label: 'Profile & Settings', icon: UserIcon, path: '/dashboard/profile' },
            { label: 'Help Center', icon: QuestionMarkCircleIcon, path: '/dashboard/help' },
        ],
    },
]

const NavItem = ({ icon: Icon, label, isActive, collapsed, onClick }) => (
    <button
        onClick={onClick}
        className={
            `w-full flex items-center gap-3 rounded transition-colors duration-200 focus:outline-none  ` +
            (isActive
                ? 'bg-white shadow dark:bg-less-dark text-gray-900 dark:text-white'
                : 'hover:bg-white hover:shadow  dark:hover:bg-less-dark text-gray-600 dark:text-gray-300') +
            (collapsed ? ' justify-center py-2' : ' py-2 px-4')
        }
    >
        <Icon
            className={`w-6 h-6 flex-shrink-0 1 cursor-pointer 
                 ${isActive ? 'fill-current stroke-gray-100 dark:stroke-less-dark' : 'fill-none stroke-current'}
            `}
            

        />
        {!collapsed && <span className="flex-1 text-sm text-left">{label}</span>}
    </button>
)

export default function Sidebar({ sidebarOpen, setSidebarOpen, collapsed, setCollapsed, onLogout }) {
    const { theme } = useDarkMode()
    const router = useRouter()
    const pathname = usePathname()

    const closeMobile = () => setSidebarOpen(false)
    const toggleDesktop = () => setCollapsed(!collapsed)

    const logoSrc =
        theme === "dark" ? "/pgec_logo_white_Svg.png" : "/pegcLogo_black.png";

    return (
        <>
            <aside
                className={`
                fixed top-0 left-0 h-full z-50
                bg-gray-100 dark:bg-surface
                flex flex-col
                transform transition-transform duration-300
                border-r border-gray-200 dark:border-gray-800
                ${sidebarOpen ? 'translate-x-0' : '-translate-x-full sm:translate-x-0'}
                w-64 ${collapsed ? 'sm:w-18' : 'sm:w-54'}
            `}

            >
                <button
                    onClick={toggleDesktop}
                    aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                    className={`
                        hidden lg:flex md:flex sm:flex
                        absolute top-4
                         items-center justify-center
                        w-8 h-8
                        bg-white dark:bg-surface
                        border border-gray-200 dark:border-gray-700
                        rounded-full
                        shadow-md
                        transition-transform
                        ${collapsed
                            ? '-right-4 rotate-0'         /* collapsed: arrow points right */
                            : '-right-4 rotate-180'       /* expanded: arrow points left */
                        }
        `}
                >
                    <ChevronRightIcon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                </button>
                {/* Toggle & Title */}
                <div className="flex items-center justify-between px-4 sm:px-0 py-3 ">

                    <Link href={"/dashboard"} className='px-4 cursor-pointer flex flex-shrink-0 items-center gap-2'>
                        <Image
                            src={logoSrc}
                            alt="Career Connect Logo"
                            width={!collapsed ? 42 : 38}
                            height={!collapsed ? 42 : 38}
                            className="object-contain"
                            priority
                        />
                        {!collapsed && (
                            <h2 className='text-md font-bold text-foreground-light dark:text-foreground-dark pt-2'>
                                Career Connect
                            </h2>
                        )}
                    </Link>
                    <button className="sm:hidden" onClick={closeMobile}>
                        <XMarkIcon className="w-6 h-6 text-gray-700 dark:text-gray-300" />
                    </button>
                </div>

                {/* Sections */}
                <div className="flex-1 overflow-y-auto space-y-4">

                    {navSections.map((section) => (
                        <div key={section.title} className="px-2">
                            {!collapsed &&
                                <p className="px-4 py-1 text-xs font-semibold text-gray-400 uppercase">
                                    {section.title}
                                </p>}
                            <div className="space-y-1">
                                {section.items.map((item) => (
                                    <NavItem
                                        key={item.path}
                                        {...item}
                                        isActive={pathname === item.path}
                                        collapsed={collapsed}
                                        onClick={() => {
                                            router.push(item.path)
                                            closeMobile()
                                        }}
                                    />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Bottom */}
                <div className="px-2 pb-3 space-y-1">


                    {!collapsed &&
                        (<p className="px-4 my-0 text-xs font-semibold text-gray-400 uppercase">
                            System
                        </p>)
                    }
                    <div className="flex items-center gap-2 px-2">
                        <ThemeToggler className='text-gray-700' />
                        {!collapsed && (
                            <span className="text-sm text-gray-700 dark:text-gray-300">Dark mode</span>
                        )}
                    </div>


                    <div className="space-y-1.5">

                        <div className="flex items-center gap-2 p-2">
                            <Image
                                src="https://cdn0.iconfinder.com/data/icons/education-and-school-filled-outline-1/128/boy_student_study_school_man_high_school_avatar-512.png"
                                alt="Profile"
                                width={36}
                                height={36}
                                className="rounded-full object-cover"
                            />
                            {!collapsed &&
                                (<div>
                                    <p className="text-sm font-medium text-gray-900 dark:text-white">Alex Johnson</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Student</p>
                                </div>
                                )}
                        </div>

                        <button
                            onClick={onLogout}
                            className="flex items-center gap-4 w-full py-0 px-4 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition"
                        >
                            <LogOut className="w-5 h-5" />
                            {!collapsed && <span className="text-sm">Log out</span>}
                        </button>
                    </div>
                </div>
            </aside>
        </>
    )
}
