import React, { useState, useEffect } from 'react';
import { Navbar } from '../components/Navbar';
import { Save, User, Lock, AlertCircle, Trash2, AlertTriangle, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Importações do Firebase e Contexto
import { db, auth } from '../firebase';
import { doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { updateEmail, updatePassword, deleteUser, signOut } from 'firebase/auth';
import { useAuth } from '../AuthContext';

export default function Settings() {
    const { user, userData } = useAuth();
    const navigate = useNavigate();

    // Estados do formulário
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('');

    // Estados da interface
    const [isSaved, setIsSaved] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    // Carrega os dados iniciais
    useEffect(() => {
        if (userData && user) {
            setName(userData.name || '');
            setEmail(user.email || userData.email || '');
            setRole(userData.role || '');
        }
    }, [userData, user]);

    // Função para guardar alterações
    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        if (!user) return;

        try {
            const userRef = doc(db, 'users', user.uid);

            // Atualiza Nome e Cargo na Firestore
            if (name !== userData?.name || role !== userData?.role) {
                await updateDoc(userRef, {
                    name: name,
                    role: role
                });
            }

            // Atualiza Email
            if (email !== user.email) {
                await updateEmail(user, email);
                await updateDoc(userRef, { email: email });
            }

            // Atualiza Palavra-passe
            if (password.trim() !== '') {
                await updatePassword(user, password);
                setPassword('');
            }

            setIsSaved(true);
            setTimeout(() => setIsSaved(false), 3000);

        } catch (err: any) {
            console.error("Erro nas definições:", err);
            if (err.code === 'auth/requires-recent-login') {
                setError('Login expirado. Faz logout e login novamente para alterar dados de segurança.');
            } else {
                setError('Erro ao atualizar os dados. Verifica as tuas informações.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    // Função para terminar sessão
    const handleLogout = async () => {
        try {
            await signOut(auth);
            navigate('/');
        } catch (err) {
            console.error("Erro ao fazer logout:", err);
            setError('Ocorreu um erro ao terminar a sessão.');
        }
    };

    // Função para eliminar a conta
    const handleDeleteAccount = async () => {
        if (!user) return;

        const isConfirmed = window.confirm(
            "Tens a certeza de que queres apagar a tua conta? Esta ação é permanente e todos os teus dados e créditos serão perdidos."
        );

        if (!isConfirmed) return;

        setIsLoading(true);
        setError('');

        try {
            const userRef = doc(db, 'users', user.uid);
            await deleteDoc(userRef);
            await deleteUser(user);
            navigate('/');
        } catch (err: any) {
            console.error("Erro ao apagar conta:", err);
            if (err.code === 'auth/requires-recent-login') {
                setError('Para apagar a conta por motivos de segurança, precisas de fazer logout e login novamente, e tentar de imediato.');
            } else {
                setError('Ocorreu um erro ao tentar apagar a conta.');
            }
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col md:flex-row h-screen w-screen bg-gray-100 overflow-hidden font-sans">
            <div className="flex flex-col w-auto">
                <Navbar />
            </div>

            <section className="flex flex-col flex-1 p-4 md:p-8 m-2 md:m-6 overflow-y-auto">
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-medium mb-2 leading-tight">Settings</h1>
                <h2 className="text-base md:text-xl lg:text-2xl font-light text-gray-500 mb-8 leading-tight">
                    Manage your personal account information and security
                </h2>

                <div className="max-w-2xl w-full space-y-6">
                    {/* Bloco de Mensagem de Erro Geral */}
                    {error && (
                        <div className="flex items-start bg-red-50 text-brand-red p-4 rounded-2xl border border-red-100">
                            <AlertCircle className="w-6 h-6 mr-3 flex-shrink-0 mt-0.5" />
                            <p className="font-medium">{error}</p>
                        </div>
                    )}

                    {/* Formulário Principal */}
                    <div className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-100">
                        <form onSubmit={handleSave} className="space-y-8">

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
                                            required
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-800 outline-none focus:border-brand-pink"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-600 block mb-1">Role / Area of Study</label>
                                        <input
                                            type="text"
                                            placeholder="e.g., UX/UI Designer, Frontend Developer"
                                            value={role}
                                            onChange={(e) => setRole(e.target.value)}
                                            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-800 outline-none focus:border-brand-pink"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-600 block mb-1">Email Address</label>
                                        <input
                                            type="email"
                                            required
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
                            <div className="pt-2 flex items-center gap-4">
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className={`px-8 py-3 text-white font-medium rounded-xl flex items-center gap-2 transition-colors ${isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-brand-pink hover:bg-[#c560a2]'}`}
                                >
                                    <Save size={18} />
                                    {isLoading ? 'Saving...' : 'Save Changes'}
                                </button>

                                {isSaved && (
                                    <span className="text-green-600 font-medium">Settings saved!</span>
                                )}
                            </div>
                        </form>
                    </div>

                    {/* Secção de Sessão (Logout) */}
                    <div className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-100">
                        <div className="flex items-center gap-2 mb-2 text-gray-800">
                            <LogOut size={20} />
                            <h3 className="text-lg font-medium">Session</h3>
                        </div>
                        <p className="text-gray-500 text-sm mb-6">
                            Sign out of your account on this device.
                        </p>
                        <button
                            type="button"
                            onClick={handleLogout}
                            disabled={isLoading}
                            className="px-6 py-3 bg-gray-50 text-gray-700 font-medium rounded-xl border border-gray-200 flex items-center gap-2 hover:bg-gray-100 transition-colors"
                        >
                            <LogOut size={18} />
                            Sign Out
                        </button>
                    </div>

                    {/* Secção Danger Zone */}
                    <div className="bg-red-50 p-8 rounded-[32px] border border-red-100">
                        <div className="flex items-center gap-2 mb-2 text-red-600">
                            <AlertTriangle size={20} />
                            <h3 className="text-lg font-medium">Danger Zone</h3>
                        </div>
                        <p className="text-red-700/80 text-sm mb-6">
                            Once you delete your account, there is no going back. All your projects, credits, and network connections will be permanently removed.
                        </p>
                        <button
                            type="button"
                            onClick={handleDeleteAccount}
                            disabled={isLoading}
                            className="px-6 py-3 bg-white text-red-600 font-medium rounded-xl border border-red-200 flex items-center gap-2 hover:bg-red-600 hover:text-white transition-colors"
                        >
                            <Trash2 size={18} />
                            Delete Account
                        </button>
                    </div>

                </div>
            </section>
        </div>
    );
}