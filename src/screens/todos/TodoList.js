import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { setTodos } from '../../redux/actions';
import { Calendar } from 'react-native-calendars';
import { ref, onValue } from 'firebase/database';

import { db } from '../../firebase/Firebase';
import TodoItem from './TodoItem';
import UIHeader from '../UIHeader';

const TodoList = () => {
    const [loading, setLoading] = useState(true);
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedDay, setSelectedDay] = useState('');
    const todos = useSelector((state) => state.todos);
    const userId = useSelector((state) => state.auth.userId);
    const dispatch = useDispatch();

    useEffect(() => {
        if (userId) {
            const todosRef = ref(db, `users/${userId}/todos`);
            const unsubscribe = onValue(
                todosRef,
                (snapshot) => {
                    const data = snapshot.val();
                    const todosList = data ? Object.keys(data).map((key) => ({ id: key, ...data[key] })) : [];
                    dispatch(setTodos(todosList));
                    setLoading(false);
                },
                (error) => {
                    console.error('Error fetching todos: ', error);
                    setLoading(false);
                },
            );

            return () => unsubscribe();
        }
    }, [userId, dispatch]);

    useEffect(() => {
        const today = new Date().toISOString().split('T')[0];
        setSelectedDate(today);
        setSelectedDay(new Date().toLocaleDateString('en-US', { weekday: 'long' }));
    }, []);

    const filteredTodos = selectedDate
        ? todos.filter((todo) => todo.dueDate && todo.dueDate.split('T')[0] === selectedDate)
        : todos;

    const onDayPress = (day) => {
        setSelectedDate(day.dateString);
        setSelectedDay(new Date(day.timestamp).toLocaleDateString('en-US', { weekday: 'long' }));
    };

    if (loading) {
        return <Text>Loading...</Text>;
    }

    return (
        <View style={styles.container}>
            <UIHeader
                title={selectedDay}
                leftIconName={'arrow-left'}
                rightIconName={'search'}
                onPressLeftIcon={() => {
                    navigation.goBack();
                }}
                onPressRightIcon={() => {
                    alert('press right icon');
                }}
            />
            <Calendar
                onDayPress={onDayPress}
                markedDates={{
                    [selectedDate]: { selected: true, marked: true, selectedColor: 'blue' },
                }}
            />
            <FlatList
                data={filteredTodos}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <TodoItem
                        id={item.id}
                        text={item.title}
                        priority={item.priority}
                        completed={item.completed}
                        startTime={item.startTime}
                        endTime={item.endTime}
                    />
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 20,
    },
    selectedDayText: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        marginVertical: 10,
    },
});

export default TodoList;
