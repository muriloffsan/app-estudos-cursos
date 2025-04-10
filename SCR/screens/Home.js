import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Image } from 'react-native';
import { getAuth } from 'firebase/auth';

export default function HomeScreen({ navigation }) {
  const auth = getAuth();
  const user = auth.currentUser;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Estudos e Cursos</Text>
        <TouchableOpacity 
          style={styles.profileButton}
          onPress={() => navigation.navigate('Perfil')}
        >
          <Image 
            source={{ uri: user?.photoURL || 'https://via.placeholder.com/150' }} 
            style={styles.profileImage} 
          />
        </TouchableOpacity>
      </View>
      
      <View style={styles.welcomeContainer}>
        <Text style={styles.welcomeText}>Olá, {user?.displayName || 'Estudante'}!</Text>
        <Text style={styles.welcomeSubtext}>Continue sua jornada de aprendizado</Text>
      </View>
      
      <View style={styles.menuContainer}>
        <TouchableOpacity 
          style={styles.menuItem}
          onPress={() => navigation.navigate('Cursos')}
        >
          <View style={[styles.menuIcon, { backgroundColor: '#4a6bff' }]}>
            <Text style={styles.menuIconText}>📚</Text>
          </View>
          <Text style={styles.menuTitle}>Cursos</Text>
          <Text style={styles.menuDescription}>Explore todos os cursos disponíveis</Text>
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
            onPress={() => navigation.navigate('DetalhesCurso', { 
              cursoId: 'curso1', 
              cursoNome: 'Introdução à Programação' 
            })}
          >
            <Image 
              source={{ uri: 'https://via.placeholder.com/150' }} 
              style={styles.cursoImage} 
            />
            <View style={[styles.menuIcon, { backgroundColor: '#1abc9c', marginTop: 10 }]}>
              <Text style={styles.menuIconText}>💻</Text>
            </View>
            <Text style={styles.cursoNome}>Introdução à Programação</Text>
            <Text style={styles.cursoNivel}>Iniciante</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.cursoCard}
            onPress={() => navigation.navigate('DetalhesCurso', { 
              cursoId: 'curso2', 
              cursoNome: 'Desenvolvimento Web' 
            })}
          >
            <Image 
              source={{ uri: 'https://via.placeholder.com/150' }} 
              style={styles.cursoImage} 
            />
            <View style={[styles.menuIcon, { backgroundColor: '#f39c12', marginTop: 10 }]}>
              <Text style={styles.menuIconText}>🌐</Text>
            </View>
            <Text style={styles.cursoNome}>Desenvolvimento Web</Text>
            <Text style={styles.cursoNivel}>Intermediário</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.cursoCard}
            onPress={() => navigation.navigate('DetalhesCurso', { 
              cursoId: 'curso3', 
              cursoNome: 'Design de Interfaces' 
            })}
          >
            <Image 
              source={{ uri: 'https://via.placeholder.com/150' }} 
              style={styles.cursoImage} 
            />
            <View style={[styles.menuIcon, { backgroundColor: '#e67e22', marginTop: 10 }]}>
              <Text style={styles.menuIconText}>🎨</Text>
            </View>
            <Text style={styles.cursoNome}>Design de Interfaces</Text>
            <Text style={styles.cursoNivel}>Avançado</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Continue de Onde Parou</Text>
        <TouchableOpacity 
          style={styles.continueCard}
          onPress={() => navigation.navigate('DetalhesCurso', { 
            cursoId: 'curso1', 
            cursoNome: 'Introdução à Programação' 
          })}
        >
          <View style={styles.continueInfo}>
            <Text style={styles.continueTitle}>Introdução à Programação</Text>
            <Text style={styles.continueProgress}>Progresso: 0%</Text>
            <View style={styles.progressoContainer}>
              <View style={[styles.progressoBar, { width: '0%' }]} />
            </View>
          </View>
          <Text style={styles.continueIcon}>›</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.footer}>
        <Text style={styles.footerText}>© 2023 Estudos e Cursos</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#4a6bff',
    padding: 20,
    paddingTop: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  welcomeContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  welcomeText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  welcomeSubtext: {
    fontSize: 16,
    color: '#666',
  },
  menuContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
  },
  menuItem: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 15,
    width: '48%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 3,
  },
  menuIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  menuIconText: {
    fontSize: 24,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  menuDescription: {
    fontSize: 12,
    color: '#666',
  },
  section: {
    backgroundColor: '#fff',
    padding: 20,
    marginTop: 10,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  cursosScroll: {
    marginLeft: -5,
  },
  cursoCard: {
    width: 150,
    marginRight: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
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
    marginTop: 5,
  },
  cursoNivel: {
    fontSize: 12,
    color: '#666',
    paddingHorizontal: 10,
    paddingBottom: 10,
    textAlign: 'center',
  },
  continueCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9ff',
    borderRadius: 10,
    padding: 15,
    borderWidth: 1,
    borderColor: '#e0e0e0',
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
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  progressoContainer: {
    height: 6,
    backgroundColor: '#e0e0e0',
    borderRadius: 3,
  },
  progressoBar: {
    height: '100%',
    backgroundColor: '#4a6bff',
    borderRadius: 3,
  },
  continueIcon: {
    fontSize: 24,
    color: '#ccc',
    marginLeft: 10,
  },
  footer: {
    padding: 20,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#999',
  },
});
