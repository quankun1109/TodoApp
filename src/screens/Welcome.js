import React from 'react';
import { Image, View, Text, StyleSheet, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import UIButton from '../UIButton';
import images from '../constants/images';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const Welcome = () => {
    const navigation = useNavigation();

    return (
        <View style={styles.container}>
            <View
                style={{
                    flex: 70,
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <Text style={styles.title}>Launch your app</Text>
                <Image source={images.welcome} style={styles.image} />
            </View>

            <View
                style={{
                    flex: 30,
                    marginVertical: 10,
                }}
            >
                <UIButton
                    style={{ backgroundColor: '#3498db', marginVertical: 20 }}
                    title={'CREATE ACCOUNT'}
                    onPress={() => {
                        navigation.navigate('Register');
                    }}
                    nameIcon="check"
                />
                <UIButton
                    style={{ backgroundColor: '#e67e22' }}
                    title={'LOGIN'}
                    onPress={() => {
                        navigation.navigate('Login');
                    }}
                    nameIcon="check"
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 100,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 26,
        marginBottom: 70,
        marginTop: 40,
        color: '#34383c',
    },
    image: {
        width: SCREEN_WIDTH * 0.9,
        height: SCREEN_WIDTH * 0.9,
        marginBottom: 30,
    },
});

export default Welcome;
