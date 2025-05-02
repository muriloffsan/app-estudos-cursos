import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { getAuth } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { atualizarProgressoCurso } from '../../firebase/firestore';

export default function AtualizarCurso({ route, navigation }) {
  const { cursoId } = route.params;
  const auth = getAuth();
  const user = auth.currentUser;
  const [licoes, setLicoes] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchProgress = async () => {
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (userDoc.exists()) {
        const data = userDoc.data();
        setLicoes(data.progresso[cursoId] || {});
      }
    };
    fetchProgress();
  }, []);

  const toggleLicao = (licaoKey) => {
    setLicoes((prev) => ({
      ...prev,
      [licaoKey]: !prev[licaoKey]
    }));
  };

  const salvarProgresso = async () => {
    setIsSaving(true);
    try {
      await atualizarProgressoCurso(user.uid, cursoId, licoes);
      Alert.alert('Sucesso', 'Progresso salvo com sucesso!');
    } catch (err) {
      Alert.alert('Erro', 'Erro ao salvar progresso.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Atualizar Progresso do {cursoId}</Text>
      {Object.keys(licoes).map((key) => (
        <TouchableOpacity
          key={key}
          style={[styles.item, licoes[key] && styles.itemConcluido]}
          onPress={() => toggleLicao(key)}
        >
          <Text style={styles.itemText}>
            {key} - {licoes[key] ? '✅ Concluído' : '❌ Incompleto'}
          </Text>
        </TouchableOpacity>
      ))}
      <TouchableOpacity style={styles.botaoSalvar} onPress={salvarProgresso} disabled={isSaving}>
        <Text style={styles.botaoTexto}>{isSaving ? 'Salvando...' : 'Salvar Progresso'}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 20 },
  item: {
    padding: 16,
    backgroundColor: '#f0f0f0',
    marginBottom: 10,
    borderRadius: 10,
  },
  itemConcluido: {
    backgroundColor: '#c6f6d5',
  },
  itemText: {
    fontSize: 16,
  },
  botaoSalvar: {
    marginTop: 20,
    backgroundColor: '#4a6bff',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  botaoTexto: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
