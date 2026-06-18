import { useState, useEffect } from 'react';
import { Navbar } from '../components/Navbar';
import { MessageSquare, ArrowRight } from 'lucide-react';
import { db } from '../firebase';
import { collection, onSnapshot } from 'firebase/firestore';
import { useAuth } from '../AuthContext';
import { Link } from 'react-router-dom';

export default function MyReviews() {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState<'received' | 'given'>('received');

    const [reviews, setReviews] = useState<any[]>([]);
    const [projects, setProjects] = useState<any[]>([]);
    const [usersList, setUsersList] = useState<any[]>([]);

    useEffect(() => {
        if (!user) return;

        const unsubReviews = onSnapshot(collection(db, 'reviews'), (snap) =>
            setReviews(snap.docs.map(d => ({ id: d.id, ...d.data() })))
        );
        const unsubProjects = onSnapshot(collection(db, 'projects'), (snap) =>
            setProjects(snap.docs.map(d => ({ id: d.id, ...d.data() })))
        );
        const unsubUsers = onSnapshot(collection(db, 'users'), (snap) =>
            setUsersList(snap.docs.map(d => ({ id: d.id, ...d.data() })))
        );

        return () => {
            unsubReviews();
            unsubProjects();
            unsubUsers();
        };
    }, [user]);

    const reviewsGiven: any[] = [];
    const reviewsReceived: any[] = [];

    const sortedReviews = [...reviews].sort((a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    sortedReviews.forEach(review => {
        const project = projects.find(p => p.id === review.projectId);
        const reviewer = usersList.find(u => u.id === review.reviewerId);

        if (!project) return; //ignroe if the project was deleted

        const dateFormatted = new Date(review.createdAt).toLocaleDateString('en-US', {
            day: 'numeric', month: 'short', year: 'numeric'
        });

        const commentText = review.globalIdea || "Feedback provided via Pins. Check the project to see details.";

        if (review.reviewerId === user?.uid) {
            reviewsGiven.push({
                id: review.id,
                projectName: project.title,
                author: project.authorName,
                comment: commentText,
                date: dateFormatted,
                earnedCredits: project.credits
            });
        }

        if (project.authorId === user?.uid) {
            reviewsReceived.push({
                id: review.id,
                projectName: project.title,
                reviewer: reviewer?.name || "A Peer",
                comment: commentText,
                date: dateFormatted
            });
        }
    });

    return (
        <div className="flex flex-col md:flex-row h-screen w-screen bg-gray-100 overflow-hidden font-sans">

            <div className="flex flex-col w-auto">
                <Navbar />
            </div>

            <section className="flex flex-col flex-1 p-4 md:p-8 m-2 md:m-6 overflow-y-auto">

                <h1 className="text-2xl md:text-3xl lg:text-4xl font-medium mb-2 leading-tight">My Reviews</h1>
                <h2 className="text-base md:text-xl lg:text-2xl font-light text-gray-500 mb-8 leading-tight">
                    Track the feedback you received and the reviews you provided
                </h2>

                <div className="flex space-x-4 mb-8">
                    <button
                        onClick={() => setActiveTab('received')}
                        className={`px-6 py-3 rounded-2xl font-medium transition-colors ${activeTab === 'received'
                            ? 'bg-brand-pink text-white shadow-md'
                            : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                            }`}
                    >
                        Received Feedback
                    </button>
                    <button
                        onClick={() => setActiveTab('given')}
                        className={`px-6 py-3 rounded-2xl font-medium transition-colors ${activeTab === 'given'
                            ? 'bg-brand-pink text-white shadow-md'
                            : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                            }`}
                    >
                        Reviews Given
                    </button>
                </div>

                <div className="bg-white p-6 md:p-8 rounded-[32px] shadow-sm border border-gray-100 flex-1">

                    {activeTab === 'received' && (
                        <div className="space-y-6">
                            {reviewsReceived.length === 0 ? (
                                <div className="text-center py-10 text-gray-500">
                                    <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-20" />
                                    <p>No feedback received yet. Upload more projects to get reviews!</p>
                                </div>
                            ) : (
                                reviewsReceived.map(review => (
                                    <div key={review.id} className="p-6 bg-gray-50 rounded-2xl border border-gray-100 flex flex-col gap-3">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="text-lg font-semibold text-gray-800">{review.projectName}</h3>
                                                <p className="text-sm text-gray-500">Reviewed by <span className="font-medium text-gray-700">{review.reviewer}</span></p>
                                            </div>
                                            <span className="text-sm text-gray-400">{review.date}</span>
                                        </div>
                                        <div className="flex gap-3 mt-2">
                                            <MessageSquare className="text-brand-pink w-5 h-5 flex-shrink-0 mt-1" />
                                            <p className="text-gray-700 line-clamp-2">{review.comment}</p>
                                        </div>

                                        {/* Nova ligação para a página de detalhes */}
                                        <div className="mt-2 pt-3 border-t border-gray-200">
                                            <Link to={`/review/${review.id}`} className="text-sm font-medium text-brand-pink hover:text-[#c560a2] flex items-center gap-1">
                                                Read full feedback
                                            </Link>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    )}

                    {activeTab === 'given' && (
                        <div className="space-y-6">
                            {reviewsGiven.length === 0 ? (
                                <div className="text-center py-10 text-gray-500">
                                    <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-20" />
                                    <p>You haven't reviewed any projects yet. Go to the feed to earn credits!</p>
                                </div>
                            ) : (
                                reviewsGiven.map(review => (
                                    <div key={review.id} className="p-6 bg-gray-50 rounded-2xl border border-gray-100 flex flex-col gap-3">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-sm text-gray-500">You reviewed</span>
                                                    <ArrowRight size={16} className="text-gray-400" />
                                                    <h3 className="text-lg font-semibold text-gray-800">{review.projectName}</h3>
                                                </div>
                                                <p className="text-sm text-gray-500 mt-1">Author: <span className="font-medium text-gray-700">{review.author}</span></p>
                                            </div>
                                            <div className="flex flex-col items-end">
                                                <span className="text-sm text-gray-400 mb-1">{review.date}</span>
                                                <span className="bg-green-100 text-green-700 font-semibold px-3 py-1 rounded-lg text-sm">
                                                    +{review.earnedCredits} Credits
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex gap-3 mt-2">
                                            <MessageSquare className="text-brand-pink w-5 h-5 flex-shrink-0 mt-1" />
                                            <p className="text-gray-700">{review.comment}</p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    )}

                </div>
            </section>
        </div>
    );
}