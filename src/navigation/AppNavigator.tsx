import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import WelcomeScreen from '../screens/WelcomeScreen';
import LoginScreen from '../screens/LoginScreen';
import SignUpScreen from '../screens/SignUpScreen';

import ConsultationsListScreen from '../screens/ConsultationsListScreen';
import ScheduleConsultationScreen from '../screens/ScheduleConsultationScreen';
import ConfirmAppointmentScreen from '../screens/ConfirmAppointmentScreen';

import DashboardScreen from '../screens/DashboardScreen';
import StationDetailScreen from '../screens/StationDetailScreen';
import PreferencesScreen from '../screens/ChargingPreferencesScreen';
import HistoryScreen from '../screens/HistoryScreen';

// Definindo o RootStackParamList com todas as telas do projeto
export type RootStackParamList = {
  Welcome: undefined;
  Login: undefined;
  SignUp: undefined;

  ConsultationsList: undefined;
  ScheduleConsultation: undefined;
  ConfirmAppointment: undefined;

  Dashboard: undefined;
  StationDetail: { stationId: string };
  Preferences: undefined;
  History: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  return (
    
    <Stack.Navigator initialRouteName="Welcome">
      {/* Telas de Login */}
      <Stack.Screen 
        name="Welcome" 
        component={WelcomeScreen} 
        options={{ title: 'Tela Inicial' }} // Título personalizável
      />
      <Stack.Screen 
        name="Login" 
        component={LoginScreen} 
        options={{ title: 'Acesse sua conta' }} // Título personalizável
      />
      <Stack.Screen 
        name="SignUp" 
        component={SignUpScreen} 
        options={{ title: 'Cadastrar' }} // Título personalizável
      />

      {/* Telas de Consulta */}
      <Stack.Screen 
        name="ConsultationsList" 
        component={ConsultationsListScreen} 
        options={{ title: 'Consultas Agendadas' }} // Título personalizável
      />
      <Stack.Screen 
        name="ScheduleConsultation" 
        component={ScheduleConsultationScreen} 
        options={{ title: 'Agendar Consulta' }} // Título personalizável
      />
      <Stack.Screen 
        name="ConfirmAppointment" 
        component={ConfirmAppointmentScreen} 
        options={{ title: 'Confirmação de Agendamento' }} // Título personalizável
      />

      {/*Telas de Recarga */}
      <Stack.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{ title: 'Dashboard' }}
      />
      <Stack.Screen
        name="StationDetail"
        component={StationDetailScreen}
        options={{ title: 'Detalhes da Estação' }}
      />
      <Stack.Screen
        name="Preferences"
        component={PreferencesScreen}
        options={{ title: 'Preferências de Carregamento' }}
      />
      <Stack.Screen
        name="History"
        component={HistoryScreen}
        options={{ title: 'Histórico de Recargas' }}
      />
    </Stack.Navigator>
  );
};

export default AppNavigator;