import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Alert } from 'react-native';
import { supabase } from '../../supabase/supabase'; // Seu cliente supabase configurado
import { Feather } from '@expo/vector-icons';

export default function Perfil({ navigation }) {
  const [medalhas, setMedalhas] = useState({});
  const [cursosIniciados, setCursosIniciados] = useState(0);
  const [cursosFinalizados, setCursosFinalizados] = useState(0);
  const [nomeUsuario, setNomeUsuario] = useState('');
  const [emailUsuario, setEmailUsuario] = useState('');
  const [fotoUsuario, setFotoUsuario] = useState('https://www.example.com/default-avatar.png');

  useEffect(() => {
    const buscarDadosUsuario = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error || !user) {
        console.error('Erro ao obter usuário:', error);
        return;
      }

      const { data, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('uid', user.id)
        .single();

      if (userError || !data) {
        console.error('Erro ao buscar dados do usuário:', userError);
        return;
      }

      setNomeUsuario(data.name);
      setEmailUsuario(user.email);
      // setFotoUsuario(data.photoURL || default) — adicione esse campo se quiser no Supabase
      const progresso = data.progresso || {};

      let cursosIniciadosCount = 0;
      let cursosFinalizadosCount = 0;
      const novasMedalhas = {};

      Object.entries(progresso).forEach(([curso, licoes]) => {
        const todasConcluidas = Object.values(licoes).every((v) => v === true);

        if (todasConcluidas) {
          cursosFinalizadosCount += 1;
        } else if (Object.values(licoes).some((v) => v === true)) {
          cursosIniciadosCount += 1;
        }

        novasMedalhas[curso] = todasConcluidas;
      });

      setCursosIniciados(cursosIniciadosCount);
      setCursosFinalizados(cursosFinalizadosCount);
      setMedalhas(novasMedalhas);
    };

    buscarDadosUsuario();
  }, []);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      Alert.alert('Erro ao sair', error.message);
    } else if (navigation) {
      navigation.replace('Login');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.voltarBtn}>
          <Feather name="arrow-left" size={30} color="#333" />
        </TouchableOpacity>
        <Text style={styles.titulo}>Perfil de {nomeUsuario}</Text>
      </View>

      <View style={styles.fotoContainer}>
        <Image source={{ uri: fotoUsuario }} style={styles.fotoPerfil} />
      </View>

      <Text style={styles.nomeUsuario}>{nomeUsuario}</Text>
      <Text style={styles.emailUsuario}>{emailUsuario}</Text>

      <View style={styles.resumoContainer}>
        <View style={styles.resumoBox}>
          <Text style={styles.resumoTitulo}>Cursos Iniciados</Text>
          <Text style={styles.resumoNumero}>{cursosIniciados}</Text>
        </View>
        <View style={styles.resumoBox}>
          <Text style={styles.resumoTitulo}>Medalhas</Text>
          <Text style={styles.resumoNumero}>{Object.keys(medalhas).length}</Text>
        </View>
        <View style={styles.resumoBox}>
          <Text style={styles.resumoTitulo}>Cursos Finalizados</Text>
          <Text style={styles.resumoNumero}>{cursosFinalizados}</Text>
        </View>
      </View>

      <Text style={styles.subtitulo}>Medalhas de Cursos</Text>
      {Object.keys(medalhas).map((curso) => (
        <View key={curso} style={styles.medalhaContainer}>
          <Text style={styles.nomeCurso}>{curso}</Text>
          <View style={styles.medalhaStatus}>
            {medalhas[curso] ? (
              <>
                <Image source={require('../assets/medalha.png')} style={styles.medalhaImg} />
                <Text style={styles.medalhaConcluida}>Curso Concluído!</Text>
              </>
            ) : (
              <>
                <Text style={styles.incompleto}>🚫 Curso incompleto</Text>
                <Text style={styles.medalhaIncompleta}>Continue seu aprendizado!</Text>
              </>
            )}
          </View>
        </View>
      ))}

      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Text style={styles.logoutText}>Sair</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 25,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
    position: 'relative',
  },
  voltarBtn: {
    position: 'absolute',
    left: 10,
    top: 10,
    zIndex: 1,
  },
  titulo: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 10,
  },
  fotoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  fotoPerfil: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: '#ddd',
    marginBottom: 10,
  },
  nomeUsuario: {
    fontSize: 22,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
  emailUsuario: {
    fontSize: 16,
    color: '#777',
    textAlign: 'center',
    marginBottom: 20,
  },
  resumoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  resumoBox: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 10,
  },
  resumoTitulo: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  resumoNumero: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    marginTop: 10,
  },
  subtitulo: {
    fontSize: 20,
    fontWeight: '600',
    color: '#555',
    marginBottom: 20,
    textAlign: 'center',
  },
  medalhaContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 15,
    marginBottom: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  nomeCurso: {
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 15,
    color: '#333',
  },
  medalhaStatus: {
    alignItems: 'center',
    marginTop: 10,
  },
  medalhaImg: {
    width: 80,
    height: 80,
    marginBottom: 10,
  },
  medalhaConcluida: {
    fontSize: 16,
    color: '#28a745',
    fontWeight: '600',
    marginTop: 5,
  },
  incompleto: {
    fontSize: 16,
    color: '#ff6347',
    fontWeight: 'bold',
    marginTop: 10,
  },
  medalhaIncompleta: {
    fontSize: 14,
    color: '#ff6347',
    marginTop: 5,
    fontStyle: 'italic',
  },
  logoutBtn: {
    backgroundColor: '#d9534f',
    paddingVertical: 12,
    paddingHorizontal: 50,
    borderRadius: 10,
    marginTop: 30,
    alignItems: 'center',
    elevation: 4,
  },
  logoutText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});