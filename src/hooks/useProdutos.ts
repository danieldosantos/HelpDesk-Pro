import { useState, useEffect } from 'react';
import type { Produto } from '../../types/Produto.ts';

const STORAGE_KEY = 'helpdesk-produtos';

export const useProdutos = () => {
  const [produtos, setProdutos] = useState<Produto[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setProdutos(JSON.parse(stored));
    }
  }, []);

  const saveToStorage = (newProdutos: Produto[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newProdutos));
    setProdutos(newProdutos);
  };

  const addProduto = (produto: Omit<Produto, 'id' | 'dataCriacao' | 'dataAtualizacao'>) => {
    const newProduto: Produto = {
      ...produto,
      id: Date.now().toString(),
      dataCriacao: new Date().toISOString(),
      dataAtualizacao: new Date().toISOString(),
    };
    const newProdutos = [...produtos, newProduto];
    saveToStorage(newProdutos);
  };

  const updateProduto = (id: string, updatedProduto: Partial<Produto>) => {
    const newProdutos = produtos.map(produto =>
      produto.id === id ? {
        ...produto,
        ...updatedProduto,
        dataAtualizacao: new Date().toISOString()
      } : produto
    );
    saveToStorage(newProdutos);
  };

  const deleteProduto = (id: string) => {
    const newProdutos = produtos.filter(produto => produto.id !== id);
    saveToStorage(newProdutos);
  };

  const updateEstoque = (id: string, quantidade: number) => {
    updateProduto(id, {
      quantidadeAtual: quantidade,
      dataAtualizacao: new Date().toISOString()
    });
  };

  const getProdutosEstoqueBaixo = () => {
    return produtos.filter(produto =>
      produto.status === 'ativo' && produto.quantidadeAtual <= produto.estoqueMinimo
    );
  };

  const isSkuDisponivel = (sku: string, excludeId?: string) => {
    return !produtos.some(produto =>
      produto.sku === sku && produto.id !== excludeId
    );
  };

  return {
    produtos,
    addProduto,
    updateProduto,
    deleteProduto,
    updateEstoque,
    getProdutosEstoqueBaixo,
    isSkuDisponivel,
  };
};