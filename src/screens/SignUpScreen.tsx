import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Box, Button, Center, Input, Text, Heading, VStack, FormControl, Spinner } from 'native-base';
import React, { useState } from 'react';
import { RootStackParamList } from '../navigation/AppNavigator'; 

type SignUpScreenNavigationProp = NativeStackNavigationProp<
    RootStackParamList,
    'SignUp'
>;

type Props = {
    navigation: SignUpScreenNavigationProp;
};

const SignUpScreen = ({ navigation }: Props) => {
    // Estado para armazenar os valores dos campos
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSignUp = async () => {
        setIsLoading(true);
        setErrorMessage(null);

        if (!username || !password || !confirmPassword) {
            setIsLoading(false);
            setErrorMessage('Todos os campos são obrigatórios.');
            return;
        }

        if (password !== confirmPassword) {
            setIsLoading(false);
            setErrorMessage('As senhas não coincidem.');
            return;
        }

        try {
            const response = await fetch('http://localhost:3000/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password, confirmPassword }),
            });

            const data = await response.json();
            console.log(data); // Log da resposta

            if (!response.ok) {
                setIsLoading(false);
                setErrorMessage(data.errorMessage || 'Erro desconhecido'); // Mensagem padrão
            } else {
                setIsLoading(false);
                setErrorMessage('Usuário registrado com sucesso!');
                navigation.navigate('Login');
            }
        } catch (error) {
            console.error('Erro:', error); // Log de erros
            setIsLoading(false);
            setErrorMessage('Erro ao cadastrar usuário.');
        }
        console.log('Dados a serem enviados:', { username, password, confirmPassword });

    };

    return (
        <Center flex={1} bg="gray.100" px={8}>
            <Box 
                bg="white" 
                p={8} 
                borderRadius="lg" 
                borderWidth={1} 
                borderColor="gray.300" 
                minWidth="450px" 
                maxWidth="70%" 
                width="100%"
            >
                <Heading mb={6} textAlign="center">Registro</Heading>
                <VStack space={4}>
                    <FormControl isRequired>
                        <FormControl.Label>Usuário</FormControl.Label>
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

                    <Button onPress={handleSignUp} isDisabled={isLoading}>
                        {isLoading ? <Spinner color="white" /> : 'Registrar'}
                    </Button>

                    <Button variant="link" onPress={() => navigation.navigate('Login')}>
                        Já tem uma conta? Faça login
                    </Button>
                </VStack>
            </Box>
        </Center>
    );
};

export default SignUpScreen;