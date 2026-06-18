import React, { useState, useEffect } from 'react';
import { Navbar } from '../components/Navbar';
import { Camera, Edit2, Trash2, X, FolderGit2, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { db } from '../firebase';
import { collection, query, where, onSnapshot, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { useAuth } from '../AuthContext';

const AVATAR_OPTIONS = [
    "https://sketchvalley.com/uploads/png/avatar1-avatar-pack-illustration.png",
    "https://sketchvalley.com/uploads/svg/avatar2-avatar-pack-illustration.svg",
    "https://sketchvalley.com/uploads/png/avatar3-avatar-pack-illustration.png",
    "https://sketchvalley.com/uploads/svg/avatar4-avatar-pack-illustration.svg",
    "https://sketchvalley.com/uploads/png/avatar5-avatar-pack-illustration.png",
    "https://sketchvalley.com/uploads/svg/avatar6-avatar-pack-illustration.svg",
    "https://sketchvalley.com/uploads/png/avatar7-avatar-pack-illustration.png",
    "https://sketchvalley.com/uploads/svg/avatar8-avatar-pack-illustration.svg",
    "https://sketchvalley.com/uploads/png/avatar9-avatar-pack-illustration.png",
    "https://sketchvalley.com/uploads/svg/avatar10-avatar-pack-illustration.svg",
    "https://sketchvalley.com/uploads/png/avatar11-avatar-pack-illustration.png",
    "https://sketchvalley.com/uploads/svg/avatar12-avatar-pack-illustration.svg"
];

export default function Profile() {
    const { user, userData } = useAuth();

    const [myProjects, setMyProjects] = useState<any[]>([]);

    const [showAvatarModal, setShowAvatarModal] = useState(false);
    const [selectedAvatar, setSelectedAvatar] = useState(userData?.avatarUrl || '');

    const [editingProject, setEditingProject] = useState<any>(null);
    const [editTitle, setEditTitle] = useState('');
    const [editCategory, setEditCategory] = useState('');
    const [editDescription, setEditDescription] = useState('');

    useEffect(() => {
        if (!user) return;

        const q = query(collection(db, 'projects'), where('authorId', '==', user.uid));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const projectsData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            const sorted = projectsData.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
            setMyProjects(sorted);
        });

        return () => unsubscribe();
    }, [user]);

    const handleSaveAvatar = async () => {
        if (!user) return;
        try {
            await updateDoc(doc(db, 'users', user.uid), { avatarUrl: selectedAvatar });
            setShowAvatarModal(false);
        } catch (error) {
            console.error("Erro ao guardar avatar:", error);
        }
    };

    const handleDeleteProject = async (projectId: string) => {
        const isConfirmed = window.confirm("Are you sure you want to delete this project? This action cannot be undone.");
        if (!isConfirmed) return;

        try {
            await deleteDoc(doc(db, 'projects', projectId));
        } catch (error) {
            console.error("Erro ao apagar projeto:", error);
        }
    };

    const openEditModal = (project: any) => {
        setEditingProject(project);
        setEditTitle(project.title);
        setEditCategory(project.category);
        setEditDescription(project.description);
    };

    const handleSaveProjectEdit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingProject) return;

        try {
            await updateDoc(doc(db, 'projects', editingProject.id), {
                title: editTitle,
                category: editCategory,
                description: editDescription
            });
            setEditingProject(null); // Fecha o modal
        } catch (error) {
            console.error("Erro ao editar projeto:", error);
        }
    };

    return (
        <div className="animate-page-in flex flex-col md:flex-row h-screen w-screen bg-gray-100 overflow-hidden font-sans relative">
            <div className="flex flex-col w-auto">
                <Navbar />
            </div>

            <section className="flex flex-col flex-1 p-4 md:p-8 m-2 md:m-6 overflow-y-auto">
                <div className="bg-white rounded-[32px] shadow-sm border border-gray-100 p-8 mb-8 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">
                    <div className="relative mt-8 group cursor-pointer" onClick={() => setShowAvatarModal(true)}>
                        <div className="w-32 h-32 bg-gray-200 rounded-full border-4 border-pink-200 shadow-md overflow-hidden flex items-center justify-center text-gray-400 font-bold text-4xl">
                            {userData?.avatarUrl ? (
                                <img src={userData.avatarUrl} alt="Profile" className="w-full h-full object-cover bg-pink-300" />
                            ) : (
                                userData?.name?.charAt(0) || "U"
                            )}
                        </div>
                        <div className="absolute inset-0 bg-black/40 rounded-full flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <Camera className="text-white w-8 h-8 mb-1" />
                            <span className="text-white text-xs font-medium">Change</span>
                        </div>
                    </div>

                    <div className="mt-8 text-center md:text-left flex-1">
                        <h1 className="text-3xl font-bold text-gray-900">{userData?.name || "Student"}</h1>
                        <p className="text-lg text-brand-pink font-medium">{userData?.role || "Member"}</p>
                        <p className="text-gray-500">{user?.email}</p>
                    </div>

                    <div className="mt-8 flex gap-4">
                        <div className="bg-gray-50 px-6 py-4 rounded-2xl text-center border border-gray-100">
                            <p className="text-2xl font-bold text-gray-800">{myProjects.length}</p>
                            <p className="text-sm text-gray-500 font-medium">Projects</p>
                        </div>
                        <div className="bg-gray-50 px-6 py-4 rounded-2xl text-center border border-gray-100">
                            <p className="text-2xl font-bold text-brand-pink">{userData?.credits || 0}</p>
                            <p className="text-sm text-gray-500 font-medium">Credits</p>
                        </div>
                    </div>
                </div>

                {/* SECÇÃO DOS PROJETOS */}
                <div className="flex items-center gap-3 mb-6">
                    <FolderGit2 className="text-gray-700 w-6 h-6" />
                    <h2 className="text-2xl font-medium text-gray-900">My Projects</h2>
                </div>

                {myProjects.length === 0 ? (
                    <div className="bg-white/60 border border-dashed border-gray-300 rounded-[32px] p-12 text-center">
                        <p className="text-gray-500 font-medium text-lg">You haven't published any projects yet.</p>
                        <Link to="/add-project" className="inline-block mt-4 px-6 py-3 bg-brand-pink text-white font-medium rounded-xl hover:bg-[#c560a2] transition-colors">
                            Publish your first project
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {myProjects.map(project => (
                            <div key={project.id} className="bg-white rounded-[24px] shadow-sm border border-gray-100 overflow-hidden flex flex-col">
                                <div className="h-40 w-full relative">
                                    <img src={project.coverImageUrl} alt={project.title} className="w-full h-full object-cover" />
                                    <div className="absolute top-3 right-3 bg-white/90 px-3 py-1 rounded-lg text-xs font-bold text-brand-pink">
                                        {project.category}
                                    </div>
                                </div>
                                <div className="p-5 flex flex-col flex-1">
                                    <h3 className="text-xl font-semibold text-gray-800 mb-1 line-clamp-1">{project.title}</h3>
                                    <p className="text-sm text-gray-500 line-clamp-2 mb-4">{project.description}</p>

                                    <div className="mt-auto flex items-center justify-between pt-4 border-t border-gray-50">
                                        {/* Botão de Ver Projeto (Redireciona para o Annotation) */}
                                        <Link to={`/annotation/${project.id}`} className="text-sm font-medium text-gray-600 hover:text-brand-pink transition-colors">
                                            View Details
                                        </Link>

                                        <div className="flex items-center gap-2">
                                            <button onClick={() => openEditModal(project)} className="p-2 text-gray-400 hover:text-blue-500 bg-gray-50 hover:bg-blue-50 rounded-lg transition-colors">
                                                <Edit2 size={18} />
                                            </button>
                                            <button onClick={() => handleDeleteProject(project.id)} className="p-2 text-gray-400 hover:text-red-500 bg-gray-50 hover:bg-red-50 rounded-lg transition-colors">
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            {/* MODAL: ESCOLHER AVATAR */}
            {showAvatarModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-[32px] p-8 max-w-md w-full shadow-2xl relative">
                        <button onClick={() => setShowAvatarModal(false)} className="absolute top-6 right-6 text-gray-400 hover:text-gray-700">
                            <X size={24} />
                        </button>
                        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Choose an Avatar</h2>

                        <div className="grid grid-cols-3 gap-4 mb-8">
                            {AVATAR_OPTIONS.map((url, index) => (
                                <div
                                    key={index}
                                    onClick={() => setSelectedAvatar(url)}
                                    className={`cursor-pointer rounded-2xl p-2 border-2 transition-all ${selectedAvatar === url ? 'border-brand-pink bg-pink-50' : 'border-transparent hover:bg-gray-50'}`}
                                >
                                    <img src={url} alt={`Avatar ${index}`} className="w-full h-auto bg-white rounded-xl shadow-sm" />
                                </div>
                            ))}
                        </div>

                        <button onClick={handleSaveAvatar} className="w-full py-4 bg-brand-pink text-white font-semibold rounded-xl hover:bg-[#c560a2] flex justify-center items-center gap-2">
                            <CheckCircle size={20} /> Save Avatar
                        </button>
                    </div>
                </div>
            )}

            {/* MODAL: EDITAR PROJETO */}
            {editingProject && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-[32px] p-8 max-w-xl w-full shadow-2xl relative max-h-[90vh] overflow-y-auto">
                        <button onClick={() => setEditingProject(null)} className="absolute top-6 right-6 text-gray-400 hover:text-gray-700">
                            <X size={24} />
                        </button>
                        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Edit Project</h2>

                        <form onSubmit={handleSaveProjectEdit} className="space-y-4">
                            <div>
                                <label className="text-sm font-medium text-gray-600 block mb-1">Project Title</label>
                                <input type="text" required value={editTitle} onChange={(e) => setEditTitle(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-brand-pink" />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-600 block mb-1">Category</label>
                                <select required value={editCategory} onChange={(e) => setEditCategory(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-brand-pink appearance-none">
                                    <option value="UX/UI">UX/UI Design</option>
                                    <option value="FRONTEND">Frontend Development</option>
                                    <option value="BACKEND">Backend Development</option>
                                    <option value="MOBILE">Mobile App</option>
                                    <option value="DATA SCIENCE">Data Science</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-600 block mb-1">Description</label>
                                <textarea required rows={4} value={editDescription} onChange={(e) => setEditDescription(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-brand-pink resize-none" />
                            </div>

                            <button type="submit" className="w-full py-4 mt-4 bg-gray-900 text-white font-semibold rounded-xl hover:bg-gray-800 transition-colors">
                                Save Changes
                            </button>
                        </form>
                    </div>
                </div>
            )}

        </div>
    );
}