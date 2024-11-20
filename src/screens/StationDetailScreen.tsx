import React from 'react';
import { Box, Text, Heading, Stack } from 'native-base';
import { useRoute } from '@react-navigation/native';

type RouteParams = {
  stationId: string; // Tipo do parâmetro que será passado
};

const StationDetailScreen = () => {
  const route = useRoute();
  const { stationId } = route.params as RouteParams; // Obtém o parâmetro stationId

  return (
    <Box flex={1} p={4}>
      <Heading>Detalhes da Estação</Heading>
      <Stack mt={5}>
        <Text>ID da Estação: {stationId}</Text>
        {/* Aqui você pode buscar mais detalhes da estação usando o ID */}
      </Stack>
    </Box>
  );
};

export default StationDetailScreen;