'use client';

import React, { useState, useEffect, useContext } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Menu, X, Library, LayoutDashboard, LogIn, UserPlus, LogOut, User } from 'lucide-react';
import { AuthContext } from '@/providers/AuthContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, signOutUser } = useContext(AuthContext); // user context
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // ইউজার লগইন থাকলে এই লিঙ্কগুলো দেখাবে
  const navLinks = [
    { name: 'Browse', path: '/browse', icon: <BookOpen size={18} /> },
    { name: 'My Library', path: '/library', icon: <Library size={18} /> },
    { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={18} /> },
  ];

  return (
    <nav className={`fixed w-full z-50 transition-all duration-500 ${
      scrolled 
        ? 'bg-background/80 backdrop-blur-lg border-b border-border shadow-sm' 
        : 'bg-linear-to-b from-background/90 to-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="bg-primary p-2 rounded-xl group-hover:rotate-12 transition-transform duration-300 shadow-lg shadow-primary/20">
              <BookOpen className="text-primary-foreground" size={24} />
            </div>
            <span className="text-2xl font-bold text-primary tracking-tight">BookWorm</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {user && ( // শুধুমাত্র লগইন ইউজারদের জন্য
              <div className="flex space-x-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.path}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                      pathname === link.path 
                        ? 'bg-primary/10 text-primary' 
                        : 'text-foreground/70 hover:bg-primary/5 hover:text-primary'
                    }`}
                  >
                    {link.icon}
                    <span>{link.name}</span>
                  </Link>
                ))}
              </div>
            )}

            {/* Auth/Profile Section */}
            <div className="flex items-center space-x-4">
              {!user ? (
                <div className="flex items-center space-x-3">
                  <Link href="/login" className="text-sm font-bold text-foreground/80 hover:text-primary px-4 transition-colors">
                    Login
                  </Link>
                  <Link href="/register" className="btn-primary !py-2 !px-5 !text-sm">
                    <UserPlus size={16} /> Sign Up
                  </Link>
                </div>
              ) : (
                <div className="flex items-center gap-4">
                  <Link href="/profile" className="flex items-center gap-2 group">
                    <img 
                      src={user?.photoURL || 'https://cdn-icons-png.flaticon.com/512/149/149071.png'} 
                      alt="profile" 
                      className="w-10 h-10 rounded-full border-2 border-primary/20 object-cover"
                    />
                  </Link>
                  <button 
                    onClick={signOutUser}
                    className="p-2 text-foreground/60 hover:text-red-500 transition-colors"
                    title="Logout"
                  >
                    <LogOut size={20} />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-4">
             {user && (
               <Link href="/profile">
                 <img src={user?.photoURL} className="w-8 h-8 rounded-full" alt="profile" />
               </Link>
             )}
            <button onClick={() => setIsOpen(!isOpen)} className="p-2 text-primary">
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Sidebar (ইউজার লজিক সহ) */}
      <AnimatePresence>
        {isOpen && (
          <motion.div /* ... আপনার আগের মোশন কোড ... */ className="fixed inset-y-0 right-0 w-full max-w-xs bg-background z-[60] p-6 md:hidden border-l border-border">
             <div className="flex flex-col space-y-4">
                {user ? (
                  <>
                    {navLinks.map((link) => (
                      <Link key={link.name} href={link.path} onClick={() => setIsOpen(false)} className="flex items-center gap-3 p-4 bg-card border border-border rounded-2xl">
                        {link.icon} {link.name}
                      </Link>
                    ))}
                    <button onClick={() => { signOutUser(); setIsOpen(false); }} className="btn-secondary w-full text-red-500">
                      <LogOut size={18} /> Logout
                    </button>
                  </>
                ) : (
                  <div className="pt-6 flex flex-col gap-4">
                    <Link href="/login" onClick={() => setIsOpen(false)} className="btn-secondary w-full text-center">Login</Link>
                    <Link href="/register" onClick={() => setIsOpen(false)} className="btn-primary w-full text-center">Sign Up</Link>
                  </div>
                )}
             </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;