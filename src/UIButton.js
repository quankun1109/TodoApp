import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const UIButton = ({ onPress, title, style, nameIcon }) => {
    const [isPressed, setIsPressed] = useState(false);
    const animation = useRef(new Animated.Value(0)).current;

    const handlePress = () => {
        if (!isPressed) {
            Animated.timing(animation, {
                toValue: 1,
                duration: 300,
                useNativeDriver: false,
            }).start(() => {
                setIsPressed(true);

                setTimeout(() => {
                    Animated.timing(animation, {
                        toValue: 0,
                        duration: 300,
                        useNativeDriver: false,
                    }).start(() => {
                        setIsPressed(false);
                    });
                }, 1000);
            });
        }
    };

    const buttonWidth = animation.interpolate({
        inputRange: [0, 1],
        outputRange: [SCREEN_WIDTH - 40, 60],
    });

    const buttonHeight = animation.interpolate({
        inputRange: [0, 1],
        outputRange: [60, 60],
    });

    const borderRadius = animation.interpolate({
        inputRange: [0, 1],
        outputRange: [10, 30],
    });

    const handlePressCombined = () => {
        handlePress();
        if (onPress) {
            onPress();
        }
    };

    return (
        <View style={styles.container}>
            <Animated.View style={[styles.button, { width: buttonWidth, height: buttonHeight, borderRadius }, style]}>
                <TouchableOpacity onPress={handlePressCombined} disabled={isPressed} style={styles.touchable}>
                    {isPressed ? (
                        <Icon name={nameIcon} size={30} color="#fff" />
                    ) : (
                        <Text style={styles.text}>{title}</Text>
                    )}
                </TouchableOpacity>
            </Animated.View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    button: {
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
    },
    touchable: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        color: '#fff',
        fontSize: 20,
    },
});

export default UIButton;
