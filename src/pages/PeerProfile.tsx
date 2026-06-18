import { useState, useEffect } from 'react';
import { Navbar } from '../components/Navbar';
import { FolderGit2, UserPlus, Check, ArrowLeft } from 'lucide-react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { collection, query, where, onSnapshot, doc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { useAuth } from '../AuthContext';

export default function PeerProfile() {
    const { peerId } = useParams<{ peerId: string }>(); // ID do colega vindo do link
    const navigate = useNavigate();
    const { user, userData } = useAuth();

    const [peerData, setPeerData] = useState<any>(null);
    const [peerProjects, setPeerProjects] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const followingIds = userData?.following || [];
    const isFollowing = peerId ? followingIds.includes(peerId) : false;
    const isFollower = peerData?.following?.includes(user?.uid);
    const isMutual = isFollowing && isFollower;

    useEffect(() => {
        if (user && peerId === user.uid) {
            navigate('/profile');
        }
    }, [user, peerId, navigate]);

    useEffect(() => {
        if (!peerId) return;

        const unsubUser = onSnapshot(doc(db, 'users', peerId), (docSnap) => {
            if (docSnap.exists()) {
                setPeerData(docSnap.data());
            }
            setLoading(false);
        });

        const q = query(collection(db, 'projects'), where('authorId', '==', peerId));
        const unsubProjects = onSnapshot(q, (snapshot) => {
            const projectsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            const sorted = projectsData.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
            setPeerProjects(sorted);
        });

        return () => {
            unsubUser();
            unsubProjects();
        };
    }, [peerId]);

    // Lógica de Seguir / Deixar de Seguir
    const toggleFollow = async () => {
        if (!user || !peerId) return;
        const userRef = doc(db, 'users', user.uid);
        try {
            if (isFollowing) {
                await updateDoc(userRef, { following: arrayRemove(peerId) });
            } else {
                await updateDoc(userRef, { following: arrayUnion(peerId) });
            }
        } catch (error) {
            console.error("Erro ao atualizar rede:", error);
        }
    };

    if (loading) {
        return <div className="flex h-screen w-screen items-center justify-center bg-gray-100 text-gray-500 font-medium">Loading profile...</div>;
    }

    if (!peerData) {
        return <div className="flex h-screen w-screen items-center justify-center bg-gray-100 text-gray-500 font-medium">User not found.</div>;
    }

    return (
        <div className="flex flex-col md:flex-row h-screen w-screen bg-gray-100 overflow-hidden font-sans relative">
            <div className="flex flex-col w-auto">
                <Navbar />
            </div>

            <section className="flex flex-col flex-1 p-4 md:p-8 m-2 md:m-6 overflow-y-auto">

                {/* Botão de Voltar */}
                <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-500 hover:text-brand-pink mb-6 w-fit transition-colors">
                    <ArrowLeft size={20} /> Back to network
                </button>

                {/* CABEÇALHO DO PERFIL (Read-Only) */}
                <div className="bg-white rounded-[32px] shadow-sm border border-gray-100 p-8 mb-8 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-gray-200 to-gray-100"></div>

                    <div className="relative mt-8">
                        <div className="w-32 h-32 bg-gray-200 rounded-full border-4 border-white shadow-md overflow-hidden flex items-center justify-center text-gray-400 font-bold text-4xl">
                            {peerData?.avatarUrl ? (
                                <img src={peerData.avatarUrl} alt="Profile" className="w-full h-full object-cover bg-white" />
                            ) : (
                                peerData?.name?.charAt(0) || "U"
                            )}
                        </div>
                    </div>

                    <div className="mt-8 text-center md:text-left flex-1">
                        <div className="flex items-center justify-center md:justify-start gap-3">
                            <h1 className="text-3xl font-bold text-gray-900">{peerData.name || "Student"}</h1>
                            {isMutual && <span className="bg-brand-pink/10 text-brand-pink px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">Mutual Peer</span>}
                        </div>
                        <p className="text-lg text-gray-600 font-medium mt-1">{peerData.role || "Member"}</p>
                    </div>

                    <div className="mt-8 flex flex-col gap-4 items-center md:items-end">
                        <button
                            onClick={toggleFollow}
                            className={`px-6 py-3 rounded-xl text-sm font-bold transition-colors flex items-center gap-2 shadow-sm
                                ${isFollowing
                                    ? 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-red-50 hover:text-red-600 hover:border-red-100'
                                    : 'bg-brand-pink text-white hover:bg-[#c560a2]'
                                }`}
                        >
                            {isFollowing ? <> <Check size={18} /> Following </> : <> <UserPlus size={18} /> Follow </>}
                        </button>
                    </div>
                </div>

                {/* SECÇÃO DOS PROJETOS */}
                <div className="flex items-center gap-3 mb-6">
                    <FolderGit2 className="text-gray-700 w-6 h-6" />
                    <h2 className="text-2xl font-medium text-gray-900">{peerData.name.split(' ')[0]}'s Projects</h2>
                </div>

                {peerProjects.length === 0 ? (
                    <div className="bg-white/60 border border-dashed border-gray-300 rounded-[32px] p-12 text-center">
                        <p className="text-gray-500 font-medium text-lg">This student hasn't published any projects yet.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {peerProjects.map(project => (
                            <div key={project.id} className="bg-white rounded-[24px] shadow-sm border border-gray-100 overflow-hidden flex flex-col hover:shadow-md transition-shadow">
                                <div className="h-40 w-full relative">
                                    <img src={project.coverImageUrl} alt={project.title} className="w-full h-full object-cover" />
                                    <div className="absolute top-3 right-3 bg-white/90 px-3 py-1 rounded-lg text-xs font-bold text-brand-pink">
                                        {project.category}
                                    </div>
                                </div>
                                <div className="p-5 flex flex-col flex-1">
                                    <h3 className="text-xl font-semibold text-gray-800 mb-1 line-clamp-1">{project.title}</h3>
                                    <p className="text-sm text-gray-500 line-clamp-2 mb-4">{project.description}</p>

                                    <div className="mt-auto pt-4 border-t border-gray-50">
                                        <Link to={`/annotation/${project.id}`} className="block w-full text-center py-2 bg-gray-50 text-gray-700 font-medium rounded-xl hover:bg-brand-pink hover:text-white transition-colors">
                                            Review Project
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}