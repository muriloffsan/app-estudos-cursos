import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { supabase } from '../../supabase/supabase';

export default function AtualizarCurso({ route, navigation }) {
  const { cursoId } = route.params;
  const [userId, setUserId] = useState(null);
  const [licoes, setLicoes] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchProgress = async () => {
      const { data: userSession } = await supabase.auth.getUser();
      const user = userSession?.user;
      if (!user) return Alert.alert('Erro', 'Usuário não autenticado.');

      setUserId(user.id);

      const { data, error } = await supabase
        .from('users')
        .select('progresso')
        .eq('uid', user.id)
        .single();

      if (error) {
        console.error('Erro ao buscar progresso:', error);
        return Alert.alert('Erro', 'Não foi possível carregar o progresso.');
      }

      setLicoes(data.progresso?.[cursoId] || {});
    };

    fetchProgress();
  }, []);

  const toggleLicao = (licaoKey) => {
    setLicoes((prev) => ({
      ...prev,
      [licaoKey]: !prev[licaoKey]
    }));
  };

  const salvarProgresso = async () => {
    if (!userId) return Alert.alert('Erro', 'Usuário não identificado.');
    setIsSaving(true);

    try {
      // Busca progresso atual
      const { data: userData, error: fetchError } = await supabase
        .from('users')
        .select('progresso')
        .eq('uid', userId)
        .single();

      if (fetchError) throw fetchError;

      const progressoAtualizado = {
        ...userData.progresso,
        [cursoId]: licoes
      };

      const { error: updateError } = await supabase
        .from('users')
        .update({ progresso: progressoAtualizado })
        .eq('uid', userId);

      if (updateError) throw updateError;

      Alert.alert('Sucesso', 'Progresso salvo com sucesso!');
    } catch (err) {
      console.error('Erro ao salvar progresso:', err);
      Alert.alert('Erro', 'Erro ao salvar progresso.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Atualizar Progresso do {cursoId}</Text>
      {Object.keys(licoes).map((key) => (
        <TouchableOpacity
          key={key}
          style={[styles.item, licoes[key] && styles.itemConcluido]}
          onPress={() => toggleLicao(key)}
        >
          <Text style={styles.itemText}>
            {key} - {licoes[key] ? '✅ Concluído' : '❌ Incompleto'}
          </Text>
        </TouchableOpacity>
      ))}
      <TouchableOpacity style={styles.botaoSalvar} onPress={salvarProgresso} disabled={isSaving}>
        <Text style={styles.botaoTexto}>{isSaving ? 'Salvando...' : 'Salvar Progresso'}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 20 },
  item: {
    padding: 16,
    backgroundColor: '#f0f0f0',
    marginBottom: 10,
    borderRadius: 10,
  },
  itemConcluido: {
    backgroundColor: '#c6f6d5',
  },
  itemText: {
    fontSize: 16,
  },
  botaoSalvar: {
    marginTop: 20,
    backgroundColor: '#4a6bff',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  botaoTexto: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
