import { useEffect, useState } from 'react';
import { Navbar } from "../components/Navbar";
import Card from '../components/Card';
import { Search, Filter } from 'lucide-react';
import { useAuth } from '../AuthContext';
import { db } from '../firebase';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';

export default function Feed() {
  const { user, userData } = useAuth();
  const [projects, setProjects] = useState<any[]>([]);


  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  // Escutar projetos em tempo real
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


  const filteredProjects = projects.filter((project) => {

    const matchesSearch =
      project.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.authorName?.toLowerCase().includes(searchTerm.toLowerCase());


    const matchesCategory =
      selectedCategory === '' || project.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="flex flex-col md:flex-row h-screen w-screen bg-gray-100 overflow-hidden font-sans">
      <div className="hidden md:flex flex-col w-auto"><Navbar /></div>

      <section className="flex flex-col flex-1 p-4 md:p-8 m-2 md:m-6 overflow-y-auto">
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-medium mb-2">
          Welcome, {userData?.name || "Student"}
        </h1>


        <div className="flex flex-col md:flex-row items-stretch md:items-center space-y-4 md:space-y-0 md:space-x-4 mt-8">

          <div className="flex-1 flex items-center bg-white px-5 py-4 rounded-2xl shadow-sm border border-gray-100">
            <Search className="text-brand-pink w-6 h-6 mr-3 flex-shrink-0" />
            <input
              type="text"
              placeholder="Search by project..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-transparent outline-none text-base md:text-lg text-gray-700 placeholder-gray-400"
            />
          </div>

          <div className="flex items-center bg-white px-5 py-4 rounded-2xl shadow-sm border border-gray-100">
            <Filter className="text-brand-pink w-6 h-6 mr-2 flex-shrink-0" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-transparent text-base md:text-lg text-gray-700 outline-none appearance-none cursor-pointer pr-4"
            >
              <option value="">All Categories</option>
              <option value="UX/UI">UX/UI</option>
              <option value="FRONTEND">Frontend</option>
              <option value="BACKEND">Backend</option>
              <option value="MOBILE">Mobile</option>
              <option value="DATA SCIENCE">Data Science</option>
            </select>
          </div>

        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8 mt-10">
          {/* 5. Utilizamos a lista filteredProjects em vez da lista projects */}
          {filteredProjects.map((project) => {
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


        {filteredProjects.length === 0 && (
          <div className="text-gray-500 text-center mt-10 text-lg">
            No projects found. Try adjusting your search or filter.
          </div>
        )}

      </section>
    </div>
  )
}