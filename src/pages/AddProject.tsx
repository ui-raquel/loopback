import React, { useState } from 'react';
import { Navbar } from '../components/Navbar';
import { UploadCloud, CheckCircle, AlertCircle } from 'lucide-react';

// 1. Importar as ferramentas do Firebase e o Contexto
import { db } from '../firebase';
import { collection, addDoc, doc, updateDoc, increment, arrayUnion } from 'firebase/firestore';
import { useAuth } from '../AuthContext';

export default function AddProject() {
    // Extraímos os dados do utilizador autenticado
    const { user, userData } = useAuth();

    // Estados para guardar os dados do formulário
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState('');
    const [description, setDescription] = useState('');
    const [coverImageUrl, setCoverImageUrl] = useState('');
    const [reviewImageUrl, setReviewImageUrl] = useState('');
    const [complexity, setComplexity] = useState('');

    // Estados para controlo da interface
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [error, setError] = useState(''); // Novo estado para mostrar avisos de saldo

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(''); // Limpa erros antigos

        if (!user || !userData) return;

        let cost = 0;
        if (complexity === 'easy') cost = 20;
        else if (complexity === 'medium') cost = 40;
        else if (complexity === 'large') cost = 80;

        if (userData.credits < cost) {
            setError(`You need ${cost} credits to publish this project, but you only have ${userData.credits} CR.`);
            return; 
        }

        try {
            await addDoc(collection(db, 'projects'), {
                title: title,
                category: category,
                complexity: complexity,
                description: description,
                coverImageUrl: coverImageUrl,
                reviewImageUrl: reviewImageUrl,
                credits: cost, 
                authorId: user.uid,
                authorName: userData.name || "Student",
                createdAt: new Date().toISOString()
            });

            // 5. Retirar o dinheiro e guardar o talão no histórico
            const userRef = doc(db, 'users', user.uid);
            const today = new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });

            await updateDoc(userRef, {
                credits: increment(-cost),
                transactions: arrayUnion({
                    id: Date.now(),
                    type: 'spend',
                    description: `Published: ${title}`,
                    date: today,
                    amount: cost
                })
            });

            setIsSubmitted(true);

            setTimeout(() => {
                setIsSubmitted(false);
                setTitle('');
                setCategory('');
                setComplexity('');
                setDescription('');
                setCoverImageUrl('');
                setReviewImageUrl('');
            }, 3000);

        } catch (err) {
            console.error("Erro ao publicar projeto:", err);
            setError("Something went wrong while publishing. Please try again.");
        }
    };

    return (
        <div className="flex flex-col md:flex-row h-screen w-screen bg-gray-100 overflow-hidden font-sans">

            <div className="flex flex-col w-auto">
                <Navbar />
            </div>

            <section className="flex flex-col flex-1 p-4 md:p-8 m-2 md:m-6 overflow-y-auto">

                <h1 className="text-2xl md:text-3xl lg:text-4xl font-medium mb-2 leading-tight">Add New Project</h1>
                <h2 className="text-base md:text-xl lg:text-2xl font-light text-gray-500 mb-8 leading-tight">Share your work with the community to get valuable feedback</h2>

                <div className="bg-white p-8 md:p-10 rounded-[32px] shadow-sm border border-gray-100 max-w-3xl w-full">

                    {isSubmitted ? (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                            <CheckCircle className="w-20 h-20 text-brand-pink mb-4" />
                            <h3 className="text-3xl font-medium text-gray-800 mb-2">Project Uploaded!</h3>
                            <p className="text-gray-500 text-lg">Your project is now live and waiting for reviews.</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">

                            {/* Mostrar aviso vermelho se não houver saldo */}
                            {error && (
                                <div className="flex items-start bg-red-50 text-brand-red p-4 rounded-2xl border border-red-100 mb-6">
                                    <AlertCircle className="w-6 h-6 mr-3 flex-shrink-0 mt-0.5" />
                                    <p className="font-medium">{error}</p>
                                </div>
                            )}

                            <div className="flex flex-col space-y-2">
                                <label className="text-gray-700 font-medium text-lg">Project Title</label>
                                <input
                                    type="text"
                                    required
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="e.g., Financial Dashboard App"
                                    className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-4 text-gray-800 outline-none focus:border-brand-pink focus:ring-2 focus:ring-brand-pink/20 transition-all"
                                />
                            </div>

                            <div className="flex flex-col md:flex-row gap-6">
                                <div className="flex flex-col space-y-2 flex-1">
                                    <label className="text-gray-700 font-medium text-lg">Category</label>
                                    <select
                                        required
                                        value={category}
                                        onChange={(e) => setCategory(e.target.value)}
                                        className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-4 text-gray-800 outline-none focus:border-brand-pink focus:ring-2 focus:ring-brand-pink/20 transition-all appearance-none"
                                    >
                                        <option value="" disabled>Select a category...</option>
                                        <option value="UX/UI">UX/UI Design</option>
                                        <option value="FRONTEND">Frontend Development</option>
                                        <option value="BACKEND">Backend Development</option>
                                        <option value="MOBILE">Mobile App</option>
                                        <option value="DATA SCIENCE">Data Science</option>
                                    </select>
                                </div>

                                <div className="flex flex-col space-y-2 flex-1">
                                    <label className="text-gray-700 font-medium text-lg">Complexity Level</label>
                                    <select
                                        required
                                        value={complexity}
                                        onChange={(e) => setComplexity(e.target.value)}
                                        className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-4 text-gray-800 outline-none focus:border-brand-pink focus:ring-2 focus:ring-brand-pink/20 transition-all appearance-none"
                                    >
                                        <option value="" disabled>Select complexity...</option>
                                        <option value="easy">Easy (Costs 20 Credits)</option>
                                        <option value="medium">Medium (Costs 40 Credits)</option>
                                        <option value="large">Large (Costs 80 Credits)</option>
                                    </select>
                                </div>
                            </div>

                            <div className="flex flex-col space-y-2">
                                <label className="text-gray-700 font-medium text-lg">Description</label>
                                <textarea
                                    required
                                    rows={4}
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Briefly describe what your project is about..."
                                    className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-4 text-gray-800 outline-none focus:border-brand-pink focus:ring-2 focus:ring-brand-pink/20 transition-all resize-none"
                                />
                            </div>

                            <div className="flex flex-col space-y-2">
                                <label className="text-gray-700 font-medium text-lg">Cover Image URL (Feed)</label>
                                <div className="flex items-center w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-4 focus-within:border-brand-pink focus-within:ring-2 focus-within:ring-brand-pink/20 transition-all">
                                    <UploadCloud className="text-gray-400 mr-3 flex-shrink-0" />
                                    <input
                                        type="url" required
                                        value={coverImageUrl}
                                        onChange={(e) => setCoverImageUrl(e.target.value)}
                                        placeholder="https://..."
                                        className="w-full bg-transparent text-gray-800 outline-none"
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col space-y-2">
                                <label className="text-gray-700 font-medium text-lg">Review File URL (Annotation)</label>
                                <div className="flex items-center w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-4 focus-within:border-brand-pink focus-within:ring-2 focus-within:ring-brand-pink/20 transition-all">
                                    <UploadCloud className="text-gray-400 mr-3 flex-shrink-0" />
                                    <input
                                        type="url" required
                                        value={reviewImageUrl}
                                        onChange={(e) => setReviewImageUrl(e.target.value)}
                                        placeholder="https://..."
                                        className="w-full bg-transparent text-gray-800 outline-none"
                                    />
                                </div>
                            </div>

                            <div className="pt-4 flex items-center justify-between">
                                {/* Informação visual na UI para lembrar do custo atualizado */}
                                <div className="text-gray-500 font-medium">
                                    Current Balance: <span className="text-brand-pink font-bold">{userData?.credits || 0} CR</span>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full md:w-auto px-10 py-4 bg-gradient-to-r from-brand-pink to-brand-red text-white text-lg font-semibold rounded-2xl shadow-md hover:shadow-lg transform hover:-translate-y-1 transition-all"
                                >
                                    Publish Project
                                </button>
                            </div>
                        </form>
                    )}

                </div>
            </section>
        </div>
    );
}