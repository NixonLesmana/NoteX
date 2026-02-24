"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NoteCreateModal } from "./modal/NoteCreateModal";
import { RiEarthLine, RiFolderOpenLine, RiUserHeartLine, RiUserLine } from "react-icons/ri";
import { useAuth } from "../store/useAuth";
import { imgUrl } from "../lib/url";
import { EditProfileModal } from "./modal/EditProfileModal";
import { AuthModal } from "./modal/AuthModal";

const Sidebar = () => {

    const path = usePathname();
    const navItems = [
        {label: "Explore", href: "/", icon: <RiEarthLine size={20}/>, auth: false},
        {label: "My Notes", href: "/my-note", icon: <RiFolderOpenLine size={20}/>, auth: true},
        {label: "My Favorites", href: "/favorites", icon: <RiUserHeartLine size={20}/>, auth: true},
        {label: "Profile", href: "/profile", icon: <RiUserLine size={20}/>, auth: true}
    ];

    const [openEdit, setOpenEdit] = useState(false);
    const [showAuth, setShowAuth] = useState(false);
    const [showModalCreate, setShowModalCreate] = useState(false);

    const { isAuthenticated, user } = useAuth();

    const handleCreateClick = () => {
        if(isAuthenticated()) setShowModalCreate(true)
        else setShowAuth(true)
    }

    const handleNavClick = (e, item) => {
        if (item.auth && !isAuthenticated()) {
            e.preventDefault()
            setShowAuth(true)
        }
    }

    const isActive = (href) => (href === "/" ? path === href : path.startsWith(href));

    return (
        <aside className='block fixed top-24 left-5 h-[calc(100vh-7.5rem)] w-64 bg-white p-4 shadow-lg border border-neutral-200 rounded-2xl z-40'>
            <div className='flex flex-col'>
                {user && (
                    <>
                        <div className='flex items-center gap-4' onClick={() => setOpenEdit(true)}>
        
                            <img 
                                src={`${imgUrl(user?.profile_img) || ''}`}
                                className="rounded-full w-16 h-16"
                                alt="profile user"
                            />
        
                            <div className='flex flex-col'>
                                <h2 className='font-bold text-xl'>
                                    {user?.username}
                                </h2>
                                <span className='text-sm break-all'>
                                    {user?.email}
                                </span>
                            </div>
        
                        </div>
        
                        <hr className='border-neutral-300 my-3'/>
                    </>
                )}

                <nav className='space y-2'>
                    {navItems.map(item => (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={(e) => handleNavClick(e, item)}
                            className={`flex items-center gap-3 px-3 py-4 rounded-xl transition font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--secondary-color) ${isActive(item.href) ? "bg-(--secondary-light-color) text-(--secondary-color)" : "hover:bg-neutral-100 text-neutral-600"}`}
                        >
                            {item.icon}
                            {item.label}
                        </Link>
                    ))}

                    <button
                        type='button'
                        className='inline-flex items-center justify-center h-12 w-full rounded-full bg-(--secondary-color) 
                        text-white font-medium transition py-4 hover:bg-(--secondary-dark-color) duration-150 cursor-pointer'
                        onClick={() => handleCreateClick}
                    >
                        Upload Notes
                    </button>
                </nav>
            </div>

            <NoteCreateModal open={showModalCreate} onClose={() => setShowModalCreate(false)} onCreated={() => setShowModalCreate(false)}/>
            <EditProfileModal open={openEdit} onClose={() => setOpenEdit(false)} />
            <AuthModal open={showAuth} onClose={() => setShowAuth(false)}/>
        </aside>
    )
}

export default Sidebar;