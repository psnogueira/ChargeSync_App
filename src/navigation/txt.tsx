import React, { useState } from 'react';
import { Box, Heading, VStack, FormControl, Input, Button, Text, Spinner } from 'native-base';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

const txt = () => {
  return (
    <Box flex={1} p={4} justifyContent="center" bg="gray.100">
      <Heading mb={6} textAlign="center">Registro</Heading>
      <VStack space={4}>
        <FormControl isRequired>
          <FormControl.Label>Username</FormControl.Label>
          <Input
            placeholder="Digite seu usuário"
            value={username}
            onChangeText={(text) => setUsername(text)}
            autoCapitalize="none"
          />
        </FormControl>
        <FormControl isRequired>
          <FormControl.Label>Senha</FormControl.Label>
          <Input
            placeholder="Digite sua senha"
            value={password}
            onChangeText={(text) => setPassword(text)}
            type="password"
            autoCapitalize="none"
          />
        </FormControl>
        <FormControl isRequired>
          <FormControl.Label>Confirme sua senha</FormControl.Label>
          <Input
            placeholder="Confirme sua senha"
            secureTextEntry
            value={confirmPassword}
            onChangeText={(text) => setConfirmPassword(text)}
            type="password"
            autoCapitalize="none"
          />
        </FormControl>
        {errorMessage && <Text color="red.500">{errorMessage}</Text>}
        <Button onPress={handleRegister} isDisabled={isLoading}>
          {isLoading ? <Spinner color="white" /> : 'Registrar'}
        </Button>
        <Button variant="link" onPress={() => navigation.navigate('Login')}>
          Já tem uma conta? Faça login
        </Button>
      </VStack>
    </Box>
  )
}

export default txt