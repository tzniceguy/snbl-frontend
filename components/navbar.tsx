'use client';
import React, { useState } from 'react'
import Link from 'next/link'
import { IoMenuOutline } from 'react-icons/io5'
import Image from 'next/image'
import { usePathname } from 'next/navigation'

export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const navitems = [
       {title: 'Home', href: '/'},
       {title: 'About', href: '/about'},
       {title: 'Contact', href: '/contact'},
       {title: 'Blog', href: '/blog'},
    ];

    const pathname = usePathname();

    return (
        <div className='relative p-6'>
            <div className='absolute top-10 left-8'>
                <Image 
                    src="/globe.svg" 
                    alt="Globe icon" 
                    width={36} 
                    height={36} 
                    priority
                />
            </div>
            
            <button 
                className='md:hidden absolute top-10 right-8 text-4xl'
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label="Toggle menu"
                aria-expanded={isMenuOpen}
            >
                <IoMenuOutline />
            </button>

            <nav className={`
                ${isMenuOpen ? 'block' : 'hidden'} 
                absolute top-24 left-0 right-0 bg-white shadow-lg rounded-lg
                md:shadow-none md:static  md:flex md:justify-center
            `}>
                <ul className='flex flex-col space-y-4 p-4 md:flex-row md:space-x-8 md:space-y-0 md:p-0'>
                    {navitems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <li key={item.title}>
                                <Link 
                                    href={item.href} 
                                    className={`
                                        block rounded-md px-3 py-2 text-sm font-medium 
                                        transition-colors duration-200
                                        ${isActive 
                                            ? 'bg-gray-100 text-gray-900' 
                                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                        }
                                    `}
                                    aria-current={isActive ? 'page' : undefined}
                                >
                                    {item.title}
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </nav>
        </div>
    );
}