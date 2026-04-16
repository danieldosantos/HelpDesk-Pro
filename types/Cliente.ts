export type TipoCliente = 'PF' | 'PJ';

export interface Cliente {
  id: string;
  nome: string;
  telefone: string;
  email: string;
  empresa: string;
  documento: string;
  tipoCliente: TipoCliente;
  cidade: string;
}
