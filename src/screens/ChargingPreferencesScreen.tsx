import React, { useEffect, useState } from 'react';
import { View, Text, Button, Alert, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Dropdown } from 'react-native-element-dropdown'; // Instale essa biblioteca
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import {
  getUserPreferences,
  createUserPreferences,
  updateUserPreferenceById
} from '../api/userPreferenceApi';

type PreferencesScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Preferences'
>;

type Props = {
  navigation: PreferencesScreenNavigationProp;
};

const ChargingPreferencesScreen = ({ navigation }: Props) => {
  const [preferredEnergyType, setPreferredEnergyType] = useState<string>('renovável');
  const [preferredHours, setPreferredHours] = useState<string>('Manhã');
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Opções para os Dropdowns
  const energyTypeOptions = [
    { label: 'Renovável', value: 'renovável' },
    { label: 'Qualquer', value: 'qualquer' }
  ];

  const hoursOptions = [
    { label: 'Manhã', value: 'manhã' },
    { label: 'Tarde', value: 'tarde' },
    { label: 'Noite', value: 'noite' },
    { label: 'Qualquer', value: 'qualquer' }
  ];

  // Função para carregar o userId e o token do localStorage e buscar as preferências
  const loadPreferences = async () => {
    setErrorMessage(null);

    try {
      setLoading(true);

      const userId = await AsyncStorage.getItem('userId');
      const token = await AsyncStorage.getItem('token');

      if (!userId || !token) {
        Alert.alert('Erro', 'Usuário não autenticado. Faça login novamente.');
        return;
      }

      // Buscar as preferências do usuário
      const userPreferences = await getUserPreferences(Number(userId), token);
      const userPreferencesData = userPreferences.data.data[0];

      await AsyncStorage.setItem('userPreferenceId', userPreferencesData.id.toString());

      // Atualizar os estados com as preferências do usuário.
      setPreferredEnergyType(userPreferencesData.preferred_energy_type);
      setPreferredHours(userPreferencesData.preferred_hours);

      setLoading(false);
    } catch (error: any) {
      setLoading(false);
      setErrorMessage('Não foi possível carregar as preferências do usuário!');
      Alert.alert('Erro', error.message || 'Erro ao carregar as preferências.');
    }
  };

  // Função para criar ou atualizar preferências
  const savePreferences = async () => {
    setErrorMessage(null);

    try {
      const userId = await AsyncStorage.getItem('userId');
      const token = await AsyncStorage.getItem('token');
      const preferenceId = Number(await AsyncStorage.getItem('userPreferenceId'));

      if (!userId || !token) {
        Alert.alert('Erro', 'Usuário não autenticado. Faça login novamente.');
        return;
      }

      if (preferredEnergyType && preferredHours) {
        // Atualizar preferências existentes
        await updateUserPreferenceById(
          preferenceId,
          { preferred_energy_type: preferredEnergyType, preferred_hours: preferredHours },
          token
        );
        setErrorMessage('Preferências salvas com sucesso!');
        Alert.alert('Sucesso', 'Preferências atualizadas com sucesso!');
      } else {
        setErrorMessage('Erro ao salvar as preferências.');
        Alert.alert('Erro', 'Erro ao salvar as preferências.');
      }
    } catch (error: any) {
      setErrorMessage('Não foi possível salvar as preferências do usuário.');
      Alert.alert('Erro', error.message || 'Erro ao salvar as preferências.');
    }
  };

  // Carregar as preferências ao montar o componente
  useEffect(() => {
    loadPreferences();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Carregando preferências...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.navigate('Dashboard')}
          style={styles.backButton}
        >
          <Text style={styles.backButtonText}>◀ Voltar para Dashboard</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Preferências de Recarga</Text>
      </View>

      <Text style={styles.label}>Tipo de Energia Preferida:</Text>
      <Dropdown
        style={styles.dropdown}
        data={energyTypeOptions}
        labelField="label"
        valueField="value"
        placeholder="Selecione o tipo de energia"
        value={preferredEnergyType}
        onChange={(item) => {
          setErrorMessage(null); // Limpa a mensagem de erro
          setPreferredEnergyType(item.value);
        }}
      />

      <Text style={styles.label}>Horas Preferidas:</Text>
      <Dropdown
        style={styles.dropdown}
        data={hoursOptions}
        labelField="label"
        valueField="value"
        placeholder="Selecione o horário"
        value={preferredHours}
        onChange={(item) => {
          setErrorMessage(null); // Limpa a mensagem de erro
          setPreferredHours(item.value);
        }}
      />

      {/* Exibição da mensagem de erro ou sucesso */}
      {errorMessage && (
        <Text
          style={[
            styles.errorMessage,
            errorMessage.includes('sucesso') ? styles.successMessage : styles.errorText
          ]}
        >
          {errorMessage}
        </Text>
      )}

      <Button title="Salvar Preferências" onPress={savePreferences} color="#4CAF50" />
    </View>
  );
};

export default ChargingPreferencesScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#FFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButton: {
    marginRight: 10,
    padding: 5,
  },
  backButtonText: {
    fontSize: 18,
    color: '#007BFF', // Cor do botão
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    flex: 1, // Centraliza o título
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginTop: 10,
    marginBottom: 5,
  },
  dropdown: {
    height: 50,
    borderColor: '#DDD',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  errorMessage: {
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 16,
  },
  successMessage: {
    color: 'green',
  },
  errorText: {
    color: 'red',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});