import { useState } from 'react';
import type { FormEvent } from 'react';
import type { Movimentacao } from '../../types/Produto';
import { useMovimentacoes } from '../../hooks/useMovimentacoes';
import { useProdutos } from '../../hooks/useProdutos';
import { EstoqueService } from '../../services/EstoqueService';
import Card from '../../../components/ui/Card';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import Table from '../../../components/ui/Table';

type MovimentacaoFormData = {
  produtoId: string;
  tipo: Movimentacao['tipo'];
  quantidade: number;
  motivo: string;
};

const initialFormData: MovimentacaoFormData = {
  produtoId: '',
  tipo: 'entrada',
  quantidade: 0,
  motivo: '',
};

const Movimentacoes = () => {
  const { movimentacoes, addMovimentacao, getMovimentacoesDoDia } = useMovimentacoes();
  const { produtos, updateEstoque } = useProdutos();
  const [formData, setFormData] = useState<MovimentacaoFormData>(initialFormData);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const movimentacoesDoDia = getMovimentacoesDoDia();
  const produtosAtivos = produtos.filter((produto) => produto.status === 'ativo');

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000);
  };

  const validateForm = () => {
    if (!formData.produtoId) return 'Selecione um produto';
    if (formData.quantidade <= 0) return 'Quantidade deve ser maior que zero';
    if (!formData.motivo.trim()) return 'Motivo é obrigatório';

    const produto = produtos.find((p) => p.id === formData.produtoId);
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
      const produto = produtos.find((p) => p.id === formData.produtoId);
      if (!produto) {
        showMessage('error', 'Produto não encontrado.');
        return;
      }

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
        setFormData(initialFormData);
      } else {
        showMessage('error', resultado.mensagem);
      }
    } catch {
      showMessage('error', 'Erro ao registrar movimentação.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => new Date(dateString).toLocaleString('pt-BR');

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-slate-800 mb-2">Movimentações de Estoque</h2>
        <p className="text-slate-600">Registre entradas, saídas e ajustes de estoque</p>
      </div>

      {message && (
        <div
          className={`mb-4 p-4 rounded-lg ${
            message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}
        >
          {message.text}
        </div>
      )}

      <Card className="shadow-lg">
        <h3 className="text-xl font-semibold mb-6">Nova Movimentação</h3>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Produto</label>
            <select
              className="w-full rounded-lg border border-slate-300 px-3 py-2"
              value={formData.produtoId}
              onChange={(e) => setFormData({ ...formData, produtoId: e.target.value })}
              required
            >
              <option value="">Selecione um produto</option>
              {produtosAtivos.map((produto) => (
                <option key={produto.id} value={produto.id}>
                  {produto.nome} (SKU: {produto.sku}) - Estoque: {produto.quantidadeAtual}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Tipo de Movimentação</label>
            <select
              className="w-full rounded-lg border border-slate-300 px-3 py-2"
              value={formData.tipo}
              onChange={(e) => setFormData({ ...formData, tipo: e.target.value as Movimentacao['tipo'] })}
            >
              <option value="entrada">Entrada</option>
              <option value="saida">Saída</option>
              <option value="ajuste">Ajuste</option>
            </select>
          </div>

          <Input
            label="Quantidade"
            type="number"
            min="1"
            value={formData.quantidade}
            onChange={(e) => setFormData({ ...formData, quantidade: Number(e.target.value) || 0 })}
            required
          />

          <Input
            label="Motivo"
            value={formData.motivo}
            onChange={(e) => setFormData({ ...formData, motivo: e.target.value })}
            required
          />

          <div className="md:col-span-2">
            <Button type="submit" disabled={loading}>
              {loading ? 'Registrando...' : 'Registrar Movimentação'}
            </Button>
          </div>
        </form>
      </Card>

      <Table headers={['Data/Hora', 'Produto', 'Tipo', 'Quantidade', 'Motivo']} className="shadow-lg">
        {movimentacoesDoDia
          .sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime())
          .map((movimentacao) => {
            const produto = produtos.find((p) => p.id === movimentacao.produtoId);
            return (
              <tr key={movimentacao.id} className="border-t border-slate-200 hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 text-sm">{formatDate(movimentacao.data)}</td>
                <td className="px-6 py-4 text-sm">{produto ? produto.nome : 'Produto não encontrado'}</td>
                <td className="px-6 py-4 text-sm">{movimentacao.tipo}</td>
                <td className="px-6 py-4 text-sm">{movimentacao.quantidade}</td>
                <td className="px-6 py-4 text-sm">{movimentacao.motivo}</td>
              </tr>
            );
          })}
        {movimentacoesDoDia.length === 0 && (
          <tr>
            <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
              Nenhuma movimentação registrada hoje.
            </td>
          </tr>
        )}
      </Table>

      {movimentacoes.length > 0 && (
        <div className="text-sm text-slate-500">Total histórico de movimentações: {movimentacoes.length}</div>
      )}
    </div>
  );
};

export default Movimentacoes;
