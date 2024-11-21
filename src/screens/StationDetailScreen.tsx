import React, { useEffect, useState } from 'react';
import { Box, Text, Heading, Stack, Spinner, Center, Divider, Icon, HStack, Button, VStack } from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';
import { useRoute } from '@react-navigation/native';
import { Charge } from '../interfaces/Charge';
import { Station } from '../interfaces/Station';
import { createCharge, getChargesByUserId } from '../api/chargesApi';
import { getStationById } from '../api/stationsApi';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import AsyncStorage from '@react-native-async-storage/async-storage';

type StationDetailScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Preferences'
>;

type Props = {
  navigation: StationDetailScreenNavigationProp;
};

type RouteParams = {
  stationId: string; // Tipo do parâmetro que será passado
};

const StationDetailScreen = ({ navigation }: Props) => {
  const [charges, setCharges] = useState<Charge[]>([]);
  const [chargeChosen, setChargeChosen] = useState<Charge | null>(null);
  const [station, setStation] = useState<Station | null>(null);
  const [loading, setLoading] = useState<boolean>(true); // Estado de carregamento
  const [error, setError] = useState<string | null>(null); // Estado para armazenar erros

  const route = useRoute();
  const { stationId } = route.params as RouteParams; // Obtém o parâmetro stationId

  // Função para buscar as sessões de recarga do usuário
  const fetchUserCharges = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) {
        throw new Error('ID do usuário não encontrado no armazenamento local.');
      }

      const token = await AsyncStorage.getItem('token');
      if (!token) {
        throw new Error('Token não encontrado no armazenamento local.');
      }

      // Busca as sessões de recarga em andamento do usuário.
      try {
        const response = await getChargesByUserId(Number(userId), token);
        const chargeResponse = response.data.data;

        // Variavel com todos os dados das sessões de recarga que tem status = "em andamento"
        const chargesInProgress = chargeResponse.filter((charge: Charge) => charge.status === 'em andamento');

        // Pega a única sessão de recarga que está em andamento.
        const chargeInProgress = chargesInProgress[0];
        setCharges(chargesInProgress);
        setChargeChosen(chargeInProgress);
      } catch (err: any) {
        console.error(err);
      }

      // Busca a estação pelo ID.
      try {
        const stationResponse = await getStationById(Number(stationId), token);
        const stationData = stationResponse.data.data;
        setStation(stationData);
      } catch (error) {
        setError('Erro ao buscar os detalhes da estação.');
      }
      
    } catch (err: any) {
      setError(err.message || 'Erro ao buscar as informações.');
    } finally {
      setLoading(false); // Finaliza o estado de carregamento
    }
  };

  // Função para criar uma nova sessão de recarga
  const handleCreateCharge = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      const token = await AsyncStorage.getItem('token');
      if (!userId || !token) {
        throw new Error('Usuário não autenticado. Faça login novamente.');
      }

      // Cria uma nova sessão de recarga
      await createCharge(
        {
          stationId: Number(stationId),
          userId: Number(userId),
          start_time: new Date().toISOString(),
          status: 'em andamento',
        },
        token
      );

      // Navega para a tela de Dashboard.
      navigation.navigate('Dashboard');
    } catch (error: any) {
      setError(error.message || 'Erro ao criar a sessão de recarga.');
    }
  };

  // useEffect para buscar as sessões de recarga quando a tela for carregada
  useEffect(() => {
    fetchUserCharges();
  }, []);

  return (
    <Box flex={1} p={4} bg="coolGray.50">
      {/* Título com botão de voltar */}
      <HStack alignItems="center" justifyContent="space-between" mb={4}>
        <HStack alignItems="center">
          <Button
            variant="ghost"
            onPress={() => navigation.navigate('Dashboard')}
            leftIcon={<Icon as={MaterialIcons} name="arrow-back" size="sm" color="primary.500" />}
          >
            Voltar
          </Button>
          <Heading color="primary.500" ml={2}>
            Detalhes da Estação
          </Heading>
        </HStack>
      </HStack>

      {loading ? (
        <Center flex={1}>
          <Spinner size="lg" color="primary.500" />
          <Text mt={2}>Carregando informações...</Text>
        </Center>
      ) : error ? (
        <Text color="red.500" mt={4}>
          {error}
        </Text>
      ) : station ? (
        <VStack space={6}>
          {/* Detalhes da Estação */}
          <Box
            p={6}
            bg="white"
            rounded="lg"
            shadow={2}
            borderWidth={1}
            borderColor="coolGray.200"
          >
            {/* Título do card */}
            <Heading size="md" color="primary.600" mb={2}>
              {station.name}
            </Heading>

            {/* Localização */}
            <Stack direction="row" alignItems="center" mb={3}>
              <Icon as={MaterialIcons} name="place" size="sm" color="primary.500" />
              <Text ml={2} color="coolGray.700" fontSize="md">
                {station.location}
              </Text>
            </Stack>

            <Divider my={3} bg="coolGray.200" />

            {/* ID da Estação */}
            <Stack direction="row" alignItems="center" mb={3}>
              <Icon as={MaterialIcons} name="info" size="sm" color="coolGray.500" />
              <Text ml={2} color="coolGray.700" fontSize="md">
                <Text bold>ID da Estação:</Text> {station.id}
              </Text>
            </Stack>

            {/* Tipo de energia */}
            <Stack direction="row" alignItems="center" mb={3}>
              <Icon as={MaterialIcons} name="bolt" size="sm" color="yellow.400" />
              <Text ml={2} color="coolGray.700" fontSize="md">
                <Text bold>Tipo de Energia:</Text> {station.energy_type}
              </Text>
            </Stack>
          </Box>

          {/* Botão para utilizar a estação */}
          <Button
            colorScheme="primary"
            onPress={handleCreateCharge}
            size="lg"
            leftIcon={<Icon as={MaterialIcons} name="power" size="sm" color="white" />}
          >
            Utilizar Estação
          </Button>
        </VStack>
      ) : (
        <Text mt={4}>Detalhes da estação não encontrados.</Text>
      )}
    </Box>
  );
};

export default StationDetailScreen;