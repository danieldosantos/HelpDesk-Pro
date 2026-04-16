import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const location = useLocation();

  const menuItems = [
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/clientes', label: 'Clientes' },
    { path: '/chamados', label: 'Chamados' },
    { path: '/produtos', label: 'Produtos' },
    { path: '/movimentacoes', label: 'Movimentações' },
  ];

  return (
    <div className="min-h-screen w-60 bg-slate-800 text-white">
      <div className="border-b border-slate-700 px-6 py-7">
        <h2 className="text-xl font-bold">HelpDesk Pro</h2>
      </div>
      <nav className="mt-6">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`block px-6 py-3 mx-2 rounded-lg transition-colors ${
                  location.pathname === item.path
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                }`}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
