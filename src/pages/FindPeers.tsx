import { useState } from 'react';
import { Navbar } from '../components/Navbar';
import { Search, UserPlus, Check } from 'lucide-react';

export default function FindPeers() {
    // Lista de IDs dos utilizadores que estamos a seguir
    const [followingIds, setFollowingIds] = useState<number[]>([]);
    const [searchQuery, setSearchQuery] = useState('');

    // Dados simulados dos utilizadores
    const peers = [
        { id: 1, name: "Carlos Costa", email: "carlos@faul.pt", role: "Backend Developer" },
        { id: 2, name: "Maria Santos", email: "maria@faul.pt", role: "UX/UI Designer" },
        { id: 3, name: "João Silva", email: "joao@faul.pt", role: "Frontend Developer" },
        { id: 4, name: "Ana Lopes", email: "ana@faul.pt", role: "Mobile Developer" }
    ];

    // Função que alterna o estado de seguir
    const toggleFollow = (id: number) => {
        if (followingIds.includes(id)) {
            setFollowingIds(followingIds.filter(peerId => peerId !== id));
        } else {
            setFollowingIds([...followingIds, id]);
        }
    };

    // Filtra os utilizadores com base na pesquisa
    const filteredPeers = peers.filter(peer =>
        peer.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

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

                {/* Barra de Pesquisa */}
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

                {/* Grelha de Utilizadores */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredPeers.map(peer => {
                        const isFollowing = followingIds.includes(peer.id);
                        return (
                            <div key={peer.id} className="bg-white p-6 rounded-[24px] shadow-sm border border-gray-100 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 font-bold text-xl">
                                        {peer.name.charAt(0)}
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-800 text-lg">{peer.name}</h3>
                                        <p className="text-sm text-gray-500">{peer.role}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => toggleFollow(peer.id)}
                                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors flex items-center gap-2
                                        ${isFollowing
                                            ? 'bg-gray-100 text-gray-700 border border-gray-200'
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
                    })}
                </div>
            </section>
        </div>
    );
}