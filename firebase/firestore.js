import { getFirestore, collection, doc, getDoc, getDocs, setDoc, updateDoc, arrayUnion, query, where } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const db = getFirestore();

// Funções para Cursos
export const getCursos = async () => {
  try {
    const cursosRef = collection(db, 'cursos');
    const snapshot = await getDocs(cursosRef);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Erro ao buscar cursos:', error);
    throw error;
  }
};

export const getCursoById = async (cursoId) => {
  try {
    const cursoRef = doc(db, 'cursos', cursoId);
    const cursoDoc = await getDoc(cursoRef);
    if (cursoDoc.exists()) {
      return {
        id: cursoDoc.id,
        ...cursoDoc.data()
      };
    }
    return null;
  } catch (error) {
    console.error('Erro ao buscar curso:', error);
    throw error;
  }
};

// Funções para Progresso do Usuário
export const getUserProgress = async (userId, cursoId) => {
  try {
    const progressRef = doc(db, 'usuarios', userId, 'progresso', cursoId);
    const progressDoc = await getDoc(progressRef);
    if (progressDoc.exists()) {
      return progressDoc.data();
    }
    return {
      progresso: 0,
      licoesConcluidas: [],
      ultimaAtualizacao: new Date()
    };
  } catch (error) {
    console.error('Erro ao buscar progresso:', error);
    throw error;
  }
};

export const updateUserProgress = async (userId, cursoId, licaoId) => {
  try {
    const progressRef = doc(db, 'usuarios', userId, 'progresso', cursoId);
    const progressDoc = await getDoc(progressRef);
    
    let licoesConcluidas = [];
    if (progressDoc.exists()) {
      licoesConcluidas = progressDoc.data().licoesConcluidas || [];
    }
    
    if (!licoesConcluidas.includes(licaoId)) {
      licoesConcluidas.push(licaoId);
    }
    
    await setDoc(progressRef, {
      licoesConcluidas,
      ultimaAtualizacao: new Date()
    }, { merge: true });
    
    return licoesConcluidas;
  } catch (error) {
    console.error('Erro ao atualizar progresso:', error);
    throw error;
  }
};

// Funções para Perfil do Usuário
export const getUserProfile = async (userId) => {
  try {
    const userRef = doc(db, 'usuarios', userId);
    const userDoc = await getDoc(userRef);
    if (userDoc.exists()) {
      return userDoc.data();
    }
    return null;
  } catch (error) {
    console.error('Erro ao buscar perfil:', error);
    throw error;
  }
};

export const updateUserProfile = async (userId, data) => {
  try {
    const userRef = doc(db, 'usuarios', userId);
    await setDoc(userRef, {
      ...data,
      ultimaAtualizacao: new Date()
    }, { merge: true });
  } catch (error) {
    console.error('Erro ao atualizar perfil:', error);
    throw error;
  }
};

// Função para criar perfil inicial do usuário
export const createInitialUserProfile = async (user) => {
  try {
    const userRef = doc(db, 'usuarios', user.uid);
    await setDoc(userRef, {
      email: user.email,
      displayName: user.displayName || 'Usuário',
      photoURL: user.photoURL,
      dataCriacao: new Date(),
      ultimaAtualizacao: new Date(),
      cursosInscritos: [],
      medalhas: []
    });
  } catch (error) {
    console.error('Erro ao criar perfil inicial:', error);
    throw error;
  }
}; 