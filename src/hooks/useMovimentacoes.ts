import { useState, useEffect } from 'react';
import type { Movimentacao } from '../../types/Produto.ts';

const STORAGE_KEY = 'helpdesk-movimentacoes';

export const useMovimentacoes = () => {
  const [movimentacoes, setMovimentacoes] = useState<Movimentacao[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setMovimentacoes(JSON.parse(stored));
    }
  }, []);

  const saveToStorage = (newMovimentacoes: Movimentacao[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newMovimentacoes));
    setMovimentacoes(newMovimentacoes);
  };

  const addMovimentacao = (movimentacao: Omit<Movimentacao, 'id' | 'data'>) => {
    const newMovimentacao: Movimentacao = {
      ...movimentacao,
      id: Date.now().toString(),
      data: new Date().toISOString(),
    };
    const newMovimentacoes = [...movimentacoes, newMovimentacao];
    saveToStorage(newMovimentacoes);
  };

  const getMovimentacoesDoDia = () => {
    const hoje = new Date().toDateString();
    return movimentacoes.filter(mov =>
      new Date(mov.data).toDateString() === hoje
    );
  };

  const getMovimentacoesPorProduto = (produtoId: string) => {
    return movimentacoes.filter(mov => mov.produtoId === produtoId);
  };

  return {
    movimentacoes,
    addMovimentacao,
    getMovimentacoesDoDia,
    getMovimentacoesPorProduto,
  };
};