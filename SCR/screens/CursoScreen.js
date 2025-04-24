// screens/CursoScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, ScrollView, Alert, Switch } from 'react-native';
import { getDoc, doc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { auth } from '../../firebase';

export default function CursoScreen({ route, navigation }) {
  const { cursoId, totalLicoes } = route.params;
  const user = auth.currentUser;

  const [licoes, setLicoes] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  const userCursoRef = doc(db, 'users', user.uid, 'progresso', cursoId);

  useEffect(() => {
    const fetchLicoes = async () => {
      try {
        const docSnap = await getDoc(userCursoRef);
        if (docSnap.exists()) {
          setLicoes(docSnap.data());
        } else {
          // Se não existir, cria com todas false
          const novaLicao = {};
          for (let i = 1; i <= totalLicoes; i++) {
            novaLicao[`licao${i}`] = false;
          }
          await setDoc(userCursoRef, novaLicao);
          setLicoes(novaLicao);
        }
      } catch (error) {
        console.error("Erro ao buscar progresso:", error);
        Alert.alert("Erro", "Falha ao carregar progresso");
      } finally {
        setIsLoading(false);
      }
    };

    fetchLicoes();
  }, [cursoId, totalLicoes, userCursoRef]); // Adicione dependências para recarregar se mudar

  const handleSalvar = async () => {
    try {
      await updateDoc(userCursoRef, licoes);
      Alert.alert("Sucesso", "Progresso salvo com sucesso!");
    } catch (error) {
      console.error("Erro ao salvar progresso:", error);
      Alert.alert("Erro", "Falha ao salvar progresso");
    }
  };

  const toggleLicao = (key) => {
    setLicoes((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  if (isLoading) return <Text>Carregando...</Text>;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Curso: {cursoId}</Text>
      {Object.entries(licoes).map(([key, value]) => (
        <View key={key} style={styles.licao}>
          <Text style={styles.licaoText}>{key}</Text>
          <Switch value={value} onValueChange={() => toggleLicao(key)} />
        </View>
      ))}
      <Button title="Salvar Progresso" onPress={handleSalvar} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  title: { fontSize: 24, marginBottom: 20 },
  licao: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10
  },
  licaoText: {
    fontSize: 18
  }
});