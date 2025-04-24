import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
export const createInitialUserProfile = async (user, name) => {
  if (!user || !user.uid) throw new Error("Usuário inválido.");
  if (!name || name.trim() === '') throw new Error("Nome inválido.");

  const userDocRef = doc(db, 'users', user.uid);

  const initialProgress = {
    curso1: {
      licao1: false,
      licao2: false,
      licao3: false,
      licao4: false
    },
    curso2: {
      licao5: false,
      licao6: false,
      licao7: false,
      licao8: false
    },
    curso3: {
      licao9: false,
      licao10: false,
      licao11: false,
      licao12: false
    }
  };

  const userData = {
    uid: user.uid,
    email: user.email,
    name: name.trim(),
    createdAt: serverTimestamp(),
    progresso: initialProgress
  };

  try {
    await setDoc(userDocRef, userData);
    console.log('Perfil criado com o progresso inicial das lições.');
  } catch (error) {
    console.error("Erro ao criar perfil:", error);
    throw error;
  }
};