import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Box, Button, Center, Input, Heading, VStack, FormControl, Text, Spinner } from 'native-base';
import React, { useState } from 'react';
import { Alert as RNAlert } from 'react-native';
import { login, getUserIdByUsername } from '../api/auth';
import { RootStackParamList } from '../navigation/AppNavigator';
import AsyncStorage from '@react-native-async-storage/async-storage';

type LoginScreenNavigationProp = NativeStackNavigationProp<
    RootStackParamList,
    'Login'
>;

type Props = {
    navigation: LoginScreenNavigationProp;
};

const LoginScreen = ({ navigation }: Props) => {
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const handleLogin = async () => {
        setIsLoading(true); // Mostra o spinner
        setErrorMessage(null);

        try {
            const token = await login(username, password);
            console.log('Token:', token);
            await AsyncStorage.setItem('token', token);

            console.log('username:', username);
            const userId = await getUserIdByUsername(username);
            console.log('User ID:', userId);
            await AsyncStorage.setItem('username', username);
            await AsyncStorage.setItem('userId', userId.toString());

            setIsLoading(false); // Esconde o spinner
            RNAlert.alert('Login realizado com sucesso!');
            navigation.navigate('Dashboard');
        } catch (err: unknown) {
            setErrorMessage('Usuário ou senha inválidos.');
            setIsLoading(false); // Esconde o spinner
            
            if (err instanceof Error) {
                RNAlert.alert('Erro', err.message);
            } else {
                RNAlert.alert('Erro', 'Ocorreu um erro inesperado.');
            }
        }
    };

    return (
        <Center flex={1} bg="gray.100" px={8}>
            <Box 
                bg="white" 
                p={8} 
                borderRadius="lg" 
                borderWidth={1} 
                borderColor="gray.300" 
                minWidth="440px" 
                maxWidth="60%" 
                width="100%"
            >
                <Heading mb={6} textAlign="center">Login</Heading>
                <VStack space={4}>
                    <FormControl isRequired>
                        <FormControl.Label>Usuário</FormControl.Label>
                        <Input
                            placeholder="Ex: joao2024"
                            value={username}
                            onChangeText={(text) => setUsername(text)}
                            autoCapitalize="none"
                        />
                    </FormControl>

                    <FormControl isRequired>
                        <FormControl.Label>Senha</FormControl.Label>
                        <Input
                            placeholder="Ex: Jo40!@#$"
                            value={password}
                            onChangeText={(text) => setPassword(text)}
                            type="password"
                            autoCapitalize="none"
                        />
                    </FormControl>

                    {errorMessage && <Text color="red.500">{errorMessage}</Text>}

                    <Button onPress={handleLogin} isDisabled={isLoading}>
                        {isLoading ? <Spinner color="white" /> : 'Entrar'}
                    </Button>

                    <Button variant="link" onPress={() => navigation.navigate('SignUp')}>
                        Ainda não tem uma conta? Cadastrar-se
                    </Button>
                </VStack>
            </Box>
        </Center>
    );
};

export default LoginScreen;