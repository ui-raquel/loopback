// import React from 'react';

interface CardProps {
    category: string;
    credits: number;
    title: string;
    author: string;
    imageUrl: string;
}

export default function Card({ category, credits, title, author, imageUrl }: CardProps) {
    return (
        /* ATUALIZAÇÃO AQUI: 
           Mudámos de 'w-72 h-96' para 'w-full h-80'.
           O 'w-full' diz ao cartão para ocupar todo o espaço que a grelha lhe dá.
           O 'h-80' reduz um pouco a altura para não parecer tão gigante.
        */
        <div className="w-full h-80 flex flex-col rounded-[32px] overflow-hidden shadow-lg font-sans bg-gray-900">
            
            {/* O resto do teu código do cartão mantém-se exatamente igual! */}
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
        </div>
    );
}