import React, { useState } from 'react';
import { View, Text, Button, TextInput, StyleSheet, Image, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { auth } from '../firebase/Firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useDispatch } from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome';
import LinearGradient from 'react-native-linear-gradient';

import { images } from '../constants';
import { setUser } from '../redux/actions';
import UIButton from '../UIButton';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const Register = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const navigation = useNavigation();
    const dispatch = useDispatch();

    const handleRegister = async () => {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            dispatch(setUser({ uid: user.uid }));
            navigation.navigate('AddTodo'); // Điều hướng đến màn hình AddTodo sau khi đăng ký thành công
        } catch (error) {
            setError('Failed to register. Please try again.');
        }
    };

    const nameIcon = error ? 'exclamation' : 'check';
    return (
        <LinearGradient
            colors={['#3498db', '#85c1e9']}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={styles.container}
        >
            <Text style={styles.title}>Create Account</Text>
            <Image source={images.register} style={styles.image} />
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
                style={{ backgroundColor: '#e67e22', marginVertical: 20 }}
                title={'CREATE ACCOUNT'}
                onPress={handleRegister}
                nameIcon={nameIcon}
            />
            {error && <Text style={styles.error}>{error}</Text>}
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center', // Căn giữa theo chiều ngang
        padding: 16,
    },
    title: {
        fontSize: 24,
        marginBottom: 20,
        color: '#fff',
        textAlign: 'center',
    },
    image: {
        width: SCREEN_WIDTH * 0.9,
        height: SCREEN_WIDTH * 0.9,
        marginBottom: 30,
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
    },
    error: {
        color: 'red',
        marginTop: 10,
    },
});

export default Register;
