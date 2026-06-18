import React from 'react';
import { Link } from 'react-router-dom';

interface NavbarButtonProps {
    to: string;             
    icon: React.ReactNode;  
    label: string;         
}

export default function NavbarButton({ to, icon, label }: NavbarButtonProps) {
    return (
        <Link
            to={to}
            className="flex items-center space-x-4 bg-white/20 border border-white/40 hover:bg-white/30 transition-all rounded-2xl px-6 py-4 w-full text-white font-weight"
        >
            <span className="text-xl flex-shrink-0">
                {icon}
            </span>
            <span className="text-md font-regular">
                {label}
            </span>
        </Link>
    );
}