export interface Beneficio {
  id: number;
  nome: string;
  descricao: string;
  valor: number;
  ativo: boolean;
  version: number;
}

export interface BeneficioRequest {
  nome: string;
  descricao: string;
  valor: number;
  ativo: boolean;
}

export interface TransferenciaRequest {
  fromId: number;
  toId: number;
  valor: number;
}

export interface ApiError {
  timestamp: string;
  message: string;
}

export interface TransferenciaHistorico {
  id: string;
  dataHora: string;
  fromId: number;
  fromNome: string;
  toId: number;
  toNome: string;
  valor: number;
  status: 'CONCLUIDA' | 'FALHOU';
  mensagemErro?: string;
}
