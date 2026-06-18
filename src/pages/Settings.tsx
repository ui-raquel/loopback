import React, { useState } from 'react';
import { Navbar } from '../components/Navbar';
import { Save, User, Lock } from 'lucide-react';
import { useAuth } from '../AuthContext';

export default function Settings() {
    const { userData } = useAuth();
    const [name, setName] = useState(userData?.name || 'Lola Miller');
    const [email, setEmail] = useState(userData?.email || 'lolamiller@faul.pt');
    const [password, setPassword] = useState('');
    const [isSaved, setIsSaved] = useState(false);

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        // Simulação do envio dos novos dados para o servidor
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 3000);
    };

    return (
        <div className="flex flex-col md:flex-row h-screen w-screen bg-gray-100 overflow-hidden font-sans">
            <div className="flex flex-col w-auto">
                <Navbar />
            </div>

            <section className="flex flex-col flex-1 p-4 md:p-8 m-2 md:m-6 overflow-y-auto">
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-medium mb-2 leading-tight">Settings</h1>
                <h2 className="text-base md:text-xl lg:text-2xl font-light text-gray-500 mb-8 leading-tight">
                    Manage your personal account information
                </h2>

                <div className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-100 max-w-2xl w-full">
                    <form onSubmit={handleSave} className="space-y-6">

                        {/* Secção de Informação Pessoal */}
                        <div>
                            <div className="flex items-center gap-2 mb-4 text-brand-pink">
                                <User size={20} />
                                <h3 className="text-lg font-medium text-gray-800">Profile Information</h3>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="text-sm font-medium text-gray-600 block mb-1">Full Name</label>
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-800 outline-none focus:border-brand-pink"
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-600 block mb-1">Email Address</label>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-800 outline-none focus:border-brand-pink"
                                    />
                                </div>
                            </div>
                        </div>

                        <hr className="border-gray-100" />

                        {/* Secção de Segurança */}
                        <div>
                            <div className="flex items-center gap-2 mb-4 text-brand-pink">
                                <Lock size={20} />
                                <h3 className="text-lg font-medium text-gray-800">Security</h3>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-gray-600 block mb-1">New Password</label>
                                <input
                                    type="password"
                                    placeholder="Leave blank to keep current password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-800 outline-none focus:border-brand-pink"
                                />
                            </div>
                        </div>

                        {/* Botão de Guardar */}
                        <div className="pt-4 flex items-center gap-4">
                            <button
                                type="submit"
                                className="px-8 py-3 bg-brand-pink text-white font-medium rounded-xl flex items-center gap-2 hover:bg-[#c560a2] transition-colors"
                            >
                                <Save size={18} />
                                Save Changes
                            </button>

                            {isSaved && (
                                <span className="text-green-600 font-medium">Settings saved!</span>
                            )}
                        </div>
                    </form>
                </div>
            </section>
        </div>
    );
}