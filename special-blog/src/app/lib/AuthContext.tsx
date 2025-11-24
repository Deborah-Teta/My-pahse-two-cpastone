'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
  User as FirebaseUser
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { User } from '../types';


let auth: any;
let db: any;

if (typeof window !== 'undefined') {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const firebase = require('./firebase');
  auth = firebase.auth;
  db = firebase.db;
}



interface AuthContextType {
  user: User | null;
  loading: boolean;
  signup: (email: string, password: string, displayName: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}


const AuthContext = createContext<AuthContextType>({} as AuthContextType);


export const useAuth = () => useContext(AuthContext);


export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
        if (userDoc.exists()) {
          setUser(userDoc.data() as User);
        }
      } else {
        
        setUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  
  const signup = async (email: string, password: string, displayName: string) => {
    
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    
    
    await updateProfile(userCredential.user, { displayName });

    
    const userData: User = {
      uid: userCredential.user.uid,
      email: userCredential.user.email!,
      displayName,
      createdAt: new Date(),
      followers: [],
      following: [],
    };

    await setDoc(doc(db, 'users', userCredential.user.uid), userData);
    setUser(userData);
  };

  
  const login = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
    
  };

  
  const logout = async () => {
    await signOut(auth);
    setUser(null);
  };

  const value = {
    user,
    loading,
    signup,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}