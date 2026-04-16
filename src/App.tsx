import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import Login from '../pages/Login';
import Dashboard from '../pages/Dashboard';
import Clientes from '../pages/Clientes';
import Chamados from '../pages/Chamados';
import Produtos from './pages/produtos/Produtos';
import Movimentacoes from './pages/movimentacoes/Movimentacoes';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="clientes" element={<Clientes />} />
          <Route path="chamados" element={<Chamados />} />
          <Route path="produtos" element={<Produtos />} />
          <Route path="movimentacoes" element={<Movimentacoes />} />
        </Route>
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
