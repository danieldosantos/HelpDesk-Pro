export interface ProdutoConsumido {
  produtoId: string;
  quantidade: number;
  dataConsumo: string;
}

export interface Chamado {
  id: string;
  titulo: string;
  descricao: string;
  clienteId: string;
  prioridade: 'baixa' | 'media' | 'alta';
  status: 'aberto' | 'andamento' | 'concluído';
  data: string;
  produtosConsumidos?: ProdutoConsumido[];
}