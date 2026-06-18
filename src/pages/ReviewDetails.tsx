import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { MapPin, Lightbulb, ArrowLeft } from 'lucide-react';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';

export default function ReviewDetails() {
    const { reviewId } = useParams<{ reviewId: string }>();
    const navigate = useNavigate();

    const [review, setReview] = useState<any>(null);
    const [project, setProject] = useState<any>(null);
    const [reviewer, setReviewer] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [activePinId, setActivePinId] = useState<number | null>(null);

    useEffect(() => {
        const fetchDetails = async () => {
            if (!reviewId) return;

            try {
                // 1. Ler a avaliação
                const reviewRef = doc(db, 'reviews', reviewId);
                const reviewSnap = await getDoc(reviewRef);

                if (reviewSnap.exists()) {
                    const reviewData = reviewSnap.data();
                    setReview(reviewData);

                    const projectRef = doc(db, 'projects', reviewData.projectId);
                    const projectSnap = await getDoc(projectRef);
                    if (projectSnap.exists()) {
                        setProject(projectSnap.data());
                    }

                    const reviewerRef = doc(db, 'users', reviewData.reviewerId);
                    const reviewerSnap = await getDoc(reviewerRef);
                    if (reviewerSnap.exists()) {
                        setReviewer(reviewerSnap.data());
                    }
                }
            } catch (error) {
                console.error("Erro ao carregar dados da avaliação:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDetails();
    }, [reviewId]);

    if (loading) {
        return <div className="flex h-screen w-screen items-center justify-center bg-gray-100 text-gray-500 font-medium">Loading review details...</div>;
    }

    if (!review || !project) {
        return <div className="flex h-screen w-screen items-center justify-center bg-gray-100 text-gray-500 font-medium">Review not found.</div>;
    }

    return (
        <div className="flex flex-col md:flex-row h-screen w-screen bg-gray-100 overflow-hidden font-sans">
            <div className="hidden md:flex flex-col w-auto">
                <Navbar />
            </div>

            <section className="flex flex-col lg:flex-row flex-1 p-4 md:p-6 gap-6 overflow-hidden animate-page-in">

                {/* Coluna da Imagem */}
                <div className="flex-1 flex flex-col h-full bg-white rounded-[32px] shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-100 flex items-center gap-4">
                        <button onClick={() => navigate(-1)} className="text-gray-400 hover:text-gray-700 transition-colors">
                            <ArrowLeft size={24} />
                        </button>
                        <div>
                            <h1 className="text-2xl font-medium text-gray-900">Feedback on {project.title}</h1>
                            <p className="text-gray-500 font-light">Reviewed by {reviewer?.name || "Peer"}</p>
                        </div>
                    </div>

                    <div className="relative flex-1 bg-gray-50 overflow-auto flex items-center justify-center p-4">
                        <div className="relative shadow-sm cursor-default">
                            <img
                                src={project.reviewImageUrl}
                                alt="Project"
                                className="max-w-full h-auto rounded-lg"
                                style={{ maxHeight: '70vh' }}
                            />

                            {/* Renderização dos Pins em modo leitura */}
                            {review.pins?.map((pin: any, index: number) => (
                                <div
                                    key={pin.id}
                                    className={`absolute w-8 h-8 -ml-4 -mt-4 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md cursor-pointer transition-transform
                                        ${activePinId === pin.id ? 'bg-brand-red scale-110 z-10' : 'bg-brand-pink hover:scale-110'}`}
                                    style={{ left: `${pin.x}%`, top: `${pin.y}%` }}
                                    onClick={() => setActivePinId(pin.id)}
                                >
                                    {index + 1}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="w-full lg:w-96 flex flex-col gap-6 h-full overflow-y-auto pb-6">

                    <div className="bg-white p-6 rounded-[32px] shadow-sm border border-gray-100 flex-shrink-0">
                        <div className="flex items-center space-x-2 mb-4">
                            <Lightbulb className="text-brand-pink w-6 h-6" />
                            <h2 className="text-xl font-medium text-gray-900">Global Idea</h2>
                        </div>
                        <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4 text-gray-800 text-sm">
                            {review.globalIdea || "No global idea provided."}
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-[32px] shadow-sm border border-gray-100 flex-1 flex flex-col">
                        <div className="flex items-center space-x-2 mb-4">
                            <MapPin className="text-brand-pink w-6 h-6" />
                            <h2 className="text-xl font-medium text-gray-900">Pinned Feedback</h2>
                        </div>

                        {!review.pins || review.pins.length === 0 ? (
                            <div className="flex-1 flex flex-col items-center justify-center text-gray-400 opacity-60">
                                <p>No pins placed.</p>
                            </div>
                        ) : (
                            <div className="space-y-4 flex-1 overflow-y-auto pr-2">
                                {review.pins.map((pin: any, index: number) => (
                                    <div
                                        key={pin.id}
                                        className={`p-4 rounded-2xl border transition-all cursor-pointer ${activePinId === pin.id ? 'border-brand-red bg-red-50' : 'border-gray-100 bg-gray-50 hover:border-gray-200'}`}
                                        onClick={() => setActivePinId(pin.id)}
                                    >
                                        <div className="mb-2">
                                            <span className="font-bold text-gray-700 bg-white px-2 py-1 rounded-md shadow-sm text-sm border border-gray-100">
                                                Pin #{index + 1}
                                            </span>
                                        </div>
                                        <p className="text-gray-800 text-sm mt-2">{pin.text}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
}