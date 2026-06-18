import { useState, useEffect } from 'react';
import { Navbar } from '../components/Navbar';
import { Search, UserPlus, Check, Users } from 'lucide-react';

// Importações do Firebase e Contexto
import { db } from '../firebase';
import { collection, onSnapshot, doc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { useAuth } from '../AuthContext';

export default function FindPeers() {
    const { user, userData } = useAuth(); 
    const [searchQuery, setSearchQuery] = useState('');
    const [peers, setPeers] = useState<any[]>([]);

    const followingIds = userData?.following || [];

    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, 'users'), (snapshot) => {
            const usersData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            // para filtrar o utilizador atual da lista
            const otherUsers = usersData.filter(u => u.id !== user?.uid);
            setPeers(otherUsers);
        });

        return () => unsubscribe();
    }, [user]);

    const toggleFollow = async (id: string) => {
        if (!user) return;
        const userRef = doc(db, 'users', user.uid);
        
        try {
            if (followingIds.includes(id)) {
                await updateDoc(userRef, { following: arrayRemove(id) });
            } else {
                await updateDoc(userRef, { following: arrayUnion(id) });
            }
        } catch (error) {
            console.error("Erro ao atualizar rede:", error);
        }
    };

    const filteredPeers = peers.filter(peer =>
        peer.name?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Listas divididas para as secções
    const networkPeers = filteredPeers.filter(peer => followingIds.includes(peer.id));
    const discoverPeers = filteredPeers.filter(peer => !followingIds.includes(peer.id));

    const renderUserCard = (peer: any) => {
        const isFollowing = followingIds.includes(peer.id);
        const isFollower = peer.following?.includes(user?.uid);
        const isMutual = isFollowing && isFollower;

        return (
            <div key={peer.id} className="bg-white p-6 rounded-[24px] shadow-sm border border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 font-bold text-xl uppercase">
                        {peer.name?.charAt(0) || "U"}
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-800 text-lg">{peer.name || "Student"}</h3>
                        <p className={`text-sm font-medium ${isMutual ? 'text-brand-pink' : 'text-gray-500'}`}>
                            {isMutual ? "✨ Peer" : (peer.role || "Member")}
                        </p>
                    </div>
                </div>
                <button
                    onClick={() => toggleFollow(peer.id)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors flex items-center gap-2
                        ${isFollowing
                            ? 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-red-50 hover:text-red-600 hover:border-red-100'
                            : 'bg-brand-pink/10 text-brand-pink hover:bg-brand-pink hover:text-white'
                        }`}
                >
                    {isFollowing ? (
                        <> <Check size={16} /> Following </>
                    ) : (
                        <> <UserPlus size={16} /> Follow </>
                    )}
                </button>
            </div>
        );
    };

    return (
        <div className="flex flex-col md:flex-row h-screen w-screen bg-gray-100 overflow-hidden font-sans">
            <div className="flex flex-col w-auto">
                <Navbar />
            </div>

            <section className="flex flex-col flex-1 p-4 md:p-8 m-2 md:m-6 overflow-y-auto">
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-medium mb-2 leading-tight">Find Peers</h1>
                <h2 className="text-base md:text-xl lg:text-2xl font-light text-gray-500 mb-8 leading-tight">
                    Connect with other students and build your network
                </h2>

                <div className="flex items-center bg-white px-5 py-4 rounded-2xl shadow-sm border border-gray-100 mb-8 max-w-2xl">
                    <Search className="text-brand-pink w-6 h-6 mr-3 flex-shrink-0" />
                    <input
                        type="text"
                        placeholder="Search peers by name..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-transparent outline-none text-lg text-gray-700 placeholder-gray-400"
                    />
                </div>

                <div className="mb-10">
                    <div className="flex items-center gap-2 mb-4">
                        <Users className="text-brand-pink w-5 h-5" />
                        <h3 className="text-xl font-medium text-gray-900">Your Network</h3>
                    </div>
                    
                    {networkPeers.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {networkPeers.map(renderUserCard)}
                        </div>
                    ) : (
                        /* Mensagem de estado vazio se não seguir ninguém */
                        <div className="bg-white/60 border border-dashed border-gray-300 rounded-[24px] p-8 text-center max-w-2xl">
                            <p className="text-gray-500 font-medium text-lg">Your network is empty.</p>
                            <p className="text-gray-400 text-sm mt-1">
                                Use the discover section below to follow other students. If they follow you back, you'll become Peers!
                            </p>
                        </div>
                    )}
                </div>

                {discoverPeers.length > 0 && (
                    <div>
                        <h3 className="text-xl font-medium text-gray-900 mb-4">Discover</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {discoverPeers.map(renderUserCard)}
                        </div>
                    </div>
                )}

                {filteredPeers.length === 0 && (
                    <div className="text-gray-500 text-center mt-10 text-lg">
                        No students found matching your search.
                    </div>
                )}
            </section>
        </div>
    );
}