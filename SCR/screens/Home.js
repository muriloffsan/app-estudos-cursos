import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Image } from 'react-native';
import { useEffect, useState } from 'react';
import { supabase } from '../../supabase/supabase';


export default function HomeScreen({ navigation }) {
  const [user, setUser] = useState(null);
  const [progressoTotal, setProgressoTotal] = useState(0);

useEffect(() => {
  const fetchProgresso = async () => {
    const { data: sessionData, error: sessionError } = await supabase.auth.getUser();
    const user = sessionData?.user;
    if (!user || sessionError) return;

    setUser(user); // já fazia isso

    const { data, error } = await supabase
      .from('users')
      .select('progresso')
      .eq('uid', user.id)
      .single();

    if (error || !data) {
      console.error('Erro ao buscar progresso:', error);
      return;
    }

    const progresso = data.progresso;
    const totalLicoes = Object.values(progresso)
      .map((curso) => Object.values(curso))
      .flat();

    const concluidas = totalLicoes.filter((val) => val === true).length;
    const porcentagem = totalLicoes.length === 0 ? 0 : Math.round((concluidas / totalLicoes.length) * 100);


    setProgressoTotal(porcentagem);
  };

  fetchProgresso();
}, []);



  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerTitle}>Estudos e Cursos</Text>
          <Image
            source={require('../assets/logo_estudo.png')} 
            style={styles.logoImage}
          />
        </View>
      </View>

      <View style={styles.welcomeContainer}>
        <Text style={styles.welcomeText}>Olá, {user?.displayName || 'Estudante'}!</Text>
        <Text style={styles.welcomeSubtext}>Continue sua jornada de aprendizado</Text>
      </View>

      <View style={styles.menuContainer}>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate('Modulo')}
        >
          <View style={[styles.menuIcon, { backgroundColor: '#4a6bff' }]}>
            <Text style={styles.menuIconText}>📚</Text>
          </View>
          <Text style={styles.menuTitle}>Cursos</Text>
          <Text style={styles.menuDescription}>Explore o que os cursos lhe proporcionam</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate('Perfil')}
        >
          <View style={[styles.menuIcon, { backgroundColor: '#ff6b6b' }]}>
            <Text style={styles.menuIconText}>👤</Text>
          </View>
          <Text style={styles.menuTitle}>Meu Perfil</Text>
          <Text style={styles.menuDescription}>Veja seu progresso e medalhas</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Cursos em Destaque</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.cursosScroll}>
          <TouchableOpacity
            style={styles.cursoCard}
            onPress={() => navigation.navigate('AtualizarCurso', { cursoId: 'curso1' })}
          >
            <Image
              source={{ uri: 'https://via.placeholder.com/150' }}
              style={styles.cursoImage}
            />
            <View style={[styles.menuIcon, { backgroundColor: '#1abc9c', marginTop: 10 }]}>
              <Text style={styles.menuIconText}>💻</Text>
            </View>
            <Text style={styles.cursoNome}>Introdução à Programação</Text>
            <Text style={styles.cursoNivel}>Iniciante - Curso1</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.cursoCard}
            onPress={() => navigation.navigate('AtualizarCurso', { cursoId: 'curso2' })}
          >
            <Image
              source={{ uri: 'https://via.placeholder.com/150' }}
              style={styles.cursoImage}
            />
            <View style={[styles.menuIcon, { backgroundColor: '#f39c12', marginTop: 10 }]}>
              <Text style={styles.menuIconText}>🌐</Text>
            </View>
            <Text style={styles.cursoNome}>Desenvolvimento Web</Text>
            <Text style={styles.cursoNivel}>Intermediário - Curso2</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.cursoCard}
            onPress={() => navigation.navigate('AtualizarCurso', { cursoId: 'curso3' })}
          >
            <Image
              source={{ uri: 'https://via.placeholder.com/150' }}
              style={styles.cursoImage}
            />
            <View style={[styles.menuIcon, { backgroundColor: '#e67e22', marginTop: 10 }]}>
              <Text style={styles.menuIconText}>🎨</Text>
            </View>
            <Text style={styles.cursoNome}>Design de Interfaces</Text>
            <Text style={styles.cursoNivel}>Avançado - Curso3</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Continue de Onde Parou</Text>
        <TouchableOpacity
          style={styles.continueCard}
          onPress={() => navigation.navigate('AtualizarCurso', { cursoId: 'curso1' })}
        >
          <View style={styles.continueInfo}>
            <Text style={styles.continueTitle}>Progresso total dos cursos</Text>
            <Text style={styles.continueProgress}>Progresso: {progressoTotal}%</Text>
              <View style={styles.progressoContainer}>
                <View style={[styles.progressoBar, { width: `${progressoTotal}%` }]} />
              </View>
          </View>
          <Text style={styles.continueIcon}>›</Text>
        </TouchableOpacity>

      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>© 2025 Estudos e Cursos</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eef1f8',
  },
  header: {
    backgroundColor: '#4a6bff',
    padding: 24,
    paddingTop: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#fff',
  },
  profileButton: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  profileImage: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
  },
  welcomeContainer: {
    backgroundColor: '#fff',
    padding: 24,
    marginTop: -15,
    marginBottom: 10,
    borderRadius: 20,
    marginHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 5,
    elevation: 4,
  },
  welcomeText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 6,
  },
  welcomeSubtext: {
    fontSize: 15,
    color: '#777',
  },
  menuContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  menuItem: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 18,
    width: '48%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 5,
    elevation: 3,
  },
  menuIcon: {
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  menuIconText: {
    fontSize: 24,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  menuDescription: {
    fontSize: 13,
    color: '#777',
  },
  section: {
    backgroundColor: '#fff',
    padding: 20,
    marginTop: 14,
    marginHorizontal: 20,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 5,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  cursosScroll: {
    paddingBottom: 10,
  },
  cursoCard: {
    width: 150,
    marginRight: 15,
    backgroundColor: '#fff',
    borderRadius: 15,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 5,
    elevation: 3,
    alignItems: 'center',
  },
  cursoImage: {
    width: '100%',
    height: 100,
    resizeMode: 'cover',
  },
  cursoNome: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    paddingHorizontal: 10,
    textAlign: 'center',
    marginTop: 8,
  },
  cursoNivel: {
    fontSize: 12,
    color: '#777',
    paddingHorizontal: 10,
    paddingBottom: 10,
    textAlign: 'center',
  },
  continueCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f4ff',
    borderRadius: 15,
    padding: 18,
    borderWidth: 1,
    borderColor: '#d6dfff',
  },
  continueInfo: {
    flex: 1,
  },
  continueTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  continueProgress: {
    fontSize: 13,
    color: '#666',
    marginBottom: 5,
  },
  progressoContainer: {
    height: 6,
    backgroundColor: '#d6dfff',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressoBar: {
    height: '100%',
    backgroundColor: '#4a6bff',
    borderRadius: 3,
  },
  continueIcon: {
    fontSize: 24,
    color: '#aaa',
    marginLeft: 12,
  },
  footer: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#999',
  },
});