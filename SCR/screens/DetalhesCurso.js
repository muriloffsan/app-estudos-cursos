import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Image } from 'react-native';
import { getAuth } from 'firebase/auth';
import { getDoc, doc } from 'firebase/firestore'; // Importe getDoc e doc
import { db } from '../../firebase'; // Importe a instância do db

export default function DetalhesCursoScreen({ route, navigation }) {
  const { cursoId } = route.params; // Agora só recebemos o cursoId
  const [curso, setCurso] = useState(null);
  const [loading, setLoading] = useState(true);
  const auth = getAuth();
  const userId = auth.currentUser?.uid;

  useEffect(() => {
    carregarCurso();
  }, [cursoId, userId]);

  const carregarCurso = async () => {
    try {
      const cursoRef = doc(db, 'cursos', cursoId); // Referência à coleção 'cursos'
      const cursoSnap = await getDoc(cursoRef);

      if (cursoSnap.exists()) {
        setCurso({ id: cursoSnap.id, ...cursoSnap.data() });
      } else {
        console.log("Curso não encontrado!");
      }
    } catch (error) {
      console.error('Erro ao carregar curso:', error);
    } finally {
      setLoading(false);
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
      {curso && (
        <View>
          <View style={styles.cursoHeader}>
            <Image
              source={{ uri: curso.imagem || 'https://via.placeholder.com/150' }}
              style={styles.cursoImage}
            />
            <View style={styles.cursoInfo}>
              <Text style={styles.cursoNome}>{curso.nome}</Text>
              <Text style={styles.cursoCategoria}>{curso.categoria}</Text>
              <Text style={styles.cursoDescricao}>{curso.descricao}</Text>
            </View>
          </View>

          <View style={styles.content}>
            <View style={styles.infoSection}>
              <Text style={styles.sectionTitle}>Sobre o Curso</Text>
              <Text style={styles.description}>{curso.descricao || 'Descrição não disponível'}</Text>

              <View style={styles.statsContainer}>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{curso.duracao || '0'}</Text>
                  <Text style={styles.statLabel}>Horas</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{curso.modulos?.length || '0'}</Text>
                  <Text style={styles.statLabel}>Módulos</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{curso.alunos || '0'}</Text>
                  <Text style={styles.statLabel}>Alunos</Text>
                </View>
              </View>
            </View>

            <View style={styles.modulosSection}>
              <Text style={styles.sectionTitle}>Módulos do Curso</Text>
              {curso.modulos?.map((modulo, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.moduloCard}
                  onPress={() => navigation.navigate('Modulo', {
                    cursoId: curso.id,
                    moduloId: index,
                    moduloNome: modulo.titulo
                  })}
                >
                  <View style={styles.moduloInfo}>
                    <Text style={styles.moduloNumero}>Módulo {index + 1}</Text>
                    <Text style={styles.moduloTitulo}>{modulo.titulo}</Text>
                    <Text style={styles.moduloDescricao}>{modulo.descricao}</Text>
                  </View>
                  <Text style={styles.moduloIcon}>›</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <TouchableOpacity
            style={styles.startButton}
            onPress={() => navigation.navigate('Curso', {
              cursoId: curso.id,
              totalLicoes: curso.totalLicoes
            })}
          >
            <Text style={styles.startButtonText}>Ver Progresso</Text>
          </TouchableOpacity>
        </View>
      )}
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
  cursoHeader: {
    height: 200,
    position: 'relative',
  },
  cursoImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  cursoInfo: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 20,
  },
  cursoNome: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  cursoCategoria: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.8,
  },
  cursoDescricao: {
    fontSize: 16,
    color: '#fff',
  },
  content: {
    padding: 20,
  },
  infoSection: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  description: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
    marginBottom: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 20,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4a6bff',
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  modulosSection: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  moduloCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9ff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  moduloInfo: {
    flex: 1,
  },
  moduloNumero: {
    fontSize: 14,
    color: '#4a6bff',
    marginBottom: 5,
  },
  moduloTitulo: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  moduloDescricao: {
    fontSize: 14,
    color: '#666',
  },
  moduloIcon: {
    fontSize: 24,
    color: '#ccc',
    marginLeft: 10,
  },
  startButton: {
    backgroundColor: '#4a6bff',
    borderRadius: 10,
    padding: 15,
    margin: 20,
    alignItems: 'center',
  },
  startButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
}); 