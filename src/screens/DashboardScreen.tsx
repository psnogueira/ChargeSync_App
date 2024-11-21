import React, { useState, useEffect } from 'react';
import { FlatList } from 'react-native';
import { Box, Text, Heading, VStack, Spinner, Center, Stack, HStack, Button, Progress } from 'native-base';
import { Alert } from 'react-native';
import { getAllStations } from '../api/stationsApi'; // Função que busca as estações
import { Station } from '../interfaces/Station'; // Interface da estação
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import AsyncStorage from '@react-native-async-storage/async-storage';

type DashboardScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Dashboard'
>;

type Props = {
  navigation: DashboardScreenNavigationProp;
};

const DashboardScreen = ({ navigation }: Props) => {
  const [stations, setStations] = useState<Station[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [numColumns, setNumColumns] = useState(1); // Estado para armazenar o número de colunas

  // Função para buscar as estações usando a API
  const fetchStations = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        setError('Token não encontrado. Faça login novamente.');
        return;
      }

      const stationsData = await getAllStations(token);
      const stationsDataData = stationsData.data.data;
      setStations(stationsDataData);
    } catch (error) {
      setError('Erro ao carregar as estações.');
    } finally {
      setLoading(false);
    }
  };

  // Função para atualizar o número de colunas com base no tamanho da tela
  const updateNumColumns = () => {
    const width = window.innerWidth;
    if (width < 1000) {
      setNumColumns(2);
    } else if (width < 1300) {
      setNumColumns(3);
    } else if (width < 1600) {
      setNumColumns(4);
    } else {
      setNumColumns(5);
    }
  };

  // useEffect para chamar a função de atualização do número de colunas ao carregar a página e ao redimensionar a janela
  useEffect(() => {
    updateNumColumns(); // Inicializa com o número correto de colunas

    // Adiciona o event listener para atualizar o número de colunas ao redimensionar a janela
    window.addEventListener('resize', updateNumColumns);

    // Remove o event listener ao desmontar o componente
    return () => {
      window.removeEventListener('resize', updateNumColumns);
    };
  }, []);

  useEffect(() => {
    fetchStations();
  }, []);

  // Renderiza um cartão para cada estação
  const renderStationItem = ({ item }: { item: Station }) => {
    // Define o progresso com base na disponibilidade
    const progress = item.available ? 100 : 0;
  
    return (
      <Box alignItems="center" mb={4}>
        <Box
          minW="300px"
          minH="200px" // Aumentei um pouco a altura para incluir a barra de progresso
          rounded="lg"
          overflow="hidden"
          borderColor="coolGray.200"
          borderWidth="1"
          backgroundColor={item.available ? '#E0F7FA' : '#F5F5F5'} // Cor do fundo personalizada
          _dark={{
            backgroundColor: item.available ? '#B3E5FC' : 'gray.800', // Cor para modo escuro
            borderColor: 'coolGray.600',
          }}
        >
          <Box>
            <Box style={{ height: 100, width: '100%' }}>
              {/* Espaço reservado para imagem */}
            </Box>
            {/* Exibe a disponibilidade */}
            <Center
              bg={item.available ? 'green.500' : 'red.500'}
              _dark={{ bg: item.available ? 'green.400' : 'red.400' }}
              _text={{ color: 'warmGray.50', fontWeight: '700', fontSize: 'xs' }}
              position="absolute"
              top="0"
              px="3"
              py="1.5"
            >
              {item.available ? 'DISPONÍVEL' : 'OCUPADO'}
            </Center>
          </Box>
  
          <Stack p="4" space={3}>
            <Stack space={2}>
              <Heading size="md" ml="-1">
                {item.name}
              </Heading>
              <Text
                fontSize="xs"
                _light={{ color: 'violet.500' }}
                _dark={{ color: 'violet.400' }}
                fontWeight="500"
                ml="-0.5"
                mt="-1"
              >
                {item.location}
              </Text>
            </Stack>
  
            {/* Exibe o tipo de energia */}
            <Text fontWeight="400">Tipo de energia: {item.energy_type.toUpperCase()}</Text>
  
            {/* Barra de progresso */}
            <Box mt={2}>
              <Text fontSize="xs" mb={1} color="coolGray.600" _dark={{ color: 'coolGray.400' }}>
                Progresso de recarga:
              </Text>
              <Progress
                value={progress} // Progresso baseado na disponibilidade
                size="sm"
                colorScheme={item.available ? 'green' : 'red'} // Verde para disponível, vermelho para ocupado
              />
            </Box>
  
            {/* Botão "Usar" */}
            <Button
              mt={2}
              isDisabled={!item.available} // Desabilita o botão se a estação não está disponível
              onPress={() => {
                if (item.available) {
                  navigation.navigate('StationDetail', { stationId: item.id.toString() }); // Passa o ID da estação
                }
              }}
              backgroundColor={item.available ? 'blue.500' : 'gray.400'} // Azul se habilitado, cinza se desabilitado
              _text={{
                color: item.available ? 'white' : 'gray.700', // Texto branco se habilitado
              }}
              _pressed={{
                backgroundColor: 'blue.700', // Cor ao pressionar
              }}
              _disabled={{
                backgroundColor: 'gray.400', // Cor desabilitada
                _text: { color: 'gray.700' }, // Texto desabilitado
              }}
            >
              Usar
            </Button>
          </Stack>
        </Box>
      </Box>
    );
  };

  return (
    <Box flex={1} p={4} backgroundColor="white">
      {/* Usando HStack para alinhar o Heading e o Button horizontalmente */}
      <HStack justifyContent="space-between" alignItems="center" mb={10}>
        <Heading>Todas as Estações</Heading>
        <Button onPress={() => navigation.navigate('Preferences')}>Preferências de Carregamento</Button>
      </HStack>

      {loading ? (
        <Center flex={1}>
          <Spinner size="lg" />
          <Text>Carregando estações...</Text>
        </Center>
      ) : error ? (
        <Center flex={1}>
          <Text color="red.500">{error}</Text>
        </Center>
      ) : (
        <FlatList
          data={stations}
          renderItem={renderStationItem}
          keyExtractor={(item) => item.id.toString()}
          key={numColumns}
          numColumns={numColumns}
          columnWrapperStyle={{ justifyContent: 'space-evenly' }}
          ListEmptyComponent={() => (
            <Center>
              <Text>Nenhuma estação encontrada.</Text>
            </Center>
          )}
        />
      )}
    </Box>
  );
};

export default DashboardScreen;