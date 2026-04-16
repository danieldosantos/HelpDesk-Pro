import { useState } from 'react';
import type { FormEvent } from 'react';
import type { Cliente } from '../types/Cliente';
import { useClientes } from '../hooks/useClientes';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Table from '../components/ui/Table';

const Clientes = () => {
  const { clientes, addCliente, updateCliente, deleteCliente } = useClientes();
  const [searchTerm, setSearchTerm] = useState('');
  const [editingCliente, setEditingCliente] = useState<Cliente | null>(null);
  const [formData, setFormData] = useState({
    nome: '',
    telefone: '',
    email: '',
    empresa: '',
    cidade: '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const filteredClientes = clientes.filter(cliente =>
    cliente.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
      setFormData({
        nome: '',
        telefone: '',
        email: '',
        empresa: '',
        cidade: '',
      });
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
    setFormData({
      nome: '',
      telefone: '',
      email: '',
      empresa: '',
      cidade: '',
    });
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

      {/* Formulário */}
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
          <Input
            label="Empresa"
            type="text"
            value={formData.empresa}
            onChange={(e) => setFormData({ ...formData, empresa: e.target.value })}
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

      {/* Busca */}
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

      {/* Tabela */}
      <Table headers={['Nome', 'Empresa', 'Telefone', 'Cidade', 'Ações']}>
        {filteredClientes.map((cliente) => (
          <tr key={cliente.id} className="border-t border-slate-200 hover:bg-slate-50 transition-colors">
            <td className="px-6 py-4 text-sm text-slate-900">{cliente.nome}</td>
            <td className="px-6 py-4 text-sm text-slate-900">{cliente.empresa}</td>
            <td className="px-6 py-4 text-sm text-slate-900">{cliente.telefone}</td>
            <td className="px-6 py-4 text-sm text-slate-900">{cliente.cidade}</td>
            <td className="px-6 py-4 text-sm space-x-2">
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
            <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
              Nenhum cliente encontrado.
            </td>
          </tr>
        )}
      </Table>
    </div>
  );
};

export default Clientes;
