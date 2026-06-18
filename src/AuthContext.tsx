import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, db } from './firebase'; // Ajusta o caminho se o firebase.ts estiver noutra pasta
import { onAuthStateChanged, type User } from 'firebase/auth';
import { doc, onSnapshot, type DocumentData } from 'firebase/firestore';


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
        // Variável para guardar a função de paragem do "espião" da base de dados
        let unsubscribeSnapshot: () => void;

        const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);

            if (currentUser) {
                // Em vez de ler 1 vez (getDoc), usamos o onSnapshot para escutar em tempo real
                const docRef = doc(db, 'users', currentUser.uid);
                unsubscribeSnapshot = onSnapshot(docRef, (docSnap) => {
                    if (docSnap.exists()) {
                        setUserData(docSnap.data());
                    }
                });
            } else {
                setUserData(null);
                if (unsubscribeSnapshot) unsubscribeSnapshot(); // Pára de escutar se fizer logout
            }
            setLoading(false);
        });

        // Limpa tudo quando fechas a app
        return () => {
            unsubscribeAuth();
            if (unsubscribeSnapshot) unsubscribeSnapshot();
        };
    }, []);

    return (
        <AuthContext.Provider value={{ user, userData, loading }}>
            {/* Só renderiza a aplicação quando terminar de verificar o login */}
            {!loading && children}
        </AuthContext.Provider>
    );
}


export const useAuth = () => useContext(AuthContext);