// Interface para representar uma sessão de recarga
export interface Charge {
  id: number;
  userId: number;
  stationId: number;
  start_time: string;  // Data e hora de início no formato ISO (ex: 2024-11-20T14:30:00Z)
  end_time?: string;   // Data e hora de término (opcional no início da sessão)
  energy_used?: number;  // Quantidade de energia consumida, opcional no início
  status: 'em andamento' | 'concluído' | 'cancelado';  // Status da sessão de recarga
  progress: number;  // Progresso da recarga (0 a 100)
}