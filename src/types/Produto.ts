export interface Produto {
  id: string;
  nome: string;
  sku: string;
  categoria: string;
  quantidadeAtual: number;
  estoqueMinimo: number;
  valorUnitario: number;
  status: 'ativo' | 'inativo';
  dataCriacao: string;
  dataAtualizacao: string;
}

export interface Movimentacao {
  id: string;
  produtoId: string;
  tipo: 'entrada' | 'saida' | 'ajuste';
  quantidade: number;
  motivo: string;
  data: string;
  usuario?: string;
}