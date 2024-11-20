// Interface para representar as preferências de recarga do usuário
export interface UserPreference {
  id: number;
  userId: number;
  preferred_energy_type: 'renovável' | 'qualquer';  // Tipos de energia preferidos
  preferred_hours: 'Manhã' | 'Tarde' | 'Noite';  // Horários preferidos para recarga
}