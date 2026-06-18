// import React from 'react';
// Importamos o Link para gerir a navegação
import { Link } from 'react-router-dom';

// 1. Atualizamos a interface para incluir a propriedade linkTo
interface CardProps {
    category: string;
    credits: number;
    title: string;
    author: string;
    imageUrl: string;
    linkTo: string; // Define o destino do clique
}

export default function Card({ category, credits, title, author, imageUrl, linkTo }: CardProps) {
    return (
        <Link 
            to={linkTo}
            className="w-full h-80 flex flex-col rounded-[32px] overflow-hidden shadow-lg font-sans bg-gray-900 transition-transform duration-300 hover:scale-105 hover:shadow-xl cursor-pointer block"
        >
            <div className="bg-brand-pink text-white text-center py-3 text-lg font-medium tracking-wide">
                {category}
            </div>

            <div className="relative flex-1">
                <img 
                    src={imageUrl} 
                    alt={`Imagem do projeto ${title}`} 
                    className="absolute inset-0 w-full h-full object-cover"
                />

                <div className="absolute top-4 right-4 bg-gray-800/60 border border-white/50 text-white text-sm px-4 py-1.5 rounded-full backdrop-blur-md">
                    +{credits} Credits
                </div>

                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-6 pt-24">
                    <h3 className="text-white text-2xl font-semibold mb-1 leading-tight">
                        {title}
                    </h3>
                    <p className="text-white/80 text-lg font-light">
                        {author}
                    </p>
                </div>
            </div>
        </Link>
    );
}