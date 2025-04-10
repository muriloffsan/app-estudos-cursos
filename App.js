import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { View, ActivityIndicator, TouchableOpacity, Text } from 'react-native';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { app } from './firebase';

// Importando as telas
import LoginScreen from './SCR/screens/login';
import HomeScreen from './SCR/screens/Home';
import CursosScreen from './SCR/screens/Cursos';
import PerfilScreen from './SCR/screens/Perfil';
import DetalhesCursoScreen from './SCR/screens/DetalhesCurso';
import ModuloScreen from './SCR/screens/Modulo';

const Stack = createStackNavigator();

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const auth = getAuth(app);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setIsLoading(false);
    });

    return unsubscribe;
  }, []);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#4a6bff" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      <Stack.Navigator 
        screenOptions={{
          headerShown: true,
          headerStyle: {
            backgroundColor: '#4a6bff',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          headerLeft: ({ onPress }) => (
            <TouchableOpacity 
              onPress={onPress}
              style={{ marginLeft: 10 }}
            >
              <Text style={{ color: '#fff', fontSize: 24 }}>‹</Text>
            </TouchableOpacity>
          ),
        }}
      >
        {user ? (
          <>
            <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Cursos" component={CursosScreen} options={{ title: 'Cursos' }} />
            <Stack.Screen name="Perfil" component={PerfilScreen} options={{ title: 'Meu Perfil' }} />
            <Stack.Screen name="DetalhesCurso" component={DetalhesCursoScreen} options={({ route }) => ({ title: route.params.cursoNome })} />
            <Stack.Screen name="Modulo" component={ModuloScreen} options={({ route }) => ({ title: route.params.moduloNome })} />
          </>
        ) : (
          <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
