import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';

import LoginScreen from './SCR/screens/login';
import HomeScreen from './SCR/screens/Home';
import PerfilScreen from './SCR/screens/Perfil';
import ModuloScreen from './SCR/screens/Modulo';
import AtualizarCursoScreen from './SCR/screens/AtualizarCurso';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Perfil" component={PerfilScreen} />
         <Stack.Screen
            name="AtualizarCurso"
            component={AtualizarCursoScreen}
            options={{ headerShown: true, title: 'Atualizar Curso' }}
          />
        <Stack.Screen name="Modulo" component={ModuloScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
