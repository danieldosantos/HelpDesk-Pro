import { useState } from 'react';
import type { FormEvent } from 'react';
import type { Produto } from '../types/Produto.ts';
import { useProdutos } from '../hooks/useProdutos.ts';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Table from '../../components/ui/Table';

const Produtos = () => {
  const { produtos, addProduto, updateProduto, deleteProduto, isSkuDisponivel } = useProdutos();
  const [searchTerm, setSearchTerm] = useState('');
  const [editingProduto, setEditingProduto] = useState<Produto | null>(null);
  const [formData, setFormData] = useState({
    nome: '',
    sku: '',
    categoria: '',
    quantidadeAtual: 0,
    estoqueMinimo: 0,
    valorUnitario: 0,
    status: 'ativo' as const,
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const filteredProdutos = produtos.filter(produto =>
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
      setFormData({
        nome: '',
        sku: '',
        categoria: '',
        quantidadeAtual: 0,
        estoqueMinimo: 0,
        valorUnitario: 0,
        status: 'ativo',
      });
    } catch (error) {
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
    setFormData({
      nome: '',
      sku: '',
      categoria: '',
      quantidadeAtual: 0,
      estoqueMinimo: 0,
      valorUnitario: 0,
      status: 'ativo',
    });
  };

  const getStatusBadge = (status: string) => {
    return status === 'ativo'
      ? <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">Ativo</span>
      : <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">Inativo</span>;
  };

  const getEstoqueStatus = (produto: Produto) => {
    if (produto.quantidadeAtual <= produto.estoqueMinimo) {
      return <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">Estoque Baixo</span>;
    }
    return <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">Estoque OK</span>;
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-slate-800 mb-2">Produtos</h2>
        <p className="text-slate-600">Gerencie o catálogo de produtos e controle de estoque</p>
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
              <h3 className="text-lg font-semibold text-slate-800">
                {editingProduto ? 'Editar Produto' : 'Novo Produto'}
              </h3>
            </Card.Header>
            <Card.Content>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  label="Nome"
                  value={formData.nome}
                  onChange={(value) => setFormData({ ...formData, nome: value })}
                  required
                />
                <Input
                  label="SKU"
                  value={formData.sku}
                  onChange={(value) => setFormData({ ...formData, sku: value.toUpperCase() })}
                  required
                  placeholder="Código único do produto"
                />
                <Input
                  label="Categoria"
                  value={formData.categoria}
                  onChange={(value) => setFormData({ ...formData, categoria: value })}
                  required
                />
                <Input
                  label="Quantidade Atual"
                  type="number"
                  value={formData.quantidadeAtual}
                  onChange={(value) => setFormData({ ...formData, quantidadeAtual: parseInt(value) || 0 })}
                  min="0"
                  required
                />
                <Input
                  label="Estoque Mínimo"
                  type="number"
                  value={formData.estoqueMinimo}
                  onChange={(value) => setFormData({ ...formData, estoqueMinimo: parseInt(value) || 0 })}
                  min="0"
                  required
                />
                <Input
                  label="Valor Unitário (R$)"
                  type="number"
                  step="0.01"
                  value={formData.valorUnitario}
                  onChange={(value) => setFormData({ ...formData, valorUnitario: parseFloat(value) || 0 })}
                  min="0"
                  required
                />
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as 'ativo' | 'inativo' })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="ativo">Ativo</option>
                    <option value="inativo">Inativo</option>
                  </select>
                </div>
                <div className="flex gap-2">
                  <Button type="submit" disabled={loading} className="flex-1">
                    {loading ? 'Salvando...' : editingProduto ? 'Atualizar' : 'Cadastrar'}
                  </Button>
                  {editingProduto && (
                    <Button type="button" variant="secondary" onClick={handleCancel}>
                      Cancelar
                    </Button>
                  )}
                </div>
              </form>
            </Card.Content>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Card>
            <Card.Header>
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-slate-800">Lista de Produtos</h3>
                <Input
                  placeholder="Buscar produtos..."
                  value={searchTerm}
                  onChange={setSearchTerm}
                  className="w-64"
                />
              </div>
            </Card.Header>
            <Card.Content>
              <Table>
                <Table.Header>
                  <Table.Row>
                    <Table.Head>Nome</Table.Head>
                    <Table.Head>SKU</Table.Head>
                    <Table.Head>Categoria</Table.Head>
                    <Table.Head>Estoque</Table.Head>
                    <Table.Head>Status</Table.Head>
                    <Table.Head>Ações</Table.Head>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {filteredProdutos.map((produto) => (
                    <Table.Row key={produto.id}>
                      <Table.Cell className="font-medium">{produto.nome}</Table.Cell>
                      <Table.Cell>{produto.sku}</Table.Cell>
                      <Table.Cell>{produto.categoria}</Table.Cell>
                      <Table.Cell>
                        <div className="flex flex-col gap-1">
                          <span>{produto.quantidadeAtual} unidades</span>
                          {getEstoqueStatus(produto)}
                        </div>
                      </Table.Cell>
                      <Table.Cell>{getStatusBadge(produto.status)}</Table.Cell>
                      <Table.Cell>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => handleEdit(produto)}
                          >
                            Editar
                          </Button>
                          <Button
                            size="sm"
                            variant="danger"
                            onClick={() => handleDelete(produto.id)}
                          >
                            Excluir
                          </Button>
                        </div>
                      </Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table>
              {filteredProdutos.length === 0 && (
                <div className="text-center py-8 text-slate-500">
                  Nenhum produto encontrado
                </div>
              )}
            </Card.Content>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Produtos;