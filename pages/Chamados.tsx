import { useState } from 'react';
import type { FormEvent } from 'react';
import { useChamados } from '../hooks/useChamados';
import { useClientes } from '../hooks/useClientes';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Table from '../components/ui/Table';

const Chamados = () => {
  const { chamados, addChamado, updateChamado, deleteChamado } = useChamados();
  const { clientes } = useClientes();
  const [filterStatus, setFilterStatus] = useState<string>('todos');
  const [formData, setFormData] = useState({
    titulo: '',
    descricao: '',
    clienteId: '',
    prioridade: 'media' as 'baixa' | 'media' | 'alta',
    status: 'aberto' as 'aberto' | 'andamento' | 'concluído',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const filteredChamados = chamados.filter(chamado => {
    if (filterStatus === 'todos') return true;
    return chamado.status === filterStatus;
  });

  const getClienteNome = (clienteId: string) => {
    const cliente = clientes.find(c => c.id === clienteId);
    return cliente ? cliente.nome : 'Cliente não encontrado';
  };

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    try {
      addChamado(formData);
      showMessage('success', 'Chamado aberto com sucesso!');
      setFormData({
        titulo: '',
        descricao: '',
        clienteId: '',
        prioridade: 'media',
        status: 'aberto',
      });
    } catch (error) {
      showMessage('error', 'Erro ao abrir chamado.');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = (id: string, newStatus: 'aberto' | 'andamento' | 'concluído') => {
    updateChamado(id, { status: newStatus });
    showMessage('success', 'Status atualizado com sucesso!');
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este chamado?')) {
      deleteChamado(id);
      showMessage('success', 'Chamado excluído com sucesso!');
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h2 className="text-2xl font-bold text-slate-800">Chamados</h2>
        <p className="text-slate-600">Gerencie os chamados técnicos</p>
      </div>

      {message && (
        <div className={`mb-4 p-4 rounded-lg ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {message.text}
        </div>
      )}

      {/* Formulário */}
      <Card>
        <h3 className="mb-5 text-xl font-semibold">Abrir Novo Chamado</h3>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <div className="md:col-span-2">
            <Input
              label="Título"
              type="text"
              value={formData.titulo}
              onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
              required
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-1">Descrição</label>
            <textarea
              value={formData.descricao}
              onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 focus:border-blue-500 focus:ring-blue-500"
              rows={3}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Cliente</label>
            <select
              value={formData.clienteId}
              onChange={(e) => setFormData({ ...formData, clienteId: e.target.value })}
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 focus:border-blue-500 focus:ring-blue-500"
              required
            >
              <option value="">Selecione um cliente</option>
              {clientes.map(cliente => (
                <option key={cliente.id} value={cliente.id}>
                  {cliente.nome} - {cliente.empresa}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Prioridade</label>
            <select
              value={formData.prioridade}
              onChange={(e) => setFormData({ ...formData, prioridade: e.target.value as 'baixa' | 'media' | 'alta' })}
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="baixa">Baixa</option>
              <option value="media">Média</option>
              <option value="alta">Alta</option>
            </select>
          </div>
          <div className="md:col-span-2 flex justify-center pt-1">
            <Button type="submit" disabled={loading}>
              {loading ? 'Abrindo...' : 'Abrir Chamado'}
            </Button>
          </div>
        </form>
      </Card>

      {/* Filtros */}
      <div className="flex flex-wrap gap-3">
        <Button
          variant={filterStatus === 'todos' ? 'primary' : 'secondary'}
          onClick={() => setFilterStatus('todos')}
        >
          Todos
        </Button>
        <Button
          variant={filterStatus === 'aberto' ? 'primary' : 'secondary'}
          onClick={() => setFilterStatus('aberto')}
        >
          Aberto
        </Button>
        <Button
          variant={filterStatus === 'andamento' ? 'primary' : 'secondary'}
          onClick={() => setFilterStatus('andamento')}
        >
          Em Andamento
        </Button>
        <Button
          variant={filterStatus === 'concluído' ? 'primary' : 'secondary'}
          onClick={() => setFilterStatus('concluído')}
        >
          Concluído
        </Button>
      </div>

      {/* Tabela */}
      <Table headers={['Título', 'Cliente', 'Prioridade', 'Status', 'Data', 'Ações']} className="shadow-lg">
        {filteredChamados.map((chamado) => (
          <tr key={chamado.id} className="border-t border-slate-200 hover:bg-slate-50 transition-colors">
            <td className="px-6 py-4 text-sm text-slate-900">{chamado.titulo}</td>
            <td className="px-6 py-4 text-sm text-slate-900">{getClienteNome(chamado.clienteId)}</td>
            <td className="px-6 py-4 text-sm text-slate-900 capitalize">{chamado.prioridade}</td>
            <td className="px-6 py-4 text-sm">
              <select
                value={chamado.status}
                onChange={(e) => handleStatusChange(chamado.id, e.target.value as 'aberto' | 'andamento' | 'concluído')}
                className="rounded-lg border border-slate-300 px-3 py-1 text-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="aberto">Aberto</option>
                <option value="andamento">Em Andamento</option>
                <option value="concluído">Concluído</option>
              </select>
            </td>
            <td className="px-6 py-4 text-sm text-slate-900">
              {new Date(chamado.data).toLocaleDateString('pt-BR')}
            </td>
            <td className="px-6 py-4 text-sm">
              <Button variant="danger" onClick={() => handleDelete(chamado.id)} className="text-xs">
                Excluir
              </Button>
            </td>
          </tr>
        ))}
        {filteredChamados.length === 0 && (
          <tr>
            <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
              Nenhum chamado encontrado.
            </td>
          </tr>
        )}
      </Table>
    </div>
  );
};

export default Chamados;
