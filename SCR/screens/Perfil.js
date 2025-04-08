import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  Image, 
  TouchableOpacity, 
  ScrollView, 
  ActivityIndicator,
  FlatList,
  Alert
} from 'react-native';
import { getAuth, signOut } from 'firebase/auth';
import { getFirestore, doc, getDoc, collection, getDocs } from 'firebase/firestore';
import { app } from '../../firebase';

export default function PerfilScreen({ navigation }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cursosProgresso, setCursosProgresso] = useState([]);
  const [medalhas, setMedalhas] = useState([]);
  const [totalCursos, setTotalCursos] = useState(0);
  const [cursosConcluidos, setCursosConcluidos] = useState(0);
  
  const auth = getAuth();
  const db = getFirestore(app);
  const userId = auth.currentUser?.uid;

  useEffect(() => {
    if (userId) {
      setUser(auth.currentUser);
      fetchUserData();
    }
  }, [userId]);

  const fetchUserData = async () => {
    try {
      // Buscar cursos disponíveis
      const cursosCollection = collection(db, 'cursos');
      const cursosSnapshot = await getDocs(cursosCollection);
      const cursosList = cursosSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setTotalCursos(cursosList.length);
      
      // Buscar progresso do usuário em cada curso
      const progressoPromises = cursosList.map(async (curso) => {
        const progressoDoc = await getDoc(doc(db, 'usuarios', userId, 'progresso', curso.id));
        const medalhasDoc = await getDoc(doc(db, 'usuarios', userId, 'medalhas', curso.id));
        
        let progresso = 0;
        let medalhasCurso = [];
        
        if (progressoDoc.exists()) {
          const licoesConcluidas = progressoDoc.data().licoesConcluidas || [];
          const totalLicoes = curso.lições || 10; // Valor padrão se não estiver definido
          progresso = Math.round((licoesConcluidas.length / totalLicoes) * 100);
        }
        
        if (medalhasDoc.exists()) {
          medalhasCurso = medalhasDoc.data().medalhas || [];
        }
        
        return {
          cursoId: curso.id,
          cursoNome: curso.nome,
          progresso,
          medalhas: medalhasCurso
        };
      });
      
      const progressoResultados = await Promise.all(progressoPromises);
      setCursosProgresso(progressoResultados);
      
      // Calcular cursos concluídos
      const concluidos = progressoResultados.filter(curso => curso.progresso === 100).length;
      setCursosConcluidos(concluidos);
      
      // Coletar todas as medalhas
      const todasMedalhas = progressoResultados.flatMap(curso => 
        curso.medalhas.map(medalha => ({
          tipo: medalha,
          curso: curso.cursoNome
        }))
      );
      setMedalhas(todasMedalhas);
      
    } catch (error) {
      console.error('Erro ao buscar dados do usuário:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigation.replace('Login');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      Alert.alert('Erro', 'Não foi possível fazer logout. Tente novamente.');
    }
  };

  const getMedalhaIcon = (tipo) => {
    switch (tipo) {
      case 'bronze':
        return '🥉';
      case 'prata':
        return '🥈';
      case 'ouro':
        return '🥇';
      case 'diamante':
        return '💎';
      default:
        return '🏅';
    }
  };

  const getMedalhaNome = (tipo) => {
    switch (tipo) {
      case 'bronze':
        return 'Bronze';
      case 'prata':
        return 'Prata';
      case 'ouro':
        return 'Ouro';
      case 'diamante':
        return 'Diamante';
      default:
        return 'Medalha';
    }
  };

  const renderMedalhaItem = ({ item }) => (
    <View style={styles.medalhaItem}>
      <Text style={styles.medalhaIcon}>{getMedalhaIcon(item.tipo)}</Text>
      <View style={styles.medalhaInfo}>
        <Text style={styles.medalhaNome}>{getMedalhaNome(item.tipo)}</Text>
        <Text style={styles.medalhaCurso}>{item.curso}</Text>
      </View>
    </View>
  );

  const renderCursoProgressoItem = ({ item }) => (
    <View style={styles.cursoProgressoItem}>
      <Text style={styles.cursoProgressoNome}>{item.cursoNome}</Text>
      <View style={styles.progressoContainer}>
        <View style={[styles.progressoBar, { width: `${item.progresso}%` }]} />
        <Text style={styles.progressoText}>{item.progresso}%</Text>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4a6bff" />
        <Text style={styles.loadingText}>Carregando perfil...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.profileImageContainer}>
          <Image 
            source={{ uri: user?.photoURL || 'https://via.placeholder.com/150' }} 
            style={styles.profileImage} 
          />
        </View>
        <Text style={styles.userName}>{user?.displayName || 'Usuário'}</Text>
        <Text style={styles.userEmail}>{user?.email}</Text>
      </View>
      
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{totalCursos}</Text>
          <Text style={styles.statLabel}>Cursos</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{cursosConcluidos}</Text>
          <Text style={styles.statLabel}>Concluídos</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{medalhas.length}</Text>
          <Text style={styles.statLabel}>Medalhas</Text>
        </View>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Meu Progresso</Text>
        <FlatList
          data={cursosProgresso}
          renderItem={renderCursoProgressoItem}
          keyExtractor={item => item.cursoId}
          scrollEnabled={false}
        />
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Minhas Medalhas</Text>
        {medalhas.length > 0 ? (
          <FlatList
            data={medalhas}
            renderItem={renderMedalhaItem}
            keyExtractor={(item, index) => `${item.tipo}-${item.curso}-${index}`}
            scrollEnabled={false}
          />
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Você ainda não conquistou medalhas.</Text>
            <Text style={styles.emptySubtext}>Complete cursos para ganhar medalhas!</Text>
          </View>
        )}
      </View>
      
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Sair</Text>
      </TouchableOpacity>
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
    alignItems: 'center',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  profileImageContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  profileImage: {
    width: 90,
    height: 90,
    borderRadius: 45,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  userEmail: {
    fontSize: 16,
    color: '#e0e0e0',
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginTop: -20,
    marginHorizontal: 20,
    borderRadius: 15,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4a6bff',
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  statDivider: {
    width: 1,
    height: '100%',
    backgroundColor: '#e0e0e0',
  },
  section: {
    backgroundColor: '#fff',
    marginTop: 20,
    marginHorizontal: 20,
    borderRadius: 15,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  cursoProgressoItem: {
    marginBottom: 15,
  },
  cursoProgressoNome: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
  },
  progressoContainer: {
    height: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    position: 'relative',
  },
  progressoBar: {
    height: '100%',
    backgroundColor: '#4a6bff',
    borderRadius: 4,
  },
  progressoText: {
    position: 'absolute',
    right: 0,
    top: -20,
    fontSize: 12,
    color: '#4a6bff',
    fontWeight: 'bold',
  },
  medalhaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    padding: 10,
    backgroundColor: '#f8f9ff',
    borderRadius: 10,
  },
  medalhaIcon: {
    fontSize: 30,
    marginRight: 15,
  },
  medalhaInfo: {
    flex: 1,
  },
  medalhaNome: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  medalhaCurso: {
    fontSize: 14,
    color: '#666',
  },
  emptyContainer: {
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
  },
  logoutButton: {
    backgroundColor: '#ff6b6b',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    margin: 20,
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
}); 