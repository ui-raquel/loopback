import { Link } from 'react-router-dom';

interface CardProps {
    category: string;
    credits: number;
    title: string;
    author: string;
    imageUrl: string;
    linkTo: string;
    disabled?: boolean; // Nova propriedade
}

export default function Card({ category, credits, title, author, imageUrl, linkTo, disabled }: CardProps) {

    // Conteúdo visual do cartão
    const cardContent = (
        <div className={`flex flex-col bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden h-full transition-all ${disabled ? 'grayscale opacity-60 cursor-not-allowed' : 'hover:shadow-md cursor-pointer'}`}>
            <div className="relative h-48 w-full">
                <img src={imageUrl} alt={title} className="w-full h-full object-cover" />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-bold text-brand-pink shadow-sm">
                    +{credits} CR
                </div>
            </div>
            <div className="p-5 flex flex-col flex-1">
                <span className="text-xs font-bold text-gray-400 mb-2 tracking-wider">{category}</span>
                <h3 className="text-lg font-medium text-gray-900 mb-1">{title}</h3>
                <p className="text-sm text-gray-500 mt-auto">by {author}</p>

                {/* Aviso visível caso o projeto já tenha sido avaliado */}
                {disabled && (
                    <p className="text-xs text-brand-red font-medium mt-3 bg-red-50 p-2 rounded-lg text-center">
                        Already reviewed
                    </p>
                )}
            </div>
        </div>
    );

    // Se estiver desativado, devolvemos apenas a 'div' (sem link). Caso contrário, usamos o 'Link'.
    if (disabled) {
        return <div>{cardContent}</div>;
    }

    return (
        <Link to={linkTo} className="block h-full">
            {cardContent}
        </Link>
    );
}