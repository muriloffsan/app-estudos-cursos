import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

export default function CursosScreen() {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>🚀 Bem-vindo ao seu Futuro!</Text>
      <Text style={styles.intro}>
        Aqui, você não apenas estuda. Você evolui, cresce e se transforma.
        Escolha o curso ideal para o seu momento e mergulhe na jornada do conhecimento.
      </Text>

      <View style={styles.cursoBox}>
        <Text style={styles.cursoEmoji}>💻</Text>
        <Text style={styles.cursoTitulo}>Curso 1: Introdução à Programação</Text>
        <Text style={styles.cursoNivel}>Nível: Iniciante</Text>
        <Text style={styles.cursoTexto}>
          Nunca escreveu uma linha de código? Perfeito. Aqui é o começo.
          Aprenda lógica de programação, descubra como os computadores pensam
          e dê seus primeiros passos como desenvolvedor. Ao final, você estará pronto
          para explorar qualquer linguagem com confiança.
        </Text>
      </View>

      <View style={styles.cursoBox}>
        <Text style={styles.cursoEmoji}>🌐</Text>
        <Text style={styles.cursoTitulo}>Curso 2: Desenvolvimento Web</Text>
        <Text style={styles.cursoNivel}>Nível: Intermediário</Text>
        <Text style={styles.cursoTexto}>
          HTML, CSS e JavaScript deixarão de ser mistério. Neste curso, você vai
          criar páginas web do zero, aplicar estilos com precisão e adicionar
          interatividade poderosa. Aprenda como funciona a internet e construa
          sites modernos e responsivos como um verdadeiro web developer.
        </Text>
      </View>

      <View style={styles.cursoBox}>
        <Text style={styles.cursoEmoji}>🎨</Text>
        <Text style={styles.cursoTitulo}>Curso 3: Design de Interfaces</Text>
        <Text style={styles.cursoNivel}>Nível: Avançado</Text>
        <Text style={styles.cursoTexto}>
          A tecnologia só encanta quando é fácil de usar. Aprenda os segredos por
          trás de interfaces que engajam e fidelizam. Descubra o universo do UI/UX,
          domine princípios de design e transforme ideias em experiências digitais
          memoráveis. Ideal para quem quer ir além do código.
        </Text>
      </View>

      <Text style={styles.finalText}>
         Escolha o seu ponto de partida. O futuro começa com um clique.  
        E ele está logo ali, no próximo decisão.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f9fc',
    padding: 20,
  },
  header: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#1a1a1a',
    textAlign: 'center',
    marginBottom: 10,
  },
  intro: {
    fontSize: 15,
    color: '#444',
    textAlign: 'center',
    marginBottom: 25,
    lineHeight: 22,
  },
  cursoBox: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 18,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 3,
  },
  cursoEmoji: {
    fontSize: 28,
    textAlign: 'center',
    marginBottom: 10,
  },
  cursoTitulo: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    textAlign: 'center',
    marginBottom: 4,
  },
  cursoNivel: {
    fontSize: 13,
    color: '#888',
    textAlign: 'center',
    marginBottom: 10,
  },
  cursoTexto: {
    fontSize: 14,
    color: '#444',
    lineHeight: 22,
    textAlign: 'justify',
  },
  finalText: {
    fontSize: 15,
    color: '#2c3e50',
    textAlign: 'center',
    marginTop: 20,
    fontStyle: 'italic',
  },
});
