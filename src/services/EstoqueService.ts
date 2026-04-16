import type { Produto, Movimentacao } from '../types/Produto.ts';

export class EstoqueService {
  static validarMovimentacao(produto: Produto, tipo: Movimentacao['tipo'], quantidade: number): string | null {
    if (produto.status !== 'ativo') {
      return 'Produto inativo não pode receber movimentação';
    }

    if (quantidade <= 0) {
      return 'Quantidade deve ser maior que zero';
    }

    if (tipo === 'saida' && quantidade > produto.quantidadeAtual) {
      return 'Quantidade insuficiente em estoque';
    }

    return null;
  }

  static calcularNovaQuantidade(produto: Produto, tipo: Movimentacao['tipo'], quantidade: number): number {
    switch (tipo) {
      case 'entrada':
        return produto.quantidadeAtual + quantidade;
      case 'saida':
        return produto.quantidadeAtual - quantidade;
      case 'ajuste':
        return quantidade;
      default:
        return produto.quantidadeAtual;
    }
  }

  static registrarMovimentacao(
    produto: Produto,
    tipo: Movimentacao['tipo'],
    quantidade: number,
    motivo: string,
    addMovimentacao: (mov: Omit<Movimentacao, 'id' | 'data'>) => void,
    updateEstoque: (id: string, quantidade: number) => void
  ): { sucesso: boolean; mensagem: string } {
    const erro = this.validarMovimentacao(produto, tipo, quantidade);
    if (erro) {
      return { sucesso: false, mensagem: erro };
    }

    const novaQuantidade = this.calcularNovaQuantidade(produto, tipo, quantidade);

    // Registrar movimentação
    addMovimentacao({
      produtoId: produto.id,
      tipo,
      quantidade,
      motivo,
    });

    // Atualizar estoque
    updateEstoque(produto.id, novaQuantidade);

    return { sucesso: true, mensagem: 'Movimentação registrada com sucesso' };
  }

  static consumirProdutoChamado(
    produto: Produto,
    quantidade: number,
    chamadoId: string,
    addMovimentacao: (mov: Omit<Movimentacao, 'id' | 'data'>) => void,
    updateEstoque: (id: string, quantidade: number) => void
  ): { sucesso: boolean; mensagem: string } {
    return this.registrarMovimentacao(
      produto,
      'saida',
      quantidade,
      `Consumo em chamado #${chamadoId}`,
      addMovimentacao,
      updateEstoque
    );
  }
}