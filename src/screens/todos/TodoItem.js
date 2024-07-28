import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { View, Text, Button, StyleSheet, Switch, Platform, Alert } from 'react-native';
import PushNotification from 'react-native-push-notification';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';

import { deleteTodo, updateTodo } from '../../redux/actions';
import { db } from '../../firebase/Firebase';
import { ref, remove, update } from 'firebase/database';

// Cấu hình thông báo
const requestExactAlarmPermission = async () => {
    if (Platform.OS === 'android' && Platform.Version >= 31) {
        // Android 12+
        const result = await request(PERMISSIONS.ANDROID.SCHEDULE_EXACT_ALARM);
        return result;
    }
    return RESULTS.GRANTED;
};

const scheduleNotification = async (startTime) => {
    const permission = await requestExactAlarmPermission();
    if (permission === RESULTS.GRANTED) {
        const notificationTime = new Date(startTime);
        notificationTime.setMinutes(notificationTime.getMinutes() - 5);

        PushNotification.localNotificationSchedule({
            message: 'Bạn có một công việc sắp đến hạn!',
            date: notificationTime,
            allowWhileIdle: true,
        });
    } else {
        console.log('Exact alarm permission not granted');
    }
};

const TodoItem = ({ id, text, priority, completed, startTime, endTime }) => {
    const dispatch = useDispatch();
    const userId = useSelector((state) => state.auth.userId);
    const [isCompleted, setIsCompleted] = useState(completed);

    useEffect(() => {
        setIsCompleted(completed);
    }, [completed]);

    const handleDeleteTodo = async () => {
        const todoRef = ref(db, `users/${userId}/todos/${id}`);
        await remove(todoRef);
        dispatch(deleteTodo(id));
    };

    const handleToggleComplete = async () => {
        const todoRef = ref(db, `users/${userId}/todos/${id}`);
        await update(todoRef, { completed: !isCompleted });
        dispatch(updateTodo(id, { completed: !isCompleted }));
        setIsCompleted(!isCompleted);
    };

    const sTime = new Date(startTime).toLocaleTimeString();
    const eTime = new Date(endTime).toLocaleTimeString();

    return (
        <View style={styles.container}>
            <View style={styles.info}>
                <Text style={styles.text}>{text}</Text>
                <Text style={styles.subText}>Priority: {priority || 'None'}</Text>
                <Text style={styles.subText}>Time: {startTime && endTime ? `${sTime} - ${eTime}` : 'Not set'}</Text>
            </View>
            <View style={styles.actions}>
                <Switch value={isCompleted} onValueChange={handleToggleComplete} />
                <Button title="Delete" onPress={handleDeleteTodo} color="#e74c3c" />
            </View>
            <Button
                title="Set Notification"
                onPress={() => {
                    if (startTime) {
                        scheduleNotification(startTime);
                    } else {
                        Alert.alert('Error', 'Start time is not set.');
                    }
                }}
                color="#3498db"
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        padding: 15,
        marginVertical: 10,
        backgroundColor: '#f9f9f9',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.3,
        shadowRadius: 2,
        elevation: 2,
    },
    info: {
        marginBottom: 10,
    },
    text: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#2c3e50',
    },
    subText: {
        fontSize: 14,
        color: '#7f8c8d',
    },
    actions: {
        flexDirection: 'row',
        alignItems: 'center',
    },
});

export default TodoItem;
