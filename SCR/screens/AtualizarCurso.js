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
            {key} - {licoes[key] ? ' Concluído' : ' Incompleto'}
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
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f9fa', 
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 20,
    color: '#343a40', 
    textAlign: 'center',
  },
  item: {
    padding: 18,
    backgroundColor: '#ffffff',
    marginBottom: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderLeftWidth: 5,
    borderLeftColor: '#dee2e6',
  },
  itemConcluido: {
    backgroundColor: '#e6fffa',
    borderLeftColor: '#38b2ac',
  },
  itemText: {
    fontSize: 16,
    color: '#495057',
    fontWeight: '500',
  },
  botaoSalvar: {
    marginTop: 30,
    backgroundColor: '#4a6bff',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#4a6bff',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  botaoTexto: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 16,
    letterSpacing: 1,
  },
});
