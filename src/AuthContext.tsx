import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, db } from './firebase'; // Ajusta o caminho se o firebase.ts estiver noutra pasta
import { onAuthStateChanged, type User } from 'firebase/auth';
import { doc, getDoc, type DocumentData } from 'firebase/firestore';

// 1. Definição do Contexto
interface AuthContextType {
    user: User | null;
    userData: DocumentData | null;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    userData: null,
    loading: true,
});



export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [userData, setUserData] = useState<DocumentData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Função do Firebase que escuta alterações de login/logout
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            setUser(currentUser);

            if (currentUser) {
                // Se houver login, procura os dados extra na Firestore
                const docRef = doc(db, 'users', currentUser.uid);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    setUserData(docSnap.data());
                }
            } else {
                setUserData(null);
            }
            setLoading(false);
        });

        // Limpa o evento quando o componente é desmontado
        return () => unsubscribe();
    }, []);

    return (
        <AuthContext.Provider value={{ user, userData, loading }}>
            {/* Só renderiza a aplicação quando terminar de verificar o login */}
            {!loading && children}
        </AuthContext.Provider>
    );
}


export const useAuth = () => useContext(AuthContext);