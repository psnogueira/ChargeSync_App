// Interface para representar as preferências de recarga do usuário

// Tipos de energia preferidos
// preferred_energy_type: 'renovável' | 'qualquer';

// Horários preferidos para recarga
// preferred_hours: 'manhã' | 'tarde' | 'noite | 'qualquer';

export interface UserPreference {
  id: number;
  userId: number;
  preferred_energy_type: string;  // Tipos de energia preferidos
  preferred_hours: string;  // Horários preferidos para recarga
}