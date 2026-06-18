import React, { useState, useEffect } from 'react';
import { Navbar } from '../components/Navbar';
import { MapPin, Lightbulb, Send, Trash2, CheckCircle, AlertCircle } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';

// Importações do Firebase
import { db } from '../firebase';
import { doc, updateDoc, increment, collection, addDoc, arrayUnion, onSnapshot } from 'firebase/firestore';

interface Pin {
  id: number;
  x: number;
  y: number;
  text: string;
}

// Definimos o limite X de caracteres (30 é um excelente tamanho para um feedback real)
const MIN_REVIEW_CHARACTERS = 30;

export default function Annotation() {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [pins, setPins] = useState<Pin[]>([]);
  const [globalIdea, setGlobalIdea] = useState('');
  const [activePinId, setActivePinId] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  // NOVO: Estado para gerir erros de validação do formulário
  const [validationError, setValidationError] = useState('');

  useEffect(() => {
    if (!projectId) return;

    const docRef = doc(db, 'projects', projectId);
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        setProject({ id: docSnap.id, ...docSnap.data() });
      } else {
        console.error("Project not found");
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [projectId]);

  const isOwner = project?.authorId === user?.uid;

  const handleImageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isOwner) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    const newPin: Pin = { id: Date.now(), x, y, text: '' };
    setPins([...pins, newPin]);
    setActivePinId(newPin.id);
    setValidationError(''); // Limpa erros ao interagir
  };

  const updatePinText = (id: number, newText: string) => {
    setPins(pins.map(pin => pin.id === id ? { ...pin, text: newText } : pin));
    setValidationError('');
  };

  const deletePin = (id: number) => {
    setPins(pins.filter(pin => pin.id !== id));
    if (activePinId === id) setActivePinId(null);
    setValidationError('');
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');

    if (!user || isOwner || !project) return;

    // --- LÓGICA DE VALIDAÇÃO ANTI-SPAM ---
    const globalIdeaLength = globalIdea.trim().length;
    // Soma o total de caracteres de todos os pins criados
    const totalPinsLength = pins.reduce((sum, pin) => sum + pin.text.trim().length, 0);

    // Caso 1: Tudo vazio
    if (pins.length === 0 && globalIdeaLength === 0) {
      setValidationError("You must provide either a Global Idea or place at least one Pin to submit.");
      return;
    }

    // Caso 2: Escreveu apenas a Idea, mas é muito curta
    if (pins.length === 0 && globalIdeaLength < MIN_REVIEW_CHARACTERS) {
      setValidationError(`Your Global Idea is too short. It must be at least ${MIN_REVIEW_CHARACTERS} characters long.`);
      return;
    }

    // Caso 3: Criou pins, mas a soma de texto deles é muito curta ou vazia
    if (pins.length > 0 && totalPinsLength < MIN_REVIEW_CHARACTERS) {
      setValidationError(`Your pinned feedback combined must total at least ${MIN_REVIEW_CHARACTERS} characters.`);
      return;
    }
    // -------------------------------------

    const earnedCredits = project.credits;

    try {
      await addDoc(collection(db, 'reviews'), {
        projectId: projectId,
        reviewerId: user.uid,
        globalIdea: globalIdea,
        pins: pins,
        createdAt: new Date().toISOString()
      });

      const userRef = doc(db, 'users', user.uid);
      const today = new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });

      await updateDoc(userRef, {
        credits: increment(earnedCredits),
        reviewedProjects: arrayUnion(projectId),
        transactions: arrayUnion({
          id: Date.now(),
          type: 'earn',
          description: `Reviewed: ${project.title}`,
          date: today,
          amount: earnedCredits
        })
      });

      setIsSubmitted(true);
      setTimeout(() => navigate('/feed'), 3000);

    } catch (error) {
      console.error("Erro ao submeter review:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-gray-100 text-gray-500 font-medium">
        Loading project file...
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row h-screen w-screen bg-gray-100 overflow-hidden font-sans">
      <div className="hidden md:flex flex-col w-auto"><Navbar /></div>

      {isSubmitted ? (
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-white m-6 rounded-[32px] shadow-sm">
          <CheckCircle className="w-24 h-24 text-brand-pink mb-6" />
          <h1 className="text-4xl font-medium text-gray-900 mb-4">Review Submitted!</h1>
          <p className="text-xl text-gray-500 font-light">Thank you! Your feedback has been saved.</p>
        </div>
      ) : (
        <section className="flex flex-col lg:flex-row flex-1 p-4 md:p-6 gap-6 overflow-hidden">
          <div className="flex-1 flex flex-col h-full bg-white rounded-[32px] shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h1 className="text-2xl font-medium text-gray-900">
                {isOwner ? "Viewing Your Project:" : "Reviewing:"} {project?.title}
              </h1>
              <p className="text-gray-500 font-light">
                {isOwner ? "This is your work. You cannot add pins or review it." : "Click anywhere on the image to add a Pin."}
              </p>
            </div>

            <div className="relative flex-1 bg-gray-50 overflow-auto flex items-center justify-center p-4">
              <div className={`relative shadow-lg ${isOwner ? 'cursor-default' : 'cursor-crosshair'}`} onClick={handleImageClick}>
                <img src={project?.reviewImageUrl} alt="Project" className="max-w-full h-auto rounded-lg" style={{ maxHeight: '70vh' }} />
                {pins.map((pin, index) => (
                  <div
                    key={pin.id}
                    className={`absolute w-8 h-8 -ml-4 -mt-4 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md transition-transform cursor-pointer
                      ${activePinId === pin.id ? 'bg-brand-red scale-110 z-10' : 'bg-brand-pink hover:scale-110'}
                    `}
                    style={{ left: `${pin.x}%`, top: `${pin.y}%` }}
                    onClick={(e) => { e.stopPropagation(); setActivePinId(pin.id); }}
                  >
                    {index + 1}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="w-full lg:w-96 flex flex-col gap-6 h-full overflow-y-auto pb-6">
            {isOwner && (
              <div className="flex items-start bg-amber-50 text-amber-800 p-5 rounded-[24px] border border-amber-200 shadow-sm flex-shrink-0">
                <AlertCircle className="w-6 h-6 mr-3 flex-shrink-0 mt-0.5 text-amber-600" />
                <div>
                  <p className="font-semibold">Your Project Mode</p>
                  <p className="text-sm text-amber-700/90 mt-1">Creation of feedback and reviews is disabled here.</p>
                </div>
              </div>
            )}

            <div className="bg-white p-6 rounded-[32px] shadow-sm border border-gray-100 flex-shrink-0">
              <div className="flex items-center space-x-2 mb-4">
                <Lightbulb className="text-brand-pink w-6 h-6" />
                <h2 className="text-xl font-medium text-gray-900">Global Idea</h2>
              </div>
              <textarea
                rows={3}
                disabled={isOwner}
                value={globalIdea}
                onChange={(e) => setGlobalIdea(e.target.value)}
                placeholder={isOwner ? "View mode only." : "Share your overall impressions about this project..."}
                className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 text-gray-800 outline-none focus:border-brand-pink focus:ring-2 focus:ring-brand-pink/20 resize-none disabled:opacity-50"
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
                        <span className="font-bold text-gray-700 bg-white px-2 py-1 rounded-md shadow-sm text-sm">Pin #{index + 1}</span>
                        {!isOwner && (
                          <button onClick={() => deletePin(pin.id)} className="text-gray-400 hover:text-red-500 transition-colors"><Trash2 size={18} /></button>
                        )}
                      </div>
                      <textarea
                        disabled={isOwner}
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

              {/* NOVA ÁREA: Exibição visual do erro de caracteres */}
              {validationError && (
                <div className="mt-4 flex items-start bg-red-50 text-brand-red p-3 rounded-xl border border-red-100 text-xs font-medium animate-pulse">
                  <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0 mt-0.5" />
                  <p>{validationError}</p>
                </div>
              )}

              <button
                onClick={handleSubmitReview}
                disabled={isOwner}
                className={`mt-4 w-full flex items-center justify-center space-x-2 px-6 py-4 text-white text-lg font-semibold rounded-2xl shadow-md transition-all 
                  ${isOwner 
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed shadow-none' 
                    : 'bg-gradient-to-r from-brand-pink to-brand-red hover:shadow-lg transform hover:-translate-y-1'
                  }`}
              >
                <Send size={20} />
                <span>{isOwner ? "Own Project View Only" : "Submit Review"}</span>
              </button>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}