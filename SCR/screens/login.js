import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
  ImageBackground,
  ScrollView // Adicionado para melhor rolagem em telas menores
} from 'react-native';
// Importa apenas o 'auth' e a função do firestore
import { auth } from '../../firebase'; // Importa o auth inicializado
import { createInitialUserProfile } from '../../firebase/firestore'; // Importa a função
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';

// Não precisa mais inicializar o Firebase aqui
// const app = initializeApp(firebaseConfig);
// const auth = getAuth(app);

export default function LoginScreen({ navigation }) {
  const [name, setName] = useState(''); // Estado para o nome
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(true); // true = Tela de Login, false = Tela de Cadastro

  const handleAuth = async () => {
    // Validação básica
    if (!email || !password || (!isLogin && !name)) { // Adiciona validação de nome no cadastro
      Alert.alert('Atenção', 'Por favor, preencha todos os campos.');
      return;
    }

    setIsLoading(true);
    try {
      if (isLogin) {
        // --- Login ---
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        console.log('Usuário logado:', userCredential.user.email);
        // Navega para Home após login bem-sucedido
        navigation.replace('Home'); // Use replace para não poder voltar para o login
      } else {
        // --- Cadastro ---
        if (password.length < 6) {
           Alert.alert('Erro', 'A senha deve ter pelo menos 6 caracteres.');
           setIsLoading(false); // Interrompe o loading
           return; // Sai da função
        }
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        console.log('Usuário criado:', userCredential.user.email);

        // Chama a função para criar o perfil no Firestore
        await createInitialUserProfile(userCredential.user, name); // Passa o nome

        Alert.alert('Sucesso', 'Conta criada com sucesso! Faça o login para continuar.');
        setIsLogin(true); // Muda para a tela de login após cadastro
        // Limpa os campos após cadastro (opcional)
        setName('');
        setEmail('');
        setPassword('');
      }
    } catch (error) {
      console.error("Erro de autenticação:", error.code, error.message); // Log detalhado do erro
      let errorMessage = 'Ocorreu um erro. Tente novamente.';
      // Mapeamento de erros mais robusto
      switch (error.code) {
        case 'auth/invalid-email':
          errorMessage = 'O formato do email é inválido.';
          break;
        case 'auth/user-disabled':
          errorMessage = 'Este usuário foi desativado.';
          break;
        case 'auth/user-not-found':
          errorMessage = 'Nenhum usuário encontrado com este email.';
          break;
        case 'auth/wrong-password':
          errorMessage = 'Senha incorreta. Tente novamente.';
          break;
        case 'auth/email-already-in-use':
          errorMessage = 'Este email já está sendo usado por outra conta.';
          break;
        case 'auth/weak-password':
          errorMessage = 'A senha é muito fraca. Use pelo menos 6 caracteres.';
          break;
        case 'auth/operation-not-allowed':
          errorMessage = 'Login com email/senha não está habilitado no Firebase.';
          break;
        default:
          // Para outros erros do Firebase ou erros da função createInitialUserProfile
          errorMessage = `Erro: ${error.message}`;
      }
      Alert.alert('Erro', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Função para alternar entre Login e Cadastro
  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    // Limpa os campos ao trocar de modo (opcional, mas melhora UX)
    setName('');
    setEmail('');
    setPassword('');
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20} // Ajuste fino opcional
    >
      <ImageBackground
        source={require('../assets/fundoLogin.png')}
        style={styles.background}
        resizeMode="cover"
      >
        {/* ScrollView para acomodar conteúdo em telas menores ou quando teclado abre */}
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.logoContainer}>
            <Image
              source={require('../assets/logo_estudo.png')}
              style={styles.logo}
              resizeMode="contain"
            />
            {/* Título movido para dentro do container branco para melhor contraste */}
            {/* <Text style={styles.title}>Estudos e Cursos</Text> */}
          </View>

          <View style={styles.formContainer}>
            {/* Título dentro do container branco */}
            <Text style={styles.formTitle}>
              {isLogin ? 'Bem-vindo(a)!' : 'Crie sua Conta'}
            </Text>
            <Text style={styles.formSubtitle}>
              {isLogin ? 'Faça login para continuar' : 'Preencha os dados abaixo'}
            </Text>

            {/* Campo Nome (aparece apenas no cadastro) */}
            {!isLogin && (
              <TextInput
                style={styles.input}
                placeholder="Nome Completo"
                value={name}
                onChangeText={setName}
                autoCapitalize="words" // Primeira letra de cada palavra maiúscula
              />
            )}

            <TextInput
              style={styles.input}
              placeholder="Seu melhor email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email" // Ajuda no preenchimento automático
            />

            <TextInput
              style={styles.input}
              placeholder="Senha (mín. 6 caracteres)"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoComplete="password" // Ajuda no preenchimento automático (em alguns casos)
            />

            <TouchableOpacity
              style={[styles.button, isLoading && styles.buttonDisabled]} // Estilo dinâmico para botão desabilitado
              onPress={handleAuth}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.buttonText}>
                  {isLogin ? 'Entrar' : 'Cadastrar'}
                </Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.switchButton}
              onPress={toggleAuthMode} // Usa a função de toggle
              disabled={isLoading} // Desabilita enquanto carrega
            >
              <Text style={styles.switchButtonText}>
                {isLogin
                  ? 'Ainda não tem uma conta? Cadastre-se'
                  : 'Já possui uma conta? Faça login'}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </ImageBackground>
    </KeyboardAvoidingView>
  );
}

// --- Estilos (com algumas melhorias) ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0', // Cor de fundo caso a imagem não carregue
  },
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  scrollContainer: {
    flexGrow: 1, // Permite que o conteúdo cresça para preencher o espaço
    justifyContent: 'center', // Centraliza o conteúdo verticalmente
    paddingBottom: 20, // Espaço extra no final
  },
  logoContainer: {
    alignItems: 'center',
    // Ajuste as margens conforme necessário para o seu logo
    marginTop: Platform.OS === 'ios' ? 80 : 60, // Mais espaço no iOS devido à status bar
    marginBottom: 20, // Reduzido para aproximar do form
  },
  logo: {
    width: 250, // Tamanho um pouco menor pode ser mais agradável
    height: 250,
    // Removido o título daqui para melhor contraste
  },
  // Removido o estilo 'title' que estava sobre a imagem
  formContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)', // Leve transparência para integrar com o fundo
    marginHorizontal: 20, // Margens laterais
    borderRadius: 20, // Bordas mais arredondadas
    paddingHorizontal: 25, // Mais padding interno
    paddingTop: 30,
    paddingBottom: 30, // Aumentar padding inferior
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4, // Sombra um pouco mais pronunciada
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  formTitle: {
    fontSize: 26, // Título maior
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8, // Menos espaço antes do subtítulo
    textAlign: 'center',
  },
  formSubtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 25, // Mais espaço antes dos inputs
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#f7f7f7', // Cor de fundo sutil para os inputs
    borderRadius: 12, // Bordas mais arredondadas
    paddingVertical: 14, // Ajuste de padding vertical
    paddingHorizontal: 18, // Ajuste de padding horizontal
    marginBottom: 18, // Mais espaço entre inputs
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd', // Borda mais suave
    color: '#333', // Cor do texto digitado
  },
  button: {
    backgroundColor: '#4a6bff', // Sua cor principal
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 15, // Espaço acima do botão
    shadowColor: '#4a6bff', // Sombra da cor do botão
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonDisabled: {
    backgroundColor: '#a9b8ff', // Cor mais clara quando desabilitado
    elevation: 0, // Remove sombra quando desabilitado
    shadowOpacity: 0,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  switchButton: {
    marginTop: 25, // Mais espaço acima do botão de troca
    padding: 10, // Área de toque maior
    alignItems: 'center',
  },
  switchButtonText: {
    color: '#4a6bff',
    fontSize: 15,
    fontWeight: '500', // Peso da fonte médio
  },
});
