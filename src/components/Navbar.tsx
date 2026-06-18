import { useState } from "react";
import NavbarButton from "./NavbarButton";
import { House, Plus, Star, Wallet, Smile, Settings, Menu, X } from 'lucide-react';
import { useAuth } from '../AuthContext';
import { Link } from "react-router";


export function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    const { userData } = useAuth(); // extract userData from the AuthContext


    return (
        <>
            <button
                onClick={toggleMenu}
                className="md:hidden fixed top-6 left-6 z-50 bg-brand-pink text-white p-2 rounded-lg shadow-md"
            >
                {/* Mostra o ícone X se estiver aberto, ou o ícone Menu se estiver fechado */}
                {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            <nav className={`
                fixed md:relative z-40
                flex flex-col h-[calc(100vh-3rem)] w-70
                bg-gradient-to-b from-brand-pink to-brand-red
                py-12 px-6 rounded-[20px] text-white shadow-lg font-sans m-6
                transition-transform duration-300 ease-in-out
                ${isOpen ? "translate-x-0" : "-translate-x-[120%]"}
                md:translate-x-0
            `}>
                <Link to="/profile">
                <div className="flex flex-col items-center mb-12">
                    <img
                        src={userData?.avatarUrl || "/assets/avatar.svg"}
                        alt="User Icon"
                        className="h-24 w-24 rounded-full border-4 border-white/30 mb-4 bg-white/10"
                    />
                    <h2 className="text-2xl font-bold tracking-wide">{userData?.name || "Student"}</h2>
                    <p className="text-sm font-light opacity-90">{userData?.email || "student@faul.pt"}</p>
                </div>
                </Link>
                <div className="flex flex-col space-y-3 flex-1 w-full mt-4">
                    <NavbarButton to="/feed" icon={<House />} label="homepage" />
                    <NavbarButton to="/add-project" icon={<Plus />} label="add project" />
                    <NavbarButton to="/reviews" icon={<Star />} label="my reviews" />
                    <NavbarButton to="/credits" icon={<Wallet />} label="credits" />
                    <NavbarButton to="/peers" icon={<Smile />} label="find peers" />
                    <NavbarButton to="/settings" icon={<Settings />} label="settings" />
                </div>

                <div className="flex justify-center mt-4 pb-4">
                    <img src="/assets/logo.svg" alt="LoopBACK Logo" className="h-8" />
                </div>
            </nav>


            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-30 md:hidden"
                    onClick={toggleMenu}
                />
            )}
        </>
    );
}