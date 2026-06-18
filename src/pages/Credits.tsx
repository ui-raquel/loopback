// import React, { useState } from 'react';
import { useState } from 'react';
import { Navbar } from '../components/Navbar';
import { Wallet, Info, ArrowUpRight, ArrowDownRight, History } from 'lucide-react';

export default function Credits() {
    // O utilizador começa com 0 créditos
    const [balance] = useState(0);

    // Lista vazia para representar o histórico inicial
    // Numa aplicação real, estes dados viriam da base de dados
    const transactionHistory: any[] = [];

    return (
        <div className="flex flex-col md:flex-row h-screen w-screen bg-gray-100 overflow-hidden font-sans">

            <div className="flex flex-col w-auto">
                <Navbar />
            </div>

            <section className="flex flex-col flex-1 p-4 md:p-8 m-2 md:m-6 overflow-y-auto">

                <h1 className="text-2xl md:text-3xl lg:text-4xl font-medium mb-2 leading-tight">Your Credits</h1>
                <h2 className="text-base md:text-xl lg:text-2xl font-light text-gray-500 mb-8 leading-tight">Manage your balance and learn how to earn more</h2>

                <div className="flex flex-col lg:flex-row gap-8">

                    {/* Coluna Esquerda: Saldo e Regras */}
                    <div className="flex-1 flex flex-col gap-8">

                        {/* Cartão de Saldo Atual */}
                        <div className="bg-gradient-to-r from-brand-pink to-brand-red p-8 rounded-[32px] text-white shadow-md flex items-center justify-between">
                            <div>
                                <p className="text-white/80 text-lg mb-1">Available Balance</p>
                                <h3 className="text-5xl font-bold">{balance}</h3>
                            </div>
                            <Wallet className="w-16 h-16 opacity-80" />
                        </div>

                        {/* Cartão de Explicação de Ganhos */}
                        <div className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-100">
                            <div className="flex items-center gap-3 mb-6">
                                <Info className="text-brand-pink w-6 h-6" />
                                <h3 className="text-2xl font-medium text-gray-900">How to earn credits?</h3>
                            </div>
                            <p className="text-gray-600 mb-6 text-lg">
                                You start with 0 credits. To earn credits to publish your own projects, you must review projects from other students. The amount of credits you earn depends on the complexity of the project you review.
                            </p>

                            <div className="space-y-4">
                                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                    <div>
                                        <p className="font-semibold text-gray-800 text-lg">Easy</p>
                                        <p className="text-gray-500 text-sm">Simple projects with few screens.</p>
                                    </div>
                                    <span className="bg-brand-pink/10 text-brand-pink font-bold px-4 py-2 rounded-xl">
                                        +20 Credits
                                    </span>
                                </div>

                                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                    <div>
                                        <p className="font-semibold text-gray-800 text-lg">Medium</p>
                                        <p className="text-gray-500 text-sm">Standard projects with moderate functionality.</p>
                                    </div>
                                    <span className="bg-brand-pink/10 text-brand-pink font-bold px-4 py-2 rounded-xl">
                                        +40 Credits
                                    </span>
                                </div>

                                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                    <div>
                                        <p className="font-semibold text-gray-800 text-lg">Large / Complex</p>
                                        <p className="text-gray-500 text-sm">Full applications or complex systems.</p>
                                    </div>
                                    <span className="bg-brand-pink/10 text-brand-pink font-bold px-4 py-2 rounded-xl">
                                        +80 Credits
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Coluna Direita: Histórico de Transações */}
                    <div className="flex-1 bg-white p-8 rounded-[32px] shadow-sm border border-gray-100 flex flex-col">
                        <div className="flex items-center gap-3 mb-6">
                            <History className="text-gray-700 w-6 h-6" />
                            <h3 className="text-2xl font-medium text-gray-900">Transaction History</h3>
                        </div>

                        {transactionHistory.length === 0 ? (
                            <div className="flex-1 flex flex-col items-center justify-center text-gray-400 opacity-80 py-10">
                                <History className="w-12 h-12 mb-4 opacity-50" />
                                <p className="text-lg">No transactions yet.</p>
                                <p className="text-sm mt-2 text-center max-w-xs">
                                    Go to the feed and review a project to start earning credits!
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-4 overflow-y-auto pr-2">
                                {/* Exemplo de como renderizar o histórico futuramente */}
                                {transactionHistory.map((transaction, index) => (
                                    <div key={index} className="flex items-center justify-between p-4 border-b border-gray-100 last:border-0">
                                        <div className="flex items-center gap-4">
                                            <div className={`p-3 rounded-full ${transaction.type === 'earn' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                                                {transaction.type === 'earn' ? <ArrowUpRight size={20} /> : <ArrowDownRight size={20} />}
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-800">{transaction.description}</p>
                                                <p className="text-sm text-gray-500">{transaction.date}</p>
                                            </div>
                                        </div>
                                        <span className={`font-bold ${transaction.type === 'earn' ? 'text-green-600' : 'text-red-600'}`}>
                                            {transaction.type === 'earn' ? '+' : '-'}{transaction.amount}
                                        </span>
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