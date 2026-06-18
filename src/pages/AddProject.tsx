import React, { useState } from 'react';
import { Navbar } from '../components/Navbar';
import { UploadCloud, CheckCircle } from 'lucide-react';

export default function AddProject() {
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState('');
    const [description, setDescription] = useState('');
    const [imageUrl, setImageUrl] = useState('');

    // sucess state for showing the success message after form submission
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        console.log("Novo projeto submetido:", { title, category, description, imageUrl });

        setIsSubmitted(true);

        setTimeout(() => setIsSubmitted(false), 3000);
    };

    return (
        <div className="flex flex-col md:flex-row h-screen w-screen bg-gray-100 overflow-hidden font-sans">
            <div className="flex flex-col w-auto">
                <Navbar />
            </div>

            {/* principal form section */}
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
                        /* FORM */
                        <form onSubmit={handleSubmit} className="space-y-6">
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

                            <div className="flex flex-col space-y-2">
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
                                <label className="text-gray-700 font-medium text-lg">Cover Image URL</label>
                                <div className="flex items-center w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-4 focus-within:border-brand-pink focus-within:ring-2 focus-within:ring-brand-pink/20 transition-all">
                                    <UploadCloud className="text-gray-400 mr-3 flex-shrink-0" />
                                    <input
                                        type="url"
                                        required
                                        value={imageUrl}
                                        onChange={(e) => setImageUrl(e.target.value)}
                                        placeholder="https://..."
                                        className="w-full bg-transparent text-gray-800 outline-none"
                                    />
                                </div>
                                <p className="text-sm text-gray-400 ml-2">Paste a link to your project's main image (e.g., Unsplash, Imgur).</p>
                            </div>

                            <div className="pt-4">
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