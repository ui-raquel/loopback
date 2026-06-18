// import React, { useState } from 'react';
import { useState } from 'react';
import { Navbar } from '../components/Navbar';
import { MessageSquare, ArrowRight } from 'lucide-react';

export default function MyReviews() {
    // 1. Estado para controlar qual separador está ativo
    const [activeTab, setActiveTab] = useState<'received' | 'given'>('received');

    // 2. Dados simulados das avaliações recebidas nos projetos do utilizador
    const reviewsReceived = [
        {
            id: 1,
            projectName: "App de Finanças",
            reviewer: "Carlos Costa",
            comment: "A paleta de cores funciona bem, mas os botões de ação precisam de mais contraste para facilitar a navegação.",
            date: "12 Junho 2026",
            rating: 4
        },
        {
            id: 2,
            projectName: "App de Finanças",
            reviewer: "Ana Lopes",
            comment: "Boa estrutura. Sugiro rever o alinhamento no ecrã de perfil.",
            date: "10 Junho 2026",
            rating: 5
        }
    ];

    // 3. Dados simulados das avaliações que o utilizador deu a outros projetos
    const reviewsGiven = [
        {
            id: 3,
            projectName: "Design System",
            author: "Maria Santos",
            comment: "A documentação dos componentes está clara. Adicionei um pino sobre a altura da barra de navegação em ecrãs mobile.",
            date: "15 Junho 2026",
            earnedCredits: 40
        },
        {
            id: 4,
            projectName: "API de Pagamentos",
            author: "João Silva",
            comment: "Identifiquei um erro na resposta do servidor quando o cartão não tem saldo. Deixei os detalhes na ideia global.",
            date: "05 Junho 2026",
            earnedCredits: 80
        }
    ];

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

                {/* 4. Separadores (Tabs) */}
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

                {/* 5. Área de Conteúdo Condicional */}
                <div className="bg-white p-6 md:p-8 rounded-[32px] shadow-sm border border-gray-100 flex-1">

                    {/* Renderiza a lista "Recebidas" se a tab ativa for 'received' */}
                    {activeTab === 'received' && (
                        <div className="space-y-6">
                            {reviewsReceived.length === 0 ? (
                                <p className="text-gray-500">No feedback received yet.</p>
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
                                        {/* A secção das estrelas foi removida daqui */}
                                        <div className="flex gap-3 mt-2">
                                            <MessageSquare className="text-brand-pink w-5 h-5 flex-shrink-0 mt-1" />
                                            <p className="text-gray-700">{review.comment}</p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    )}

                    {/* Renderiza a lista "Dadas" se a tab ativa for 'given' */}
                    {activeTab === 'given' && (
                        <div className="space-y-6">
                            {reviewsGiven.length === 0 ? (
                                <p className="text-gray-500">You haven't reviewed any projects yet.</p>
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