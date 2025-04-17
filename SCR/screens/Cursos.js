import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  FlatList, 
  TouchableOpacity, 
  Image, 
  ActivityIndicator,
  RefreshControl
} from 'react-native';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { app } from '../../firebase';
import { getAuth } from 'firebase/auth';
import { getCursos, getUserProgress } from '../../firebase/firestore';

export default function CursosScreen({ navigation }) {
  const [cursos, setCursos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  const db = getFirestore(app);
  const auth = getAuth();
  const userId = auth.currentUser?.uid;

  const fetchCursos = async () => {
    try {
      const cursosData = await getCursos();
      
      // Carregar progresso para cada curso
      const cursosComProgresso = await Promise.all(
        cursosData.map(async (curso) => {
          const progresso = await getUserProgress(userId, curso.id);
          return {
            ...curso,
            progresso: progresso.progresso || 0
          };
        })
      );
      
      setCursos(cursosComProgresso);
    } catch (error) {
      console.error('Erro ao buscar cursos:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchCursos();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchCursos();
  };

  const renderCursoItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.cursoCard}
      onPress={() => navigation.navigate('DetalhesCurso', { cursoId: item.id, cursoNome: item.nome })}
    >
      <View style={styles.cursoImageContainer}>
        <Image 
          source={{ uri: item.imagem || 'https://via.placeholder.com/150' }} 
          style={styles.cursoImage} 
        />
        <View style={styles.cursoBadge}>
          <Text style={styles.cursoBadgeText}>{item.categoria}</Text>
        </View>
      </View>
      
      <View style={styles.cursoInfo}>
        <Text style={styles.cursoNome}>{item.nome}</Text>
        <Text style={styles.cursoDescricao} numberOfLines={2}>
          {item.descricao}
        </Text>
        
        <View style={styles.cursoMeta}>
          <View style={styles.cursoMetaItem}>
            <Text style={styles.cursoMetaText}>{item.lições || 0} lições</Text>
          </View>
          <View style={styles.cursoMetaItem}>
            <Text style={styles.cursoMetaText}>{item.duracao || 'N/A'}</Text>
          </View>
        </View>
        
        <View style={styles.progressoContainer}>
          <View style={[styles.progressoBar, { width: `${item.progresso || 0}%` }]} />
          <Text style={styles.progressoText}>{item.progresso || 0}% concluído</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4a6bff" />
        <Text style={styles.loadingText}>Carregando cursos...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Cursos Disponíveis</Text>
      </View>
      
      <FlatList
        data={cursos}
        renderItem={renderCursoItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#4a6bff']}
            tintColor="#4a6bff"
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Nenhum curso disponível no momento.</Text>
          </View>
        }
      />
    </View>
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
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  listContainer: {
    padding: 16,
  },
  cursoCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 3,
  },
  cursoImageContainer: {
    position: 'relative',
  },
  cursoImage: {
    width: '100%',
    height: 150,
    resizeMode: 'cover',
  },
  cursoBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(74, 107, 255, 0.9)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  cursoBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  cursoInfo: {
    padding: 15,
  },
  cursoNome: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  cursoDescricao: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  cursoMeta: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  cursoMetaItem: {
    marginRight: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  cursoMetaText: {
    fontSize: 12,
    color: '#888',
  },
  progressoContainer: {
    height: 6,
    backgroundColor: '#e0e0e0',
    borderRadius: 3,
    marginTop: 5,
    position: 'relative',
  },
  progressoBar: {
    height: '100%',
    backgroundColor: '#4a6bff',
    borderRadius: 3,
  },
  progressoText: {
    position: 'absolute',
    right: 0,
    top: -20,
    fontSize: 12,
    color: '#4a6bff',
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  
}); 