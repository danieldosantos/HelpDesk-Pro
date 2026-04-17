import { useState, useEffect } from 'react';
import type { Chamado, ProdutoConsumido } from '../../types/Chamado.ts';
import { EstoqueService } from '../services/EstoqueService.ts';

const STORAGE_KEY = 'helpdesk-chamados';

export const useChamados = () => {
  const [chamados, setChamados] = useState<Chamado[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setChamados(JSON.parse(stored));
    }
  }, []);

  const saveToStorage = (newChamados: Chamado[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newChamados));
    setChamados(newChamados);
  };

  const addChamado = (chamado: Omit<Chamado, 'id' | 'data'>) => {
    const newChamado: Chamado = {
      ...chamado,
      id: Date.now().toString(),
      data: new Date().toISOString(),
    };
    const newChamados = [...chamados, newChamado];
    saveToStorage(newChamados);
  };

  const updateChamado = (id: string, updatedChamado: Partial<Chamado>) => {
    const newChamados = chamados.map(chamado =>
      chamado.id === id ? { ...chamado, ...updatedChamado } : chamado
    );
    saveToStorage(newChamados);
  };

  const deleteChamado = (id: string) => {
    const newChamados = chamados.filter(chamado => chamado.id !== id);
    saveToStorage(newChamados);
  };

  const consumirProduto = (
    chamadoId: string,
    produtoId: string,
    quantidade: number,
    produtos: any[],
    addMovimentacao: (mov: any) => void,
    updateEstoque: (id: string, quantidade: number) => void
  ): { sucesso: boolean; mensagem: string } => {
    const chamado = chamados.find(c => c.id === chamadoId);
    if (!chamado) {
      return { sucesso: false, mensagem: 'Chamado não encontrado' };
    }

    const produto = produtos.find(p => p.id === produtoId);
    if (!produto) {
      return { sucesso: false, mensagem: 'Produto não encontrado' };
    }

    // Registrar consumo no estoque
    const resultado = EstoqueService.consumirProdutoChamado(
      produto,
      quantidade,
      chamadoId,
      addMovimentacao,
      updateEstoque
    );

    if (resultado.sucesso) {
      // Registrar consumo no chamado
      const produtoConsumido: ProdutoConsumido = {
        produtoId,
        quantidade,
        dataConsumo: new Date().toISOString(),
      };

      const produtosConsumidos = chamado.produtosConsumidos || [];
      updateChamado(chamadoId, {
        produtosConsumidos: [...produtosConsumidos, produtoConsumido],
      });
    }

    return resultado;
  };

  const getProdutosConsumidosPorChamado = (chamadoId: string) => {
    const chamado = chamados.find(c => c.id === chamadoId);
    return chamado?.produtosConsumidos || [];
  };

  return {
    chamados,
    addChamado,
    updateChamado,
    deleteChamado,
    consumirProduto,
    getProdutosConsumidosPorChamado,
  };
};