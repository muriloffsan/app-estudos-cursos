<p align="center">
  <img src="https://img.shields.io/badge/React%20Native-app--estudos--cursos-61DBFB?style=for-the-badge&logo=react" alt="React Native" />
</p>

# 📚 app‑estudos‑cursos

Aplicativo móvel desenvolvido com React Native, voltado à gestão de estudos e cursos. Permite organizar atividades, acompanhar progresso e acessar material de forma intuitiva.

---

## 🔍 Índice

- [Funcionalidades](#funcionalidades)  
- [🛠️ Tecnologias](#tecnologias)  
- [🎯 Instalação](#instalação)  
- [🚀 Como usar](#🚀-como-usar)  
- [📁 Estrutura de Pastas](#📁-estrutura-de-pastas)  

---

## Funcionalidades

- Criar, editar e excluir cursos e módulos  
- Acompanhar progresso de estudo  
- Layout responsivo para smartphones e tablets (Android e iOS)  
- Integração com banco de dados (ex.: SQLite / Supabase / Realm)  
- Notificações ou lembretes configuráveis (se aplicável)

---

## 🛠️ Tecnologias

- **React Native** – Construção da UI  
- **Expo** (opcional) – Para simplificar o desenvolvimento e testes  
- **Redux / Context API** – Gerenciamento de estado  
- **React Navigation** – Navegação entre telas  
- **Banco de dados local ou remoto** – Para persistência de dados  
- **Styled Components / Tailwind RN** – Estilização de componentes

---

## 🎯 Instalação

1. Clone o repositório:

   ```bash
   git clone https://github.com/muriloffsan/app-estudos-cursos.git

2. Entre no diretório do projeto e instale as dependências:

    ```bash
    cd app-estudos-cursos
    npm install
    # ou
    yarn install
    ```

3. Execute o app:

    Com Expo:
      ```bash
      expo start
      ```
    Com React Native CLI:
      ```bash
      npx react-native run-android
      npx react-native run-ios
      ```

---

## 🚀 Como usar
Abra o app no celular ou emulador.

Na tela inicial, crie um novo curso preenchendo os campos: título, descrição, data de início/final.

Dentro do curso, adicione módulos ou tarefas com data-alvo de conclusão.

Marque tarefas como concluídas para acompanhar seu progresso.

Use a seção “Meus Cursos” para navegar entre os estudos em andamento.

📌 Dica: Inclua comandos no README para limpar banco de dados, rodar testes e gerar builds.

---

## 📁 Estrutura de Pastas
```bash
app-estudos-cursos/
├── src/
│   ├── components/       # Componentes reaproveitáveis (buttons, cards, inputs)
│   ├── screens/          # Telas principais (Home, Curso, Módulo)
│   ├── navigation/       # Configuração de rotas
│   ├── store/            # Redux, Context API ou MobX
│   ├── services/         # Conexão com APIs ou banco local
│   ├── assets/           # Ícones, imagens, fontes
├── App.js                # Ponto de entrada do app
├── package.json
└── README.md
```
