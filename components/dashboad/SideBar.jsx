'use client'
import { useRouter,usePathname } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import ThemeToggler from '../ui/ThemeToggler'


import {
    Home,
    FileText,
    Route,
    BookMarked,
    User2,
    HelpCircle,
    SidebarClose,
    SidebarOpen,
    LogOut
} from 'lucide-react'

const SideBar = ({ onLogout, collapsed, setCollapsed }) => {

    const router = useRouter()
    const pathname = usePathname()  // <-- get current path

    const toggleSidebar = () => setCollapsed(!collapsed)

    const navItems = [
        { label: 'Dashboard', icon: Home, path: '/dashboard' },
        { label: 'Assessments', icon: FileText, path: '/dashboard/quiz' },
        { label: 'Career Paths', icon: Route, path: '/dashboard/recommendations' },
        { label: 'Resources', icon: BookMarked, path: '/resources' }
    ]

    const bottomItems = [
        { label: 'Profile & Settings', icon: User2, path: '/dashboard/profile' },
        { label: 'Help Center', icon: HelpCircle, path: '/dashboard/help' }
    ]

    const Item = ({ icon: Icon, label, path }) => {
        const isActive = pathname === path

        return (
            <div
                onClick={() => router.push(path)}
                className={`flex items-center  gap-3 cursor-pointer px-2 py-2 rounded transition
                ${isActive ? 'bg-accent dark:bg-gray-700 font-semibold text-black dark:text-white'
                        : 'hover:bg-gray-300 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300'}`}
            >
                <Icon className="w-5 h-5" />
                {!collapsed && label}
            </div>
        )
    }

    return (
        <aside
            className={`${collapsed ? 'w-18' : 'w-64'}
            fixed top-0 left-0 h-screen z-50 
            bg-white pt-6 dark:bg-surface py-4 px-2
            flex flex-col justify-between 
            transition-all duration-300 ease-in-out`}
        >
            <nav className="space-y-6">
                <div className="flex items-center justify-between">
                    {!collapsed && (
                        <h1 className="text-xl font-bold text-foreground-light dark:text-foreground-dark">
                            Career Connect
                        </h1>
                    )}
                    <button
                        onClick={toggleSidebar}
                        className="text-gray-500 text-center dark:text-gray-400 hover:text-black dark:hover:text-white"
                    >
                        {collapsed ? <SidebarOpen /> : <SidebarClose />}
                    </button>
                </div>
                

                <div className="space-y-2 text-sm font-medium text-foreground-light dark:text-gray-300">
                    {navItems.map((item) => (
                        <Item key={item.label} {...item} />
                    ))}
                </div>


                <div className="mt-8 space-y-2 text-sm font-medium text-foreground-light dark:text-gray-300">

                    {bottomItems.map((item) => (
                        <Item key={item.label} {...item} />
                    ))}
                    <div className='flex items-center justify-between  py-2 '>
                        <ThemeToggler />
                    </div>
                </div>
            </nav>



            <div className="mt-8 text-sm text-gray-600 dark:text-muted">

                <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                        <Image
                            src="/avatar.jpg" // Replace with dynamic image or placeholder
                            alt="Profile"
                            className="w-10 h-10 rounded-full object-cover"
                            width={40}
                            height={40}
                        />
                        {!collapsed && (
                            <div className="flex flex-col">
                                <span className="font-semibold text-gray-800 dark:text-white">Alex Johnson</span>
                                <span className="text-xs text-gray-500 dark:text-gray-400">Student</span>
                            </div>
                        )}
                    </div>

                </div>
                {!collapsed && (
                    <button
                        onClick={onLogout} // Replace with your logout logic
                        className="mt-1 flex text-md text-gray-500 dark:text-foreground-dark hover:text-black cursor-pointer dark:hover:text-extra-muted transition"
                    >
                        <LogOut className="w-4 h-4" />
                        <span className='ml-4'>Logout</span>
                    </button>
                )}
            </div>

        </aside>
    )
}

export default SideBar
