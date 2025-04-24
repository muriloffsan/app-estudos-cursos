// Curso2Screen.js
import React, { useEffect, useState } from 'react';
import { View, Text, Switch, StyleSheet, ScrollView } from 'react-native';
import { doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { getAuth } from 'firebase/auth';

export default function Curso2Screen() {
  const [progresso, setProgresso] = useState({});
  const user = getAuth().currentUser;

  useEffect(() => {
    if (!user) return;

    const userRef = doc(db, 'users', user.uid);
    const unsubscribe = onSnapshot(userRef, (docSnap) => {
      const data = docSnap.data();
      if (data?.progresso?.curso2) {
        setProgresso(data.progresso.curso2);
      }
    });

    return () => unsubscribe();
  }, [user]);

  const toggleLicao = async (licao) => {
    const newValue = !progresso[licao];
    setProgresso({ ...progresso, [licao]: newValue });

    const userRef = doc(db, 'users', user.uid);
    await updateDoc(userRef, {
      [`progresso.curso2.${licao}`]: newValue
    });
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Curso 2</Text>
      {Object.keys(progresso).map((licao) => (
        <View key={licao} style={styles.licaoContainer}>
          <Text style={styles.licaoText}>{licao}</Text>
          <Switch
            value={progresso[licao]}
            onValueChange={() => toggleLicao(licao)}
          />
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#fff', flex: 1 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  licaoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
    alignItems: 'center'
  },
  licaoText: { fontSize: 18 }
});
