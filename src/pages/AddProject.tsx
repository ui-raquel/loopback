import React, { useState } from 'react';
import { Navbar } from '../components/Navbar';
import { CheckCircle, AlertCircle, Link as LinkIcon, Image as ImageIcon } from 'lucide-react';

import { db, storage } from '../firebase'; // Importamos o storage!
import { collection, addDoc, doc, updateDoc, increment, arrayUnion } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'; // Funções de upload
import { useAuth } from '../AuthContext';

export default function AddProject() {
    const { user, userData } = useAuth();

    const [title, setTitle] = useState('');
    const [category, setCategory] = useState('');
    const [description, setDescription] = useState('');
    const [complexity, setComplexity] = useState('');

    // Estados para as imagens (Link ou Ficheiro)
    const [coverMode, setCoverMode] = useState<'link' | 'upload'>('link');
    const [coverImageUrl, setCoverImageUrl] = useState('');
    const [coverFile, setCoverFile] = useState<File | null>(null);

    const [reviewMode, setReviewMode] = useState<'link' | 'upload'>('link');
    const [reviewImageUrl, setReviewImageUrl] = useState('');
    const [reviewFile, setReviewFile] = useState<File | null>(null);

    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isUploading, setIsUploading] = useState(false); // Para mostrar "A carregar..." no botão
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!user || !userData) return;

        let cost = 0;
        if (complexity === 'easy') cost = 20;
        else if (complexity === 'medium') cost = 40;
        else if (complexity === 'large') cost = 80;

        if (userData.credits < cost) {
            setError(`You need ${cost} credits to publish this project, but you only have ${userData.credits} CR.`);
            return;
        }

        // Verifica se os campos estão preenchidos dependendo do modo
        if (coverMode === 'upload' && !coverFile) { setError("Please upload a cover image."); return; }
        if (reviewMode === 'upload' && !reviewFile) { setError("Please upload a review image."); return; }

        setIsUploading(true); // Bloqueia o botão enquanto faz upload

        try {
            let finalCoverUrl = coverImageUrl;
            let finalReviewUrl = reviewImageUrl;

            // UPLOAD DA CAPA (se escolheu upload)
            if (coverMode === 'upload' && coverFile) {
                // Cria uma referência única no Storage (ex: projects/123456789_imagem.png)
                const coverRef = ref(storage, `projects/${Date.now()}_cover_${coverFile.name}`);
                await uploadBytes(coverRef, coverFile); // Envia o ficheiro
                finalCoverUrl = await getDownloadURL(coverRef); // Pede o link público final
            }

            // UPLOAD DA REVIEW (se escolheu upload)
            if (reviewMode === 'upload' && reviewFile) {
                const reviewRef = ref(storage, `projects/${Date.now()}_review_${reviewFile.name}`);
                await uploadBytes(reviewRef, reviewFile);
                finalReviewUrl = await getDownloadURL(reviewRef);
            }

            // A partir daqui, o código é igual ao que já tinhas!
            await addDoc(collection(db, 'projects'), {
                title, category, complexity, description,
                coverImageUrl: finalCoverUrl, // Usa o link do upload OU o link colado
                reviewImageUrl: finalReviewUrl,
                credits: cost,
                authorId: user.uid,
                authorName: userData.name || "Student",
                createdAt: new Date().toISOString()
            });

            const userRef = doc(db, 'users', user.uid);
            const today = new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });

            await updateDoc(userRef, {
                credits: increment(-cost),
                transactions: arrayUnion({
                    id: Date.now(), type: 'spend', description: `Published: ${title}`, date: today, amount: cost
                })
            });

            setIsSubmitted(true);

            setTimeout(() => {
                setIsSubmitted(false);
                setTitle(''); setCategory(''); setComplexity(''); setDescription('');
                setCoverImageUrl(''); setCoverFile(null);
                setReviewImageUrl(''); setReviewFile(null);
            }, 3000);

        } catch (err) {
            console.error("Erro ao publicar:", err);
            setError("Something went wrong while uploading files or publishing.");
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="flex flex-col md:flex-row h-screen w-screen bg-gray-100 overflow-hidden font-sans">
            <div className="flex flex-col w-auto"><Navbar /></div>

            <section className="flex flex-col flex-1 p-4 md:p-8 m-2 md:m-6 overflow-y-auto">
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-medium mb-2 leading-tight">Add New Project</h1>
                <h2 className="text-base md:text-xl lg:text-2xl font-light text-gray-500 mb-8 leading-tight">Share your work with the community to get valuable feedback</h2>

                <div className="bg-white p-8 md:p-10 rounded-[32px] shadow-sm border border-gray-100 max-w-3xl w-full">
                    {isSubmitted ? (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                            <CheckCircle className="w-20 h-20 text-brand-pink mb-4" />
                            <h3 className="text-3xl font-medium text-gray-800 mb-2">Project Uploaded!</h3>
                            <p className="text-gray-500 text-lg">Your project is now live.</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {error && (
                                <div className="flex items-start bg-red-50 text-brand-red p-4 rounded-2xl border border-red-100 mb-6">
                                    <AlertCircle className="w-6 h-6 mr-3 flex-shrink-0 mt-0.5" />
                                    <p className="font-medium">{error}</p>
                                </div>
                            )}

                            {/* ... Título, Categoria, Complexidade e Descrição ficam EXATAMENTE iguais ao que tinhas ... */}
                            <div className="flex flex-col space-y-2">
                                <label className="text-gray-700 font-medium text-lg">Project Title</label>
                                <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-4 text-gray-800 outline-none focus:border-brand-pink focus:ring-2 focus:ring-brand-pink/20 transition-all" />
                            </div>

                            <div className="flex flex-col md:flex-row gap-6">
                                <div className="flex flex-col space-y-2 flex-1">
                                    <label className="text-gray-700 font-medium text-lg">Category</label>
                                    <select required value={category} onChange={(e) => setCategory(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-4 text-gray-800 outline-none focus:border-brand-pink focus:ring-2 focus:ring-brand-pink/20 transition-all appearance-none">
                                        <option value="" disabled>Select a category...</option>
                                        <option value="UX/UI">UX/UI Design</option>
                                        <option value="FRONTEND">Frontend Development</option>
                                        <option value="MOBILE">Mobile App</option>
                                    </select>
                                </div>
                                <div className="flex flex-col space-y-2 flex-1">
                                    <label className="text-gray-700 font-medium text-lg">Complexity Level</label>
                                    <select required value={complexity} onChange={(e) => setComplexity(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-4 text-gray-800 outline-none focus:border-brand-pink focus:ring-2 focus:ring-brand-pink/20 transition-all appearance-none">
                                        <option value="" disabled>Select complexity...</option>
                                        <option value="easy">Easy (Costs 20 Credits)</option>
                                        <option value="medium">Medium (Costs 40 Credits)</option>
                                        <option value="large">Large (Costs 80 Credits)</option>
                                    </select>
                                </div>
                            </div>

                            <div className="flex flex-col space-y-2">
                                <label className="text-gray-700 font-medium text-lg">Description</label>
                                <textarea required rows={4} value={description} onChange={(e) => setDescription(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-4 text-gray-800 outline-none resize-none" />
                            </div>

                            {/* NOVA ÁREA: Cover Image com Tabs */}
                            <div className="flex flex-col space-y-2 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                                <div className="flex items-center justify-between mb-2">
                                    <label className="text-gray-700 font-medium text-lg">Cover Image</label>
                                    <div className="flex bg-gray-200 p-1 rounded-lg">
                                        <button type="button" onClick={() => setCoverMode('link')} className={`px-3 py-1 rounded-md text-sm font-medium flex items-center gap-1 ${coverMode === 'link' ? 'bg-white shadow-sm text-brand-pink' : 'text-gray-500'}`}>
                                            <LinkIcon size={16} /> Link
                                        </button>
                                        <button type="button" onClick={() => setCoverMode('upload')} className={`px-3 py-1 rounded-md text-sm font-medium flex items-center gap-1 ${coverMode === 'upload' ? 'bg-white shadow-sm text-brand-pink' : 'text-gray-500'}`}>
                                            <ImageIcon size={16} /> Upload
                                        </button>
                                    </div>
                                </div>
                                {coverMode === 'link' ? (
                                    <input type="url" required value={coverImageUrl} onChange={(e) => setCoverImageUrl(e.target.value)} placeholder="https://..." className="w-full bg-white border border-gray-200 rounded-xl px-5 py-3 outline-none" />
                                ) : (
                                    <input type="file" accept="image/*" onChange={(e) => setCoverFile(e.target.files?.[0] || null)} className="w-full bg-white border border-gray-200 rounded-xl px-5 py-3 outline-none file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-brand-pink/10 file:text-brand-pink hover:file:bg-brand-pink/20" />
                                )}
                            </div>

                            {/* NOVA ÁREA: Review Image com Tabs */}
                            <div className="flex flex-col space-y-2 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                                <div className="flex items-center justify-between mb-2">
                                    <label className="text-gray-700 font-medium text-lg">Review File</label>
                                    <div className="flex bg-gray-200 p-1 rounded-lg">
                                        <button type="button" onClick={() => setReviewMode('link')} className={`px-3 py-1 rounded-md text-sm font-medium flex items-center gap-1 ${reviewMode === 'link' ? 'bg-white shadow-sm text-brand-pink' : 'text-gray-500'}`}>
                                            <LinkIcon size={16} /> Link
                                        </button>
                                        <button type="button" onClick={() => setReviewMode('upload')} className={`px-3 py-1 rounded-md text-sm font-medium flex items-center gap-1 ${reviewMode === 'upload' ? 'bg-white shadow-sm text-brand-pink' : 'text-gray-500'}`}>
                                            <ImageIcon size={16} /> Upload
                                        </button>
                                    </div>
                                </div>
                                {reviewMode === 'link' ? (
                                    <input type="url" required value={reviewImageUrl} onChange={(e) => setReviewImageUrl(e.target.value)} placeholder="https://..." className="w-full bg-white border border-gray-200 rounded-xl px-5 py-3 outline-none" />
                                ) : (
                                    <input type="file" accept="image/*" onChange={(e) => setReviewFile(e.target.files?.[0] || null)} className="w-full bg-white border border-gray-200 rounded-xl px-5 py-3 outline-none file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-brand-pink/10 file:text-brand-pink hover:file:bg-brand-pink/20" />
                                )}
                            </div>

                            <div className="pt-4 flex items-center justify-between">
                                <div className="text-gray-500 font-medium">
                                    Current Balance: <span className="text-brand-pink font-bold">{userData?.credits || 0} CR</span>
                                </div>
                                <button
                                    type="submit"
                                    disabled={isUploading}
                                    className={`w-full md:w-auto px-10 py-4 text-white text-lg font-semibold rounded-2xl shadow-md transition-all ${isUploading ? 'bg-gray-400 cursor-wait' : 'bg-gradient-to-r from-brand-pink to-brand-red hover:shadow-lg transform hover:-translate-y-1'}`}
                                >
                                    {isUploading ? 'Uploading files...' : 'Publish Project'}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </section>
        </div>
    );
}