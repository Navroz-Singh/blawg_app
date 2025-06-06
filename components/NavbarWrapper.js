"use client";

import { usePathname } from 'next/navigation';
import Navbar from './Navbar';

export default function NavbarWrapper() {
  const pathname = usePathname();
  
  // Hide navbar on the myaccount route
  if (pathname === '/myaccount' || pathname === '/myaccount/settings') {
    return null;
  }
  
  return <Navbar />;
} 