import { useState } from 'react';
import type { FormEvent } from 'react';
import type { Movimentacao } from '../types/Produto.ts';
import { useMovimentacoes } from '../hooks/useMovimentacoes.ts';
import { useProdutos } from '../hooks/useProdutos.ts';
import { EstoqueService } from '../services/EstoqueService.ts';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Table from '../../components/ui/Table';

const Movimentacoes = () => {
  const { movimentacoes, addMovimentacao, getMovimentacoesDoDia } = useMovimentacoes();
  const { produtos, updateEstoque } = useProdutos();
  const [formData, setFormData] = useState({
    produtoId: '',
    tipo: 'entrada' as Movimentacao['tipo'],
    quantidade: 0,
    motivo: '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const movimentacoesDoDia = getMovimentacoesDoDia();
  const produtosAtivos = produtos.filter(p => p.status === 'ativo');

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000);
  };

  const validateForm = () => {
    if (!formData.produtoId) return 'Selecione um produto';
    if (formData.quantidade <= 0) return 'Quantidade deve ser maior que zero';
    if (!formData.motivo.trim()) return 'Motivo é obrigatório';

    const produto = produtos.find(p => p.id === formData.produtoId);
    if (!produto) return 'Produto não encontrado';

    return EstoqueService.validarMovimentacao(produto, formData.tipo, formData.quantidade);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const error = validateForm();
    if (error) {
      showMessage('error', error);
      return;
    }

    setLoading(true);
    try {
      const produto = produtos.find(p => p.id === formData.produtoId)!;
      const resultado = EstoqueService.registrarMovimentacao(
        produto,
        formData.tipo,
        formData.quantidade,
        formData.motivo,
        addMovimentacao,
        updateEstoque
      );

      if (resultado.sucesso) {
        showMessage('success', resultado.mensagem);
        setFormData({
          produtoId: '',
          tipo: 'entrada',
          quantidade: 0,
          motivo: '',
        });
      } else {
        showMessage('error', resultado.mensagem);
      }
    } catch (error) {
      showMessage('error', 'Erro ao registrar movimentação.');
    } finally {
      setLoading(false);
    }
  };

  const getTipoBadge = (tipo: Movimentacao['tipo']) => {
    const styles = {
      entrada: 'bg-green-100 text-green-800',
      saida: 'bg-red-100 text-red-800',
      ajuste: 'bg-blue-100 text-blue-800',
    };
    const labels = {
      entrada: 'Entrada',
      saida: 'Saída',
      ajuste: 'Ajuste',
    };
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${styles[tipo]}`}>
        {labels[tipo]}
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-BR');
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-slate-800 mb-2">Movimentações de Estoque</h2>
        <p className="text-slate-600">Registre entradas, saídas e ajustes de estoque</p>
      </div>

      {message && (
        <div className={`mb-4 p-4 rounded-lg ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {message.text}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <Card>
            <Card.Header>
              <h3 className="text-lg font-semibold text-slate-800">Nova Movimentação</h3>
            </Card.Header>
            <Card.Content>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Produto</label>
                  <select
                    value={formData.produtoId}
                    onChange={(e) => setFormData({ ...formData, produtoId: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Selecione um produto</option>
                    {produtosAtivos.map(produto => (
                      <option key={produto.id} value={produto.id}>
                        {produto.nome} (SKU: {produto.sku}) - Estoque: {produto.quantidadeAtual}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Tipo de Movimentação</label>
                  <select
                    value={formData.tipo}
                    onChange={(e) => setFormData({ ...formData, tipo: e.target.value as Movimentacao['tipo'] })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="entrada">Entrada</option>
                    <option value="saida">Saída</option>
                    <option value="ajuste">Ajuste</option>
                  </select>
                </div>

                <Input
                  label="Quantidade"
                  type="number"
                  value={formData.quantidade}
                  onChange={(value) => setFormData({ ...formData, quantidade: parseInt(value) || 0 })}
                  min="1"
                  required
                />

                <Input
                  label="Motivo"
                  value={formData.motivo}
                  onChange={(value) => setFormData({ ...formData, motivo: value })}
                  required
                  placeholder="Descreva o motivo da movimentação"
                />

                <Button type="submit" disabled={loading} className="w-full">
                  {loading ? 'Registrando...' : 'Registrar Movimentação'}
                </Button>
              </form>
            </Card.Content>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Card>
            <Card.Header>
              <h3 className="text-lg font-semibold text-slate-800">
                Movimentações de Hoje ({movimentacoesDoDia.length})
              </h3>
            </Card.Header>
            <Card.Content>
              <Table>
                <Table.Header>
                  <Table.Row>
                    <Table.Head>Data/Hora</Table.Head>
                    <Table.Head>Produto</Table.Head>
                    <Table.Head>Tipo</Table.Head>
                    <Table.Head>Quantidade</Table.Head>
                    <Table.Head>Motivo</Table.Head>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {movimentacoesDoDia
                    .sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime())
                    .map((mov) => {
                      const produto = produtos.find(p => p.id === mov.produtoId);
                      return (
                        <Table.Row key={mov.id}>
                          <Table.Cell>{formatDate(mov.data)}</Table.Cell>
                          <Table.Cell className="font-medium">
                            {produto ? produto.nome : 'Produto não encontrado'}
                          </Table.Cell>
                          <Table.Cell>{getTipoBadge(mov.tipo)}</Table.Cell>
                          <Table.Cell>{mov.quantidade}</Table.Cell>
                          <Table.Cell className="max-w-xs truncate" title={mov.motivo}>
                            {mov.motivo}
                          </Table.Cell>
                        </Table.Row>
                      );
                    })}
                </Table.Body>
              </Table>
              {movimentacoesDoDia.length === 0 && (
                <div className="text-center py-8 text-slate-500">
                  Nenhuma movimentação registrada hoje
                </div>
              )}
            </Card.Content>
          </Card>

          <Card className="mt-6">
            <Card.Header>
              <h3 className="text-lg font-semibold text-slate-800">
                Histórico Completo ({movimentacoes.length})
              </h3>
            </Card.Header>
            <Card.Content>
              <Table>
                <Table.Header>
                  <Table.Row>
                    <Table.Head>Data/Hora</Table.Head>
                    <Table.Head>Produto</Table.Head>
                    <Table.Head>Tipo</Table.Head>
                    <Table.Head>Quantidade</Table.Head>
                    <Table.Head>Motivo</Table.Head>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {movimentacoes
                    .sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime())
                    .slice(0, 50) // Mostra apenas as últimas 50 movimentações
                    .map((mov) => {
                      const produto = produtos.find(p => p.id === mov.produtoId);
                      return (
                        <Table.Row key={mov.id}>
                          <Table.Cell>{formatDate(mov.data)}</Table.Cell>
                          <Table.Cell className="font-medium">
                            {produto ? produto.nome : 'Produto não encontrado'}
                          </Table.Cell>
                          <Table.Cell>{getTipoBadge(mov.tipo)}</Table.Cell>
                          <Table.Cell>{mov.quantidade}</Table.Cell>
                          <Table.Cell className="max-w-xs truncate" title={mov.motivo}>
                            {mov.motivo}
                          </Table.Cell>
                        </Table.Row>
                      );
                    })}
                </Table.Body>
              </Table>
              {movimentacoes.length === 0 && (
                <div className="text-center py-8 text-slate-500">
                  Nenhuma movimentação registrada
                </div>
              )}
            </Card.Content>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Movimentacoes;