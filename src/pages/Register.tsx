import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HeroSection } from '../components/HeroSection'; 
import { InputField } from '../components/InputField'; 

// Importamos a Autenticação e a Base de Dados
import { auth, db } from '../firebase';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

export default function Register() {
    return (
        <div className="min-h-screen w-full bg-gradient-to-br from-brand-pink to-brand-red flex flex-col lg:flex-row items-center justify-between px-8 lg:px-20 py-10 gap-10 overflow-y-auto">
            {/* left side - Branding */}
            <HeroSection />

            {/* right side - Form */}
            <RegisterForm />
        </div>
    );
}

function RegisterForm() {
    const navigate = useNavigate();

    // Os nossos 4 campos essenciais
    const [name, setName] = useState('');
    const [university, setUniversity] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            // 1. Criar o utilizador na Autenticação do Firebase
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // 2. Adicionar o Nome ao perfil básico do Firebase
            await updateProfile(user, { displayName: name });

            // 3. Guardar os dados extra na Base de Dados (Firestore)
            // Criamos um documento na coleção "users" com o ID único do utilizador
            await setDoc(doc(db, "users", user.uid), {
                name: name,
                email: email,
                university: university,
                credits: 0, // Toda a gente começa com 0 créditos!
                createdAt: new Date().toISOString()
            });

            // 4. Redirecionar para o feed
            navigate('/feed');

        } catch (err: any) {
            console.error("Erro no registo:", err);
            setError("Error creating account. Ensure your password is at least 6 characters long.");
        }
    };

    return (
        <div className="w-full max-w-md bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-10">
            <h2 className="text-2xl font-bold text-gray-800 mb-1">Join the Community</h2>
            <p className="text-gray-500 mb-8">Create your account to start reviewing</p>

            {error && (
                <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg mb-4 border border-red-100">
                    {error}
                </div>
            )}

            <form onSubmit={handleRegister} className="space-y-4">
                <InputField
                    label="Full Name"
                    type="text"
                    placeholder="Lola Miller"
                    value={name}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
                />

                <InputField
                    label="University / School"
                    type="text"
                    placeholder="e.g., FAUL"
                    value={university}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUniversity(e.target.value)}
                />

                <InputField
                    label="E-mail"
                    type="email"
                    placeholder="yourname@university.com"
                    value={email}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                />

                <InputField
                    label="Password"
                    type="password"
                    placeholder="•••••••• (Min. 6 chars)"
                    value={password}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                />

                <button
                    type="submit"
                    className="w-full bg-gradient-to-br from-brand-pink to-brand-red text-white font-medium py-3 rounded-xl hover:opacity-90 transition cursor-pointer mt-6"
                >
                    Create Account
                </button>

                <p className="text-center text-sm text-gray-500 mt-6">
                    Already have an account?{' '}
                    <span
                        onClick={() => navigate('/login')}
                        className="underline font-medium text-gray-700 cursor-pointer hover:text-brand-pink"
                    >
                        Log In
                    </span>
                </p>
            </form>
        </div>
    );
}