# Guia para Criar uma Nova Página no Projeto HelpDesk Pro

Este guia didático explica passo a passo como adicionar uma nova página ao projeto HelpDesk Pro (um sistema de helpdesk em React/TypeScript com Vite). Use-o sempre que precisar criar uma página nova, como uma aba de cadastro de funcionários, produtos ou qualquer funcionalidade adicional.

## Pré-requisitos
- Conhecimento básico de React, TypeScript e Vite.
- O projeto já configurado e rodando (`npm install` e `npm run dev`).
- Familiaridade com a estrutura do projeto (tipos, hooks, páginas, etc.).

## Estrutura Geral do Projeto
Antes de começar, entenda a organização:
- **`types/`**: Interfaces TypeScript (ex.: `Funcionario.ts`).
- **`hooks/`**: Lógica de estado (ex.: `useFuncionarios.ts`).
- **`pages/`**: Páginas principais (ex.: `Funcionarios.tsx`).
- **`services/`**: Chamadas de API (ex.: `FuncionarioService.ts`).
- **`components/`**: Componentes reutilizáveis (ex.: `Sidebar.tsx` para navegação).
- **`routes/`**: Configuração de rotas (ex.: `index.ts` para registrar páginas).

## Passos para Criar uma Nova Página

### 1. Defina os Dados (Tipo)
Crie uma interface TypeScript para representar os dados da página.

**Arquivo a criar:** `types/NomeDaEntidade.ts` (ex.: `types/Funcionario.ts`)

**Exemplo:**
```typescript
export interface Funcionario {
  id: number;
  nome: string;
  cargo: string;
  email: string;
  telefone?: string; // Campo opcional
  dataAdmissao: Date;
}
```
- **Dica:** Copie o padrão de `types/Cliente.ts` ou `types/Chamado.ts`. Use campos obrigatórios e opcionais conforme necessário.

### 2. Crie um Hook para Gerenciar Estado
Crie um hook customizado para buscar, criar ou editar dados.

**Arquivo a criar:** `hooks/useNomeDaEntidade.ts` (ex.: `hooks/useFuncionarios.ts`)

**Exemplo:**
```typescript
import { useState, useEffect } from 'react';
import { Funcionario } from '../types/Funcionario';

export const useFuncionarios = () => {
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    // Substitua por chamada real de API: fetch('/api/funcionarios').then(data => setFuncionarios(data));
    setFuncionarios([]); // Dados mockados para teste
    setLoading(false);
  }, []);

  const adicionarFuncionario = (novo: Funcionario) => {
    setFuncionarios([...funcionarios, novo]);
  };

  return { funcionarios, loading, adicionarFuncionario };
};
```
- **Dica:** Baseie-se em `hooks/useClientes.ts`. Adicione funções como `buscar`, `criar`, `editar` e `deletar`.

### 3. Crie a Página (Componente React)
Crie a página com formulário e lista de dados.

**Arquivo a criar:** `pages/NomeDaEntidade.tsx` (ex.: `pages/Funcionarios.tsx`)

**Exemplo:**
```typescript
import React, { useState } from 'react';
import { useFuncionarios } from '../hooks/useFuncionarios';
import { Funcionario } from '../types/Funcionario';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Table from '../components/ui/Table';

const Funcionarios: React.FC = () => {
  const { funcionarios, adicionarFuncionario } = useFuncionarios();
  const [form, setForm] = useState<Omit<Funcionario, 'id'>>({
    nome: '',
    cargo: '',
    email: '',
    telefone: '',
    dataAdmissao: new Date(),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    adicionarFuncionario({ ...form, id: Date.now() }); // ID mockado
    setForm({ nome: '', cargo: '', email: '', telefone: '', dataAdmissao: new Date() });
  };

  return (
    <div>
      <h1>Cadastro de Funcionários</h1>
      <form onSubmit={handleSubmit}>
        <Input value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} placeholder="Nome" />
        <Input value={form.cargo} onChange={(e) => setForm({ ...form, cargo: e.target.value })} placeholder="Cargo" />
        <Input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="Email" />
        <Button type="submit">Cadastrar</Button>
      </form>
      <Table data={funcionarios} columns={['nome', 'cargo', 'email']} />
    </div>
  );
};

export default Funcionarios;
```
- **Dica:** Copie de `pages/Clientes.tsx`. Use componentes de UI (`Button`, `Input`, `Table`) para consistência. Adicione validação de formulário se necessário.

### 4. (Opcional) Crie um Serviço para API
Se houver backend, crie um serviço para chamadas de API.

**Arquivo a criar:** `services/NomeDaEntidadeService.ts` (ex.: `services/FuncionarioService.ts`)

**Exemplo:**
```typescript
import { Funcionario } from '../types/Funcionario';

export const FuncionarioService = {
  async listar(): Promise<Funcionario[]> {
    return fetch('/api/funcionarios').then(res => res.json());
  },
  async criar(funcionario: Omit<Funcionario, 'id'>): Promise<Funcionario> {
    return fetch('/api/funcionarios', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(funcionario),
    }).then(res => res.json());
  },
};
```
- **Dica:** Integre no hook (ex.: chame `FuncionarioService.listar()` no `useEffect`).

### 5. Adicione à Navegação (Sidebar)
Edite o sidebar para incluir um link para a nova página.

**Arquivo a editar:** `components/Sidebar.tsx`

**Exemplo de edição:**
```typescript
// Dentro do componente Sidebar, adicione ao array de menuItems:
const menuItems = [
  // ... itens existentes como { label: 'Chamados', path: '/chamados' }
  { label: 'Funcionários', path: '/funcionarios' },
];
```
- **Dica:** Procure o array de links e adicione o novo item. Teste clicando no link.

### 6. Configure as Rotas
Registre a nova página no roteamento.

**Arquivo a editar/criar:** `routes/index.ts` (ou similar)

**Exemplo de edição:**
```typescript
import Funcionarios from '../pages/Funcionarios';

const routes = [
  // ... rotas existentes
  { path: '/funcionarios', component: Funcionarios },
];
```
- **Dica:** Se não existir, crie baseado em como outras páginas são importadas. Certifique-se de que o roteador (ex.: React Router) está configurado em `App.tsx`.

## Teste e Validação
1. Rode o projeto: `npm run dev`.
2. Navegue para a nova rota (ex.: `http://localhost:3000/funcionarios`).
3. Teste o formulário e lista.
4. Verifique erros no console (TypeScript, React).
5. Se houver backend, teste as APIs.

## Dicas Gerais
- **Consistência:** Sempre siga o padrão das páginas existentes (ex.: use os mesmos componentes de UI).
- **Mock vs. Real:** Comece com dados mockados no hook, depois integre APIs.
- **Validação:** Adicione validação de formulário (ex.: com bibliotecas como Formik ou React Hook Form).
- **Estilo:** Use CSS de `App.css` ou Tailwind se configurado.
- **Versionamento:** Commit suas mudanças no Git após testar.
- **Problemas?** Se der erro, verifique imports e tipos.

Seguindo esses passos, você criará páginas consistentes e funcionais. Boa sorte!