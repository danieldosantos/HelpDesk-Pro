# HelpDesk Pro

Um sistema completo de gerenciamento de clientes e chamados técnicos, desenvolvido com tecnologias modernas para oferecer uma experiência profissional e responsiva.

## 📋 Sobre o Projeto

O HelpDesk Pro é uma aplicação web que permite gerenciar clientes e chamados técnicos de forma eficiente. Com interface intuitiva e funcionalidades completas de CRUD, o sistema oferece:

- **Cadastro e gerenciamento de clientes**
- **Abertura e acompanhamento de chamados**
- **Dashboard com métricas em tempo real**
- **Busca e filtros avançados**
- **Persistência local de dados**
- **Design responsivo e moderno**

## 🚀 Tecnologias Utilizadas

- **Frontend**: React 19 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Roteamento**: React Router DOM
- **Persistência**: LocalStorage (simulando backend)
- **Icons**: (pode adicionar se quiser)

## 📦 Como Executar

### Pré-requisitos
- Node.js (versão 18 ou superior)
- npm ou yarn

### Instalação

1. Clone o repositório:
```bash
git clone https://github.com/seu-usuario/helpdesk-pro.git
cd helpdesk-pro
```

2. Instale as dependências:
```bash
npm install
```

3. Execute o projeto em modo desenvolvimento:
```bash
npm run dev
```

4. Abra [http://localhost:5173](http://localhost:5173) no navegador

### Build para Produção

```bash
npm run build
```

Os arquivos otimizados serão gerados na pasta `dist/`.

## 🏗️ Estrutura do Projeto

```
src/
├── components/
│   ├── ui/           # Componentes reutilizáveis
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Input.tsx
│   │   └── Table.tsx
│   ├── Header.tsx
│   └── Sidebar.tsx
├── hooks/            # Hooks customizados
│   ├── useClientes.ts
│   └── useChamados.ts
├── layouts/
│   └── MainLayout.tsx
├── pages/            # Páginas da aplicação
│   ├── Dashboard.tsx
│   ├── Clientes.tsx
│   ├── Chamados.tsx
│   └── Login.tsx
├── types/            # Definições TypeScript
│   ├── Cliente.ts
│   └── Chamado.ts
└── main.tsx
```

## 🎯 Funcionalidades

### Dashboard
- Cards com métricas: Total clientes, chamados abertos, em andamento e concluídos
- Visão geral do sistema

### Clientes
- Cadastro completo de clientes (nome, telefone, email, empresa, cidade)
- Listagem com busca por nome
- Edição e exclusão de registros
- Validação de formulários

### Chamados
- Abertura de chamados com título, descrição, prioridade e cliente
- Relacionamento com clientes cadastrados
- Filtros por status (aberto, em andamento, concluído)
- Edição de status diretamente na listagem
- Exclusão com confirmação

### Autenticação
- Login fake (simulado)
- Proteção de rotas

## 📱 Responsividade

O sistema é totalmente responsivo e funciona perfeitamente em:
- Desktop
- Tablet
- Mobile

## 🎨 Design System

- **Cores**: Paleta moderna com tons de azul, cinza e branco
- **Tipografia**: Fontes sans-serif para melhor legibilidade
- **Componentes**: Reutilizáveis e consistentes
- **Feedback Visual**: Loading states, mensagens de sucesso/erro

## 🔧 Scripts Disponíveis

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Gera build de produção
- `npm run preview` - Visualiza o build de produção
- `npm run lint` - Executa o linter

## 🚀 Comandos Principais

### Rodar o Projeto em Desenvolvimento
```bash
npm run dev
```
Abre o servidor em `http://localhost:5173`

### Reiniciar o Servidor de Desenvolvimento
1. Pare o servidor (Ctrl+C no terminal)
2. Execute novamente:
```bash
npm run dev
```

### Rebuild do Projeto
Para limpar e refazer o build:
```bash
rm -rf dist/
npm run build
```

### Build para Produção
```bash
npm run build
```
Os arquivos ficam em `dist/`

### Preview do Build de Produção
```bash
npm run preview
```
Visualiza o build em `http://localhost:4173`

### Limpeza e Reinstalação
Se houver problemas com dependências:
```bash
rm -rf node_modules/
npm install
```

### Verificar Lint
```bash
npm run lint
```

## 📈 Próximas Melhorias

- [ ] Integração com backend real
- [ ] Autenticação completa
- [ ] Notificações push
- [ ] Relatórios avançados
- [ ] API REST
- [ ] Testes automatizados

## 🤝 Contribuição

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues e pull requests.

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👨‍💻 Autor

Desenvolvido por [Seu Nome] - [seu-email@exemplo.com]

---

⭐ Se este projeto foi útil para você, dê uma estrela no GitHub!
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
# HelpDesk-Pro
