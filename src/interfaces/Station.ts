// Interface para representar uma estação de recarga
export interface Station {
  id: number;
  name: string;
  location: string;
  energy_type: 'renovável' | 'não renovável';  // Tipos específicos de energia
  available: boolean;  // true para disponível, false para ocupado
}