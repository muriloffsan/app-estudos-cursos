import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase'; // Importa a instância 'db' do firestore inicializada

/**
 * Cria um documento inicial para um novo usuário na coleção 'users'.
 * @param {object} user - O objeto de usuário retornado pelo Firebase Auth.
 * @param {string} name - O nome fornecido pelo usuário durante o cadastro.
 */
export const createInitialUserProfile = async (user, name) => {
  if (!user || !user.uid) {
    console.error("Erro: Objeto de usuário inválido ou UID ausente.");
    throw new Error("Não foi possível criar o perfil: usuário inválido.");
  }
  if (!name || name.trim() === '') {
    console.error("Erro: Nome inválido fornecido.");
    throw new Error("Não foi possível criar o perfil: nome inválido.");
  }

  // Referência para o documento do usuário na coleção 'users'
  // Usamos o UID do usuário como ID do documento para fácil acesso
  const userDocRef = doc(db, 'users', user.uid);

  try {
    // Dados a serem salvos no Firestore
    const userData = {
      uid: user.uid,
      email: user.email,
      name: name.trim(), // Salva o nome sem espaços extras
      createdAt: serverTimestamp(), // Adiciona um timestamp de quando a conta foi criada
      // Adicione outros campos iniciais que desejar aqui (ex: photoURL: null, bio: '')
    };

    // Cria o documento no Firestore
    await setDoc(userDocRef, userData);
    console.log('Perfil do usuário criado no Firestore com ID:', user.uid);

  } catch (error) {
    console.error("Erro ao criar perfil do usuário no Firestore:", error);
    // Você pode querer lançar o erro novamente ou lidar com ele de forma específica
    throw error; // Lança o erro para que a tela de login possa tratá-lo se necessário
  }
};
