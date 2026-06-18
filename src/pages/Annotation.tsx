import React, { useState } from 'react';
import { Navbar } from '../components/Navbar';
import { MapPin, Lightbulb, Send, Trash2, CheckCircle } from 'lucide-react';
// ATUALIZAÇÃO 1: Importamos funções do React Router para ler o URL e navegar
import { useParams, useNavigate } from 'react-router-dom';

interface Pin {
  id: number;
  x: number;
  y: number;
  text: string;
}

// ATUALIZAÇÃO 2: Simulamos uma base de dados que guarda as "Review Images" de cada projeto.
// Na vida real, o React iria pedir isto a um servidor usando o ID.
const MOCK_DATABASE: Record<string, { title: string, reviewImage: string }> = {
  "proj-001": {
    title: "App de Finanças",
    reviewImage: "https://images.unsplash.com/photo-1618761714954-0b8cd0026356?auto=format&fit=crop&w=1200&q=80"
  },
  "proj-002": {
    title: "Design System",
    reviewImage: "https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=1200&q=80"
  },
  "proj-003": {
    title: "API de Pagamentos",
    reviewImage: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80"
  }
};

export default function Annotation() {
  // Lemos o ID que está no URL (ex: "proj-001")
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();

  // Procuramos os dados na nossa "base de dados" falsa. Se não existir, usamos um padrão.
  const currentProject = MOCK_DATABASE[projectId || ""] || {
    title: "Unknown Project",
    reviewImage: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80"
  };

  const [pins, setPins] = useState<Pin[]>([]);
  const [globalIdea, setGlobalIdea] = useState('');
  const [activePinId, setActivePinId] = useState<number | null>(null);

  // Novo estado para controlar se a review foi enviada com sucesso
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleImageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    const newPin: Pin = { id: Date.now(), x, y, text: '' };
    setPins([...pins, newPin]);
    setActivePinId(newPin.id);
  };

  const updatePinText = (id: number, newText: string) => {
    setPins(pins.map(pin => pin.id === id ? { ...pin, text: newText } : pin));
  };

  const deletePin = (id: number) => {
    setPins(pins.filter(pin => pin.id !== id));
    if (activePinId === id) setActivePinId(null);
  };

  // ATUALIZAÇÃO 3: Função para Submeter a Review
  const handleSubmitReview = () => {
    // Garantir que não envia vazio
    if (pins.length === 0 && globalIdea.trim() === '') {
      alert("Please add at least one pin or a global idea before submitting.");
      return;
    }

    // Simulamos o envio
    console.log("Review enviada para o projeto:", projectId);
    console.log("Pins:", pins);
    console.log("Global Idea:", globalIdea);

    // Mostramos o estado de sucesso e voltamos ao Feed após 2 segundos
    setIsSubmitted(true);
    setTimeout(() => {
      navigate('/feed');
    }, 2500);
  };

  return (
    <div className="flex flex-col md:flex-row h-screen w-screen bg-gray-100 overflow-hidden font-sans">
      <div className="hidden md:flex flex-col w-auto">
        <Navbar />
      </div>

      {/* Mostramos um ecrã de sucesso se tiver sido submetido */}
      {isSubmitted ? (
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-white m-6 rounded-[32px] shadow-sm">
          <CheckCircle className="w-24 h-24 text-brand-pink mb-6" />
          <h1 className="text-4xl font-medium text-gray-900 mb-4">Review Submitted!</h1>
          <p className="text-xl text-gray-500">Thank you! You just earned +20 credits.</p>
          <p className="text-gray-400 mt-8">Redirecting you back to the feed...</p>
        </div>
      ) : (
        // Se não, mostramos a interface normal
        <section className="flex flex-col lg:flex-row flex-1 p-4 md:p-6 gap-6 overflow-hidden">

          <div className="flex-1 flex flex-col h-full bg-white rounded-[32px] shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              {/* O Título agora é dinâmico consoante o ID */}
              <h1 className="text-2xl font-medium text-gray-900">Reviewing: {currentProject.title}</h1>
              <p className="text-gray-500 font-light">Click anywhere on the image to add a Pin.</p>
            </div>

            <div className="relative flex-1 bg-gray-50 overflow-auto flex items-center justify-center p-4">
              <div className="relative cursor-crosshair shadow-lg" onClick={handleImageClick}>
                {/* A imagem agora é a 'reviewImage' carregada pelo ID */}
                <img
                  src={currentProject.reviewImage}
                  alt="Project to review"
                  className="max-w-full h-auto rounded-lg"
                  style={{ maxHeight: '70vh' }}
                />

                {pins.map((pin, index) => (
                  <div
                    key={pin.id}
                    className={`absolute w-8 h-8 -ml-4 -mt-4 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md transition-transform cursor-pointer
                                            ${activePinId === pin.id ? 'bg-brand-red scale-110 z-10' : 'bg-brand-pink hover:scale-110'}
                                        `}
                    style={{ left: `${pin.x}%`, top: `${pin.y}%` }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setActivePinId(pin.id);
                    }}
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
              <textarea
                rows={3}
                value={globalIdea}
                onChange={(e) => setGlobalIdea(e.target.value)}
                placeholder="Share your overall impressions about this project..."
                className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 text-gray-800 outline-none focus:border-brand-pink focus:ring-2 focus:ring-brand-pink/20 resize-none"
              />
            </div>

            <div className="bg-white p-6 rounded-[32px] shadow-sm border border-gray-100 flex-1 flex flex-col">
              <div className="flex items-center space-x-2 mb-4">
                <MapPin className="text-brand-pink w-6 h-6" />
                <h2 className="text-xl font-medium text-gray-900">Pinned Feedback</h2>
              </div>

              {pins.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-gray-400 opacity-60 mt-10">
                  <MapPin className="w-12 h-12 mb-2" />
                  <p>No pins yet.</p>
                  <p className="text-sm">Click on the image to start.</p>
                </div>
              ) : (
                <div className="space-y-4 flex-1 overflow-y-auto pr-2">
                  {pins.map((pin, index) => (
                    <div
                      key={pin.id}
                      className={`p-4 rounded-2xl border transition-all ${activePinId === pin.id ? 'border-brand-red bg-red-50/50' : 'border-gray-100 bg-gray-50'}`}
                      onClick={() => setActivePinId(pin.id)}
                    >
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-bold text-gray-700 bg-white px-2 py-1 rounded-md shadow-sm text-sm">
                          Pin #{index + 1}
                        </span>
                        <button onClick={() => deletePin(pin.id)} className="text-gray-400 hover:text-red-500 transition-colors">
                          <Trash2 size={18} />
                        </button>
                      </div>
                      <textarea
                        autoFocus={activePinId === pin.id}
                        value={pin.text}
                        onChange={(e) => updatePinText(pin.id, e.target.value)}
                        placeholder="What needs to be fixed here?"
                        className="w-full bg-transparent border-none text-gray-800 outline-none resize-none placeholder-gray-400"
                        rows={2}
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* ATUALIZAÇÃO 4: Adicionamos o evento onClick para executar a nossa função */}
              <button
                onClick={handleSubmitReview}
                className="mt-6 w-full flex items-center justify-center space-x-2 px-6 py-4 bg-gradient-to-r from-brand-pink to-brand-red text-white text-lg font-semibold rounded-2xl shadow-md hover:shadow-lg transform hover:-translate-y-1 transition-all"
              >
                <Send size={20} />
                <span>Submit Review</span>
              </button>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}