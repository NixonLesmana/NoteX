import React from 'react';
import Image from 'next/image';
import { RiSearchLine } from 'react-icons/ri';


const Navbar = () => {
    return (
        <header className="bg-white">
            <div className="mx-auto flex h-18 items-center justify-between gap-8 px-4 sm:px-6 lg:px-8">
                
                <a className="flex items-center gap-2" href="#">
                    <Image src="/assets/NoteX_logo.png" alt="logo" width={100} height={100} />
                    <h2>NoteX</h2>
                </a>

                <div className="relative">
                    <div className="flex items-center gap-2 border border-neutral-300 pr-2 py-2 rounded-md w-[375px]">
                        {/* Search bar */}
                        <div className="border-r border-neutral-300 px-2">
                            <RiSearchLine size={20} />
                        </div>
                        {/* Search input */}
                        <input type="text" className="outline-none" placeholder="Browse for Notes" />
                    </div>
                </div>

                <div className="flex items-center justify-end">

                    <div className="flex items-center gap-4">
                        <div className="sm:flex sm:gap-4">
                        <a className="block rounded-md bg-white border border-neutral-600 px-5 py-2.5 text-sm font-medium text-neutral transition hover:bg-(--secondary-color) hover:text-white" href="#">
                            Login
                        </a>

                        <a className="hidden rounded-md px-5 py-2.5 text-sm font-medium text-white bg-(--secondary-color) transition hover:bg-(--secondary-dark-color) sm:block" href="#">
                            Register
                        </a>
                        </div>

                        <button className="block rounded-sm bg-gray-100 p-2.5 text-gray-600 transition hover:text-gray-600/75 md:hidden">
                        <span className="sr-only">Toggle menu</span>
                        <svg xmlns="http://www.w3.org/2000/svg" className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16"></path>
                        </svg>
                        </button>
                    </div>

                </div>
            </div>
        </header>
    )
}

export default Navbar;