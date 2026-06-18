import { useEffect, useState } from 'react';
import { Navbar } from "../components/Navbar";
import Card from '../components/Card';
// import { Search, Filter } from 'lucide-react';
import { useAuth } from '../AuthContext';
import { db } from '../firebase';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';

export default function Feed() {
  const { user, userData } = useAuth();
  const [projects, setProjects] = useState<any[]>([]);

  // 1. Escutar projetos em tempo real
  useEffect(() => {
    const q = query(collection(db, 'projects'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const projectsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setProjects(projectsData);
    });

    return () => unsubscribe();
  }, []);

  const reviewedProjectsList = userData?.reviewedProjects || [];

  return (
    <div className="flex flex-col md:flex-row h-screen w-screen bg-gray-100 overflow-hidden font-sans">
      <div className="hidden md:flex flex-col w-auto"><Navbar /></div>

      <section className="flex flex-col flex-1 p-4 md:p-8 m-2 md:m-6 overflow-y-auto">
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-medium mb-2">Welcome, {userData?.name || "Student"}</h1>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8 mt-10">
          {projects.map((project) => {
            // Verificar se o projeto é do utilizador logado
            const isOwner = project.authorId === user?.uid;
            const hasReviewed = reviewedProjectsList.includes(project.id);

            return (
              <div key={project.id} className="relative">
                {isOwner && (
                  <span className="absolute top-2 left-2 z-10 bg-brand-pink text-white text-[10px] font-bold px-2 py-1 rounded-lg">
                    YOUR PROJECT
                  </span>
                )}
                
                <Card
                  category={project.category}
                  credits={project.credits}
                  title={project.title}
                  author={isOwner ? "You" : project.authorName}
                  imageUrl={project.coverImageUrl}
                  linkTo={`/annotation/${project.id}`}
                  disabled={hasReviewed || isOwner} 
                />
              </div>
            );
          })}
        </div>
      </section>
    </div>
  )
}