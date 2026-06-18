// import React from 'react';
import { Navbar } from "../components/Navbar";
import Card from '../components/Card'; 
import { Search, Filter } from 'lucide-react';

export default function Feed() {
  
  const projectsData = [
    {
      id: "proj-001",
      category: "FRONTEND",
      credits: 50,
      title: "App de Finanças",
      author: "João Silva",
      imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=400&q=80"
    },
    {
      id: "proj-002",
      category: "UX/UI",
      credits: 20,
      title: "Design System",
      author: "Maria Santos",
      imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=400&q=80"
    },
    {
      id: "proj-003",
      category: "BACKEND",
      credits: 40,
      title: "API de Pagamentos",
      author: "Carlos Costa",
      imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=400&q=80"
    }
  ];

  return (
    /* PASSO 1: Atualização do Fundo
       Substituímos 'bg-grey-bg' por 'bg-gray-100' para manter o mesmo tom cinza claro das outras páginas.
    */
    <div className="flex flex-col md:flex-row h-screen w-screen bg-gray-100 overflow-hidden font-sans">
      
      <div className="hidden md:flex flex-col w-auto">
        <Navbar />
      </div>
      
      <section className="flex flex-col flex-1 p-4 md:p-8 m-2 md:m-6 overflow-y-auto">
        
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-medium mb-2 leading-tight z-10">Welcome, Lola</h1>
        
        {/* PASSO 2: Atualização do Subtítulo
           Substituímos 'text-grey-text' por 'text-gray-500'.
        */}
        <h2 className="text-base md:text-xl lg:text-2xl font-light text-gray-500 mb-6 md:mb-8 leading-tight z-10">
          Find projects from other students and review them to earn credits
        </h2>

        <div className="flex flex-col md:flex-row items-stretch md:items-center space-y-4 md:space-y-0 md:space-x-4 mb-8 md:mb-10">
            <div className="flex-1 flex items-center bg-white px-5 py-4 rounded-2xl shadow-sm border border-gray-100">
                <Search className="text-brand-pink w-6 h-6 mr-3 flex-shrink-0" />
                <input 
                    type="text" 
                    placeholder="Project, peer, category, ..." 
                    className="w-full bg-transparent outline-none text-base md:text-lg text-gray-700 placeholder-gray-400"
                />
            </div>
            <button className="flex items-center justify-center space-x-2 bg-white px-8 py-4 rounded-2xl shadow-sm border border-gray-100 hover:bg-gray-50 transition-colors">
                <Filter className="text-brand-pink w-6 h-6" />
                <span className="text-base md:text-lg text-gray-700">Filter</span>
            </button>
        </div>

        {/* Renderização dinâmica com map() */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8"> 
            {projectsData.map((project) => (
                <Card 
                    key={project.id} 
                    category={project.category}
                    credits={project.credits}
                    title={project.title}
                    author={project.author}
                    imageUrl={project.imageUrl}
                    linkTo={`/annotation/${project.id}`} 
                />
            ))}
        </div>
      </section>
    </div>
  )
}