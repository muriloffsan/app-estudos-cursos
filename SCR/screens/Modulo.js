import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
import { getFirestore, doc, getDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getCursoById, getUserProgress, updateUserProgress } from '../../firebase/firestore';

export default function ModuloScreen({ route, navigation }) {
  const { cursoId, moduloId, moduloNome } = route.params;
  const [modulo, setModulo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [progresso, setProgresso] = useState(0);
  
  const db = getFirestore();
  const auth = getAuth();
  const userId = auth.currentUser?.uid;

  useEffect(() => {
    carregarModulo();
  }, []);

  const carregarModulo = async () => {
    try {
      const cursoData = await getCursoById(cursoId);
      if (cursoData && cursoData.modulos && cursoData.modulos[moduloId]) {
        setModulo(cursoData.modulos[moduloId]);
        
        // Carregar progresso do usuário
        const progressoData = await getUserProgress(userId, cursoId);
        const licoesConcluidas = progressoData.licoesConcluidas || [];
        const totalLicoes = cursoData.modulos[moduloId].licoes.length;
        const licoesConcluidasModulo = licoesConcluidas.filter(id => 
          cursoData.modulos[moduloId].licoes.find(l => l.id === id)
        ).length;
        
        setProgresso((licoesConcluidasModulo / totalLicoes) * 100);
      }
    } catch (error) {
      console.error('Erro ao carregar módulo:', error);
      Alert.alert('Erro', 'Não foi possível carregar o módulo. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const toggleLicaoConcluida = async (licaoId) => {
    try {
      const licoesConcluidas = await updateUserProgress(userId, cursoId, licaoId);
      
      // Recalcular progresso
      const totalLicoes = modulo.licoes.length;
      const licoesConcluidasModulo = licoesConcluidas.filter(id => 
        modulo.licoes.find(l => l.id === id)
      ).length;
      
      const novoProgresso = (licoesConcluidasModulo / totalLicoes) * 100;
      setProgresso(novoProgresso);
      
      // Verificar medalhas
      verificarMedalhas(novoProgresso);
    } catch (error) {
      console.error('Erro ao atualizar status da lição:', error);
      Alert.alert('Erro', 'Não foi possível atualizar o status da lição. Tente novamente.');
    }
  };

  const verificarMedalhas = async (novoProgresso) => {
    if (!userId) return;

    try {
      const userMedalhasRef = doc(db, 'usuarios', userId, 'medalhas', cursoId);
      const userMedalhasDoc = await getDoc(userMedalhasRef);
      const medalhasAtuais = userMedalhasDoc.exists() ? userMedalhasDoc.data().medalhas || [] : [];
      
      let novasMedalhas = [];
      
      // Verificar medalhas baseadas no progresso
      if (novoProgresso >= 25 && !medalhasAtuais.includes('bronze')) {
        novasMedalhas.push('bronze');
      }
      if (novoProgresso >= 50 && !medalhasAtuais.includes('prata')) {
        novasMedalhas.push('prata');
      }
      if (novoProgresso >= 75 && !medalhasAtuais.includes('ouro')) {
        novasMedalhas.push('ouro');
      }
      if (novoProgresso === 100 && !medalhasAtuais.includes('diamante')) {
        novasMedalhas.push('diamante');
      }
      
      if (novasMedalhas.length > 0) {
        await updateDoc(userMedalhasRef, {
          medalhas: [...medalhasAtuais, ...novasMedalhas],
          ultimaAtualizacao: new Date()
        }, { merge: true });
        
        Alert.alert(
          'Parabéns! 🎉',
          `Você conquistou ${novasMedalhas.length} nova(s) medalha(s)!`,
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      console.error('Erro ao verificar medalhas:', error);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Carregando...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.progressoContainer}>
        <View style={styles.progressoInfo}>
          <Text style={styles.progressoText}>Progresso</Text>
          <Text style={styles.progressoPercentual}>{progresso}%</Text>
        </View>
        <View style={styles.progressoBarContainer}>
          <View style={[styles.progressoBar, { width: `${progresso}%` }]} />
        </View>
      </View>

      <View style={styles.content}>
        <Text style={styles.moduloDescricao}>{modulo?.descricao || 'Descrição não disponível'}</Text>
        
        <View style={styles.licoesContainer}>
          <Text style={styles.licoesTitle}>Lições</Text>
          {modulo?.licoes?.map((licao, index) => (
            <TouchableOpacity 
              key={licao.id}
              style={styles.licaoCard}
              onPress={() => toggleLicaoConcluida(licao.id)}
            >
              <View style={styles.licaoCheckbox}>
                <View style={[styles.checkbox, licao.concluida && styles.checkboxChecked]}>
                  {licao.concluida && <Text style={styles.checkmark}>✓</Text>}
                </View>
              </View>
              
              <View style={styles.licaoInfo}>
                <Text style={styles.licaoNumero}>Lição {index + 1}</Text>
                <Text style={styles.licaoTitulo}>{licao.titulo}</Text>
                <Text style={styles.licaoDuracao}>{licao.duracao || '5 min'}</Text>
              </View>
              
              <Text style={styles.licaoIcon}>›</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
  },
  progressoContainer: {
    backgroundColor: '#fff',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  progressoInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  progressoText: {
    fontSize: 14,
    color: '#666',
  },
  progressoPercentual: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#4a6bff',
  },
  progressoBarContainer: {
    height: 6,
    backgroundColor: '#e0e0e0',
    borderRadius: 3,
  },
  progressoBar: {
    height: '100%',
    backgroundColor: '#4a6bff',
    borderRadius: 3,
  },
  content: {
    padding: 20,
  },
  moduloDescricao: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
    marginBottom: 20,
  },
  licoesContainer: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  licoesTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  licaoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9ff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  licaoCheckbox: {
    marginRight: 15,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#4a6bff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#4a6bff',
  },
  checkmark: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  licaoInfo: {
    flex: 1,
  },
  licaoNumero: {
    fontSize: 12,
    color: '#888',
    marginBottom: 2,
  },
  licaoTitulo: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 2,
  },
  licaoDuracao: {
    fontSize: 12,
    color: '#888',
  },
  licaoIcon: {
    fontSize: 24,
    color: '#ccc',
    marginLeft: 10,
  },
}); 