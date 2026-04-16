import { useState, useEffect } from 'react';
import type { Cliente } from '../types/Cliente.ts';

const STORAGE_KEY = 'helpdesk-clientes';

const normalizeCliente = (cliente: Partial<Cliente>): Cliente => ({
  id: cliente.id ?? Date.now().toString(),
  nome: cliente.nome ?? '',
  telefone: cliente.telefone ?? '',
  email: cliente.email ?? '',
  empresa: cliente.empresa ?? '',
  documento: cliente.documento ?? '',
  tipoCliente: cliente.tipoCliente === 'PF' ? 'PF' : 'PJ',
  cidade: cliente.cidade ?? '',
});

export const useClientes = () => {
  const [clientes, setClientes] = useState<Cliente[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored) as Partial<Cliente>[];
      setClientes(parsed.map(normalizeCliente));
    }
  }, []);

  const saveToStorage = (newClientes: Cliente[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newClientes));
    setClientes(newClientes);
  };

  const addCliente = (cliente: Omit<Cliente, 'id'>) => {
    const newCliente: Cliente = {
      ...cliente,
      id: Date.now().toString(),
    };
    const newClientes = [...clientes, newCliente];
    saveToStorage(newClientes);
  };

  const updateCliente = (id: string, updatedCliente: Omit<Cliente, 'id'>) => {
    const newClientes = clientes.map(cliente =>
      cliente.id === id ? { ...updatedCliente, id } : cliente
    );
    saveToStorage(newClientes);
  };

  const deleteCliente = (id: string) => {
    const newClientes = clientes.filter(cliente => cliente.id !== id);
    saveToStorage(newClientes);
  };

  return {
    clientes,
    addCliente,
    updateCliente,
    deleteCliente,
  };
};
