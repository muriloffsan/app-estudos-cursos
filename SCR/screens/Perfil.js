import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, Button, Alert } from 'react-native';
import { getAuth, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase';

export default function Perfil({ navigation }) {
  const [medalhas, setMedalhas] = useState({});
  const [nomeUsuario, setNomeUsuario] = useState('');
  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    const buscarDadosUsuario = async () => {
      if (!user) return;
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (userDoc.exists()) {
        const data = userDoc.data();
        setNomeUsuario(data.name);
        const progresso = data.progresso || {};
        const novasMedalhas = {};

        Object.entries(progresso).forEach(([curso, licoes]) => {
          const todasConcluidas = Object.values(licoes).every((v) => v === true);
          novasMedalhas[curso] = todasConcluidas;
        });

        setMedalhas(novasMedalhas);
      }
    };

    buscarDadosUsuario();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      if (navigation) navigation.replace('Login');
    } catch (error) {
      Alert.alert('Erro ao sair', error.message);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.titulo}>Perfil de {nomeUsuario}</Text>
      <Text style={styles.subtitulo}>Medalhas de Cursos</Text>
      {Object.keys(medalhas).map((curso) => (
        <View key={curso} style={styles.medalhaContainer}>
          <Text style={styles.nomeCurso}>{curso}</Text>
          {medalhas[curso] ? (
            <Image source={require('../assets/medalha.png')} style={styles.medalhaImg} />
          ) : (
            <Text style={styles.incompleto}>🚫 Curso incompleto</Text>
          )}
        </View>
      ))}
      <View style={styles.logoutBtn}>
        <Button title="Sair" color="#d9534f" onPress={handleLogout} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#fff' },
  titulo: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
  subtitulo: { fontSize: 18, fontWeight: '600', marginBottom: 20 },
  medalhaContainer: { marginBottom: 30, alignItems: 'center' },
  nomeCurso: { fontSize: 16, fontWeight: '500', marginBottom: 10 },
  medalhaImg: { width: 80, height: 80 },
  incompleto: { fontSize: 14, color: 'gray' },
  logoutBtn: { marginTop: 30, alignItems: 'center' }
});