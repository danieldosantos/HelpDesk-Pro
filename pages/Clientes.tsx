import { useState } from 'react';
import type { FormEvent } from 'react';
import type { Cliente } from '../types/Cliente';
import { useClientes } from '../hooks/useClientes';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Table from '../components/ui/Table';

const initialFormData: Omit<Cliente, 'id'> = {
  nome: '',
  telefone: '',
  email: '',
  empresa: '',
  documento: '',
  tipoCliente: 'PJ' as const,
  cidade: '',
};

const Clientes = () => {
  const { clientes, addCliente, updateCliente, deleteCliente } = useClientes();
  const [searchTerm, setSearchTerm] = useState('');
  const [editingCliente, setEditingCliente] = useState<Cliente | null>(null);
  const [formData, setFormData] = useState(initialFormData);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const filteredClientes = clientes.filter(cliente =>
    cliente.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const documentoLabel = formData.tipoCliente === 'PF' ? 'CPF' : 'CNPJ';
  const documentoPlaceholder = formData.tipoCliente === 'PF' ? 'Digite o CPF' : 'Digite o CNPJ';

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    try {
      if (editingCliente) {
        updateCliente(editingCliente.id, formData);
        showMessage('success', 'Cliente atualizado com sucesso!');
        setEditingCliente(null);
      } else {
        addCliente(formData);
        showMessage('success', 'Cliente cadastrado com sucesso!');
      }
      setFormData(initialFormData);
    } catch (error) {
      showMessage('error', 'Erro ao salvar cliente.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (cliente: Cliente) => {
    setEditingCliente(cliente);
    setFormData({
      nome: cliente.nome,
      telefone: cliente.telefone,
      email: cliente.email,
      empresa: cliente.empresa,
      documento: cliente.documento,
      tipoCliente: cliente.tipoCliente,
      cidade: cliente.cidade,
    });
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este cliente?')) {
      deleteCliente(id);
      showMessage('success', 'Cliente excluído com sucesso!');
    }
  };

  const handleCancel = () => {
    setEditingCliente(null);
    setFormData(initialFormData);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h2 className="text-2xl font-bold text-slate-800">Clientes</h2>
        <p className="text-slate-600">Gerencie os clientes do sistema</p>
      </div>

      {message && (
        <div className={`mb-4 p-4 rounded-lg ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {message.text}
        </div>
      )}

      <Card>
        <h3 className="mb-5 text-xl font-semibold">
          {editingCliente ? 'Editar Cliente' : 'Cadastrar Novo Cliente'}
        </h3>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <Input
            label="Nome"
            type="text"
            value={formData.nome}
            onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
            required
          />
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">Tipo de cliente</label>
            <select
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 focus:border-blue-500 focus:ring-blue-500"
              value={formData.tipoCliente}
              onChange={(e) => setFormData({ ...formData, tipoCliente: e.target.value as 'PF' | 'PJ' })}
              required
            >
              <option value="PJ">Pessoa Jurídica (PJ)</option>
              <option value="PF">Pessoa Física (PF)</option>
            </select>
          </div>
          <Input
            label="Empresa"
            type="text"
            value={formData.empresa}
            onChange={(e) => setFormData({ ...formData, empresa: e.target.value })}
            required
          />
          <Input
            label={documentoLabel}
            type="text"
            placeholder={documentoPlaceholder}
            value={formData.documento}
            onChange={(e) => setFormData({ ...formData, documento: e.target.value })}
            required
          />
          <Input
            label="Telefone"
            type="tel"
            value={formData.telefone}
            onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
            required
          />
          <Input
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
          <div className="md:col-span-2">
            <Input
              label="Cidade"
              type="text"
              value={formData.cidade}
              onChange={(e) => setFormData({ ...formData, cidade: e.target.value })}
              required
            />
          </div>
          <div className="md:col-span-2 flex flex-wrap gap-2 pt-1">
            <Button type="submit" disabled={loading}>
              {loading ? 'Salvando...' : editingCliente ? 'Atualizar' : 'Salvar'}
            </Button>
            {editingCliente && (
              <Button type="button" variant="secondary" onClick={handleCancel}>
                Cancelar
              </Button>
            )}
          </div>
        </form>
      </Card>

      <div className="flex items-center">
        <div className="flex-1 max-w-md">
          <Input
            type="text"
            placeholder="Buscar por nome..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <Table headers={['Nome', 'Tipo', 'Empresa', 'CPF/CNPJ', 'Telefone', 'Email', 'Cidade', 'Ações']}>
        {filteredClientes.map((cliente) => (
          <tr key={cliente.id} className="border-t border-slate-200 hover:bg-slate-50 transition-colors">
            <td className="px-6 py-4 text-sm text-slate-900">{cliente.nome}</td>
            <td className="px-6 py-4 text-sm text-slate-900">{cliente.tipoCliente}</td>
            <td className="px-6 py-4 text-sm text-slate-900">{cliente.empresa}</td>
            <td className="px-6 py-4 text-sm text-slate-900">{cliente.documento}</td>
            <td className="px-6 py-4 text-sm text-slate-900">{cliente.telefone}</td>
            <td className="px-6 py-4 text-sm text-slate-900">{cliente.email}</td>
            <td className="px-6 py-4 text-sm text-slate-900">{cliente.cidade}</td>
            <td className="px-6 py-4 text-sm space-x-2 whitespace-nowrap">
              <Button variant="secondary" onClick={() => handleEdit(cliente)} className="text-xs">
                Editar
              </Button>
              <Button variant="danger" onClick={() => handleDelete(cliente.id)} className="text-xs">
                Excluir
              </Button>
            </td>
          </tr>
        ))}
        {filteredClientes.length === 0 && (
          <tr>
            <td colSpan={8} className="px-6 py-12 text-center text-slate-500">
              Nenhum cliente encontrado.
            </td>
          </tr>
        )}
      </Table>
    </div>
  );
};

export default Clientes;
