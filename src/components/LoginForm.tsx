import React from 'react';
import { useNavigate } from 'react-router-dom';
import { InputField } from './InputField'; // Ajusta o caminho de importação conforme necessário

export function LoginForm() {
    const navigate = useNavigate();

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        navigate('/feed');
    };

    return (
        <div className="w-full max-w-md bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-10">
            <h2 className="text-2xl font-bold text-gray-800 mb-1">
                Let's Get Started!
            </h2>
            <p className="text-gray-500 mb-8">Log in to join your peers</p>

            <form onSubmit={handleLogin}>
                {/* Utilizamos o nosso componente reutilizável */}
                <InputField
                    label="E-mail"
                    type="email"
                    placeholder="yourname@university.com"
                />

                <InputField
                    label="Password"
                    type="password"
                    placeholder="••••••••"
                />

                <label className="flex items-center gap-2 mb-8 mt-4 text-sm text-gray-600">
                    <input type="checkbox" className="rounded" />
                    Remember Me
                </label>

                <button
                    type="submit"
                    className="w-full bg-gradient-to-br from-brand-pink to-brand-red text-white font-medium py-3 rounded-xl hover:opacity-90 transition cursor-pointer"
                >
                    Log in
                </button>

                <p className="text-center text-sm text-gray-500 mt-6">
                    Don't have an account?{' '}
                    <span className="underline font-medium text-gray-700 cursor-pointer">
                        Sign Up
                    </span>
                </p>
            </form>
        </div>
    );
}