import React, { useState, useEffect } from 'react';
import { Box, Heading, VStack, Select, CheckIcon, Button, Text, Center } from 'native-base';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Interface para representar as preferências de recarga do usuário
export interface UserPreference {
  id: number;
  userId: number;
  preferred_energy_type: 'renovável' | 'qualquer'; // Tipos de energia preferidos
  preferred_hours: 'Manhã' | 'Tarde' | 'Noite'; // Horários preferidos para recarga
}

const ChargingPreferencesScreen = () => {
  const [preferences, setPreferences] = useState<UserPreference | null>(null);
  const [preferredEnergyType, setPreferredEnergyType] = useState<'renovável' | 'qualquer'>('renovável');
  const [preferredHours, setPreferredHours] = useState<'Manhã' | 'Tarde' | 'Noite'>('Manhã');
  const [loading, setLoading] = useState(false);

  // Função para carregar preferências do AsyncStorage (simulando carregamento do backend)
  const loadPreferences = async () => {
    setLoading(true);
    try {
      const storedPreferences = await AsyncStorage.getItem('userPreferences');
      if (storedPreferences) {
        const parsedPreferences: UserPreference = JSON.parse(storedPreferences);
        setPreferences(parsedPreferences);
        setPreferredEnergyType(parsedPreferences.preferred_energy_type);
        setPreferredHours(parsedPreferences.preferred_hours);
      }
    } catch (error) {
      console.error('Erro ao carregar as preferências:', error);
    } finally {
      setLoading(false);
    }
  };

  // Função para salvar preferências no AsyncStorage (simulando envio para backend)
  const savePreferences = async () => {
    setLoading(true);
    try {
      const newPreferences: UserPreference = {
        id: preferences?.id || Date.now(), // Gera um ID se não existir
        userId: preferences?.userId || 1, // Simula um ID de usuário
        preferred_energy_type: preferredEnergyType,
        preferred_hours: preferredHours,
      };

      // Salva no AsyncStorage (simulando persistência)
      await AsyncStorage.setItem('userPreferences', JSON.stringify(newPreferences));
      setPreferences(newPreferences);
      alert('Preferências salvas com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar preferências:', error);
      alert('Erro ao salvar preferências.');
    } finally {
      setLoading(false);
    }
  };

  // Carrega as preferências ao montar a tela
  useEffect(() => {
    loadPreferences();
  }, []);

  return (
    <Box flex={1} p={6} backgroundColor="white">
      <Heading mb={6} textAlign="center">
        Preferências de Recarga
      </Heading>

      {loading ? (
        <Center flex={1}>
          <Text>Carregando...</Text>
        </Center>
      ) : (
        <VStack space={4}>
          {/* Selecionar tipo de energia preferido */}
          <Box>
            <Text fontSize="md" bold>
              Tipo de Energia Preferido
            </Text>
            <Select
              selectedValue={preferredEnergyType}
              onValueChange={(value) => setPreferredEnergyType(value as 'renovável' | 'qualquer')}
              minWidth="200"
              accessibilityLabel="Escolha o tipo de energia"
              placeholder="Escolha o tipo de energia"
              _selectedItem={{
                bg: 'teal.600',
                endIcon: <CheckIcon size="5" />,
              }}
            >
              <Select.Item label="Renovável" value="renovável" />
              <Select.Item label="Qualquer" value="qualquer" />
            </Select>
          </Box>

          {/* Selecionar horário preferido */}
          <Box>
            <Text fontSize="md" bold>
              Horário Preferido para Recarga
            </Text>
            <Select
              selectedValue={preferredHours}
              onValueChange={(value) => setPreferredHours(value as 'Manhã' | 'Tarde' | 'Noite')}
              minWidth="200"
              accessibilityLabel="Escolha o horário preferido"
              placeholder="Escolha o horário preferido"
              _selectedItem={{
                bg: 'teal.600',
                endIcon: <CheckIcon size="5" />,
              }}
            >
              <Select.Item label="Manhã" value="Manhã" />
              <Select.Item label="Tarde" value="Tarde" />
              <Select.Item label="Noite" value="Noite" />
            </Select>
          </Box>

          {/* Botão para salvar as preferências */}
          <Button
            onPress={savePreferences}
            isLoading={loading}
            isLoadingText="Salvando..."
            colorScheme="teal"
          >
            Salvar Preferências
          </Button>
        </VStack>
      )}
    </Box>
  );
};

export default ChargingPreferencesScreen;