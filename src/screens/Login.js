import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Dimensions, Alert, Image } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import Icon from 'react-native-vector-icons/FontAwesome';

import { auth } from '../firebase/Firebase';
import { setUser } from '../redux/actions';
import UIButton from '../UIButton';
import { images } from '../constants';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const dispatch = useDispatch();
    const navigation = useNavigation();

    const handleLogin = async () => {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const userId = userCredential.user.uid;
            dispatch(setUser({ uid: userId }));
            navigation.navigate('UITab');
        } catch (error) {
            setError('Login Error');
            Alert.alert('Login Error', error.message);
        }
    };

    const nameIcon = error ? 'exclamation' : 'check';

    return (
        <LinearGradient colors={['#e67e22', '#f39c12']} style={styles.container}>
            <Text style={styles.title}>Login Screen</Text>
            <Image source={images.login} style={styles.image} />
            <View style={styles.inputContainer}>
                <Icon name="envelope" size={20} color="#000" style={styles.icon} />
                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                />
            </View>
            <View style={styles.inputContainer}>
                <Icon name="lock" size={20} color="#000" style={styles.icon} />
                <TextInput
                    style={styles.input}
                    placeholder="Password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                />
            </View>
            <UIButton
                style={{ backgroundColor: '#3498db', marginVertical: 20 }}
                title={'LOGIN'}
                onPress={handleLogin}
                nameIcon={nameIcon}
            />
            <Text style={styles.registerText} onPress={() => navigation.navigate('Register')}>
                Do not have an account? <Text style={styles.registerLink}>Register</Text>
            </Text>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    title: {
        fontSize: 26,
        color: '#fff',
        marginBottom: 20,
        fontWeight: 'bold',
    },
    image: {
        width: SCREEN_WIDTH * 0.7,
        height: SCREEN_WIDTH * 0.7,
        marginBottom: 30,
        borderRadius: 30,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 30,
        padding: 8,
        marginVertical: 10,
        backgroundColor: '#fff', // Màu nền cho input
    },
    icon: {
        marginHorizontal: 10,
    },
    input: {
        flex: 1,
        height: 40,
        backgroundColor: '#fff',
        borderRadius: 30,
        paddingHorizontal: 10,
        fontSize: 16,
    },
    registerText: {
        color: '#fff',
        fontSize: 16,
        textAlign: 'center',
    },
    registerLink: {
        color: '#85c1e9',
        textDecorationLine: 'underline',
        fontWeight: 'bold',
    },
});

export default Login;
