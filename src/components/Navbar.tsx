// import React, { useState } from 'react';
import { useState } from "react";
import NavbarButton from "./NavbarButton";
import { House, Plus, Star, Wallet, Smile, Settings, Menu, X } from 'lucide-react';

export function Navbar() {
    // Definimos a variável de estado que controla a visibilidade do menu em mobile
    const [isOpen, setIsOpen] = useState(false);

    // Função que inverte o estado (de falso para verdadeiro e vice-versa)
    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    return (
        <>
            {/* 1. Botão de controlo (Aparece apenas em mobile) 
                A classe md:hidden oculta este botão em ecrãs médios e grandes.
                O z-50 garante que fica acima de todos os elementos.
            */}
            <button
                onClick={toggleMenu}
                className="md:hidden fixed top-6 left-6 z-50 bg-brand-pink text-white p-2 rounded-lg shadow-md"
            >
                {/* Mostra o ícone X se estiver aberto, ou o ícone Menu se estiver fechado */}
                {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* 2. Menu de Navegação 
                Adicionadas classes de transição (transition-transform) e posicionamento fixo.
                A expressão condicional dita se o menu é arrastado para fora do ecrã (-translate-x-[120%]) ou mantido visível (translate-x-0).
            */}
            <nav className={`
                fixed md:relative z-40
                flex flex-col h-[calc(100vh-3rem)] w-70
                bg-gradient-to-b from-brand-pink to-brand-red
                py-12 px-6 rounded-[20px] text-white shadow-lg font-sans m-6
                transition-transform duration-300 ease-in-out
                ${isOpen ? "translate-x-0" : "-translate-x-[120%]"}
                md:translate-x-0
            `}>
                <div className="flex flex-col items-center mb-12">
                    <img
                        src="/assets/avatar.svg"
                        alt="User Icon"
                        className="h-24 w-24 rounded-full border-4 border-white/30 mb-4 bg-white/10"
                    />
                    <h2 className="text-2xl font-bold tracking-wide">Lola Miller</h2>
                    <p className="text-sm font-light opacity-90">lolamiller@faul.pt</p>
                </div>
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

            {/* 3. Fundo Obscuro (Overlay) 
                Aparece apenas quando o menu está aberto em mobile.
                Clicar nele executa a função toggleMenu para fechar a navegação.
            */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-30 md:hidden"
                    onClick={toggleMenu}
                />
            )}
        </>
    );
}