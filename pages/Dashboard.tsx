import { useClientes } from '../hooks/useClientes';
import { useChamados } from '../hooks/useChamados';
import { useProdutos } from '../src/hooks/useProdutos.ts';
import { useMovimentacoes } from '../src/hooks/useMovimentacoes.ts';

const Dashboard = () => {
  const { clientes } = useClientes();
  const { chamados } = useChamados();
  const { produtos, getProdutosEstoqueBaixo } = useProdutos();
  const { getMovimentacoesDoDia } = useMovimentacoes();

  const totalClientes = clientes.length;
  const totalChamados = chamados.length;
  const chamadosAbertos = chamados.filter(c => c.status === 'aberto').length;
  const chamadosConcluidos = chamados.filter(c => c.status === 'concluído').length;

  const totalProdutos = produtos.length;
  const produtosAtivos = produtos.filter(p => p.status === 'ativo').length;
  const produtosEstoqueBaixo = getProdutosEstoqueBaixo().length;
  const movimentacoesDoDia = getMovimentacoesDoDia().length;

  const cards = [
    {
      title: 'Total de Clientes',
      value: totalClientes,
      color: 'bg-blue-500',
      icon: '👥',
    },
    {
      title: 'Total de Chamados',
      value: totalChamados,
      color: 'bg-green-500',
      icon: '📋',
    },
    {
      title: 'Produtos Ativos',
      value: produtosAtivos,
      color: 'bg-purple-500',
      icon: '📦',
    },
    {
      title: 'Movimentações Hoje',
      value: movimentacoesDoDia,
      color: 'bg-orange-500',
      icon: '📈',
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-slate-800 mb-2">Dashboard</h2>
        <p className="text-slate-600">Visão geral do sistema HelpDesk Pro</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className={`w-12 h-12 ${card.color} rounded-lg flex items-center justify-center mb-4`}>
              <span className="text-white text-xl">{card.icon}</span>
            </div>
            <h3 className="text-lg font-medium text-slate-900 mb-2">{card.title}</h3>
            <p className="text-3xl font-bold text-slate-700">{card.value}</p>
          </div>
        ))}
      </div>

      <div>
        <h3 className="text-2xl font-semibold text-slate-800 mb-6">Resumo dos Chamados</h3>
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⏳</span>
              </div>
              <p className="text-3xl font-bold text-yellow-600 mb-2">{chamadosAbertos}</p>
              <p className="text-slate-600 font-medium">Abertos</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🔄</span>
              </div>
              <p className="text-3xl font-bold text-blue-600 mb-2">{chamados.filter(c => c.status === 'andamento').length}</p>
              <p className="text-slate-600 font-medium">Em Andamento</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">✅</span>
              </div>
              <p className="text-3xl font-bold text-green-600 mb-2">{chamadosConcluidos}</p>
              <p className="text-slate-600 font-medium">Concluídos</p>
            </div>
          </div>
        </div>
      </div>

      {produtosEstoqueBaixo > 0 && (
        <div>
          <h3 className="text-2xl font-semibold text-slate-800 mb-6">Alertas de Estoque</h3>
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <div className="flex items-center mb-4">
              <span className="text-2xl mr-3">⚠️</span>
              <h4 className="text-lg font-semibold text-red-800">
                {produtosEstoqueBaixo} produto{produtosEstoqueBaixo > 1 ? 's' : ''} com estoque baixo
              </h4>
            </div>
            <div className="space-y-2">
              {getProdutosEstoqueBaixo().map(produto => (
                <div key={produto.id} className="flex justify-between items-center bg-white p-3 rounded border">
                  <div>
                    <span className="font-medium text-slate-900">{produto.nome}</span>
                    <span className="text-slate-500 ml-2">(SKU: {produto.sku})</span>
                  </div>
                  <div className="text-right">
                    <span className="text-red-600 font-semibold">
                      {produto.quantidadeAtual} / {produto.estoqueMinimo}
                    </span>
                    <span className="text-slate-500 text-sm ml-1">unidades</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;