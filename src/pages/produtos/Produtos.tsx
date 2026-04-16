import { useState } from 'react';
import type { FormEvent } from 'react';
import type { Produto } from '../../types/Produto';
import { useProdutos } from '../../hooks/useProdutos';
import Card from '../../../components/ui/Card';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import Table from '../../../components/ui/Table';

type ProdutoFormData = {
  nome: string;
  sku: string;
  categoria: string;
  quantidadeAtual: number;
  estoqueMinimo: number;
  valorUnitario: number;
  status: Produto['status'];
};

const initialFormData: ProdutoFormData = {
  nome: '',
  sku: '',
  categoria: '',
  quantidadeAtual: 0,
  estoqueMinimo: 0,
  valorUnitario: 0,
  status: 'ativo',
};

const Produtos = () => {
  const { produtos, addProduto, updateProduto, deleteProduto, isSkuDisponivel } = useProdutos();
  const [searchTerm, setSearchTerm] = useState('');
  const [editingProduto, setEditingProduto] = useState<Produto | null>(null);
  const [formData, setFormData] = useState<ProdutoFormData>(initialFormData);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const filteredProdutos = produtos.filter(
    (produto) =>
      produto.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      produto.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000);
  };

  const validateForm = () => {
    if (!formData.nome.trim()) return 'Nome é obrigatório';
    if (!formData.sku.trim()) return 'SKU é obrigatório';
    if (!formData.categoria.trim()) return 'Categoria é obrigatória';
    if (formData.quantidadeAtual < 0) return 'Quantidade atual deve ser maior ou igual a zero';
    if (formData.estoqueMinimo < 0) return 'Estoque mínimo deve ser maior ou igual a zero';
    if (formData.valorUnitario < 0) return 'Valor unitário deve ser maior ou igual a zero';

    if (!editingProduto && !isSkuDisponivel(formData.sku)) {
      return 'SKU já está em uso';
    }

    if (editingProduto && !isSkuDisponivel(formData.sku, editingProduto.id)) {
      return 'SKU já está em uso';
    }

    return null;
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
      if (editingProduto) {
        updateProduto(editingProduto.id, formData);
        showMessage('success', 'Produto atualizado com sucesso!');
        setEditingProduto(null);
      } else {
        addProduto(formData);
        showMessage('success', 'Produto cadastrado com sucesso!');
      }
      setFormData(initialFormData);
    } catch {
      showMessage('error', 'Erro ao salvar produto.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (produto: Produto) => {
    setEditingProduto(produto);
    setFormData({
      nome: produto.nome,
      sku: produto.sku,
      categoria: produto.categoria,
      quantidadeAtual: produto.quantidadeAtual,
      estoqueMinimo: produto.estoqueMinimo,
      valorUnitario: produto.valorUnitario,
      status: produto.status,
    });
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este produto?')) {
      deleteProduto(id);
      showMessage('success', 'Produto excluído com sucesso!');
    }
  };

  const handleCancel = () => {
    setEditingProduto(null);
    setFormData(initialFormData);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h2 className="text-2xl font-bold text-slate-800">Produtos</h2>
        <p className="text-slate-600">Gerencie o catálogo de produtos e controle de estoque</p>
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

      <Card>
        <h3 className="mb-5 text-xl font-semibold">{editingProduto ? 'Editar Produto' : 'Novo Produto'}</h3>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <Input
            label="Nome"
            value={formData.nome}
            onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
            required
          />
          <Input
            label="SKU"
            value={formData.sku}
            onChange={(e) => setFormData({ ...formData, sku: e.target.value.toUpperCase() })}
            required
          />
          <Input
            label="Categoria"
            value={formData.categoria}
            onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
            required
          />
          <Input
            label="Quantidade Atual"
            type="number"
            min="0"
            value={formData.quantidadeAtual}
            onChange={(e) => setFormData({ ...formData, quantidadeAtual: Number(e.target.value) || 0 })}
            required
          />
          <Input
            label="Estoque Mínimo"
            type="number"
            min="0"
            value={formData.estoqueMinimo}
            onChange={(e) => setFormData({ ...formData, estoqueMinimo: Number(e.target.value) || 0 })}
            required
          />
          <Input
            label="Valor Unitário (R$)"
            type="number"
            step="0.01"
            min="0"
            value={formData.valorUnitario}
            onChange={(e) => setFormData({ ...formData, valorUnitario: Number(e.target.value) || 0 })}
            required
          />
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
            <select
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as Produto['status'] })}
            >
              <option value="ativo">Ativo</option>
              <option value="inativo">Inativo</option>
            </select>
          </div>
          <div className="md:col-span-2 flex flex-wrap gap-2 pt-1">
            <Button type="submit" disabled={loading}>
              {loading ? 'Salvando...' : editingProduto ? 'Atualizar' : 'Cadastrar'}
            </Button>
            {editingProduto && (
              <Button type="button" variant="secondary" onClick={handleCancel}>
                Cancelar
              </Button>
            )}
          </div>
        </form>
      </Card>

      <div className="max-w-md">
        <Input
          placeholder="Buscar por nome ou SKU"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <Table
        headers={['Nome', 'SKU', 'Categoria', 'Qtd', 'Estoque Mín.', 'Status', 'Ações']}
      >
        {filteredProdutos.map((produto) => (
          <tr key={produto.id} className="border-t border-slate-200 hover:bg-slate-50 transition-colors">
            <td className="px-6 py-4 text-sm">{produto.nome}</td>
            <td className="px-6 py-4 text-sm">{produto.sku}</td>
            <td className="px-6 py-4 text-sm">{produto.categoria}</td>
            <td className="px-6 py-4 text-sm">{produto.quantidadeAtual}</td>
            <td className="px-6 py-4 text-sm">{produto.estoqueMinimo}</td>
            <td className="px-6 py-4 text-sm">{produto.status}</td>
            <td className="px-6 py-4 text-sm space-x-2">
              <Button variant="secondary" className="text-xs" onClick={() => handleEdit(produto)}>
                Editar
              </Button>
              <Button variant="danger" className="text-xs" onClick={() => handleDelete(produto.id)}>
                Excluir
              </Button>
            </td>
          </tr>
        ))}
        {filteredProdutos.length === 0 && (
          <tr>
            <td colSpan={7} className="px-6 py-12 text-center text-slate-500">
              Nenhum produto encontrado.
            </td>
          </tr>
        )}
      </Table>
    </div>
  );
};

export default Produtos;
