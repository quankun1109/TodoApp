import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView, ActivityIndicator } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { ref, onValue } from 'firebase/database';
import { StackedBarChart } from 'react-native-chart-kit';
import { useFocusEffect } from '@react-navigation/native';
import Orientation from 'react-native-orientation-locker';
import { Picker } from '@react-native-picker/picker';

import { db } from '../firebase/Firebase';
import { setTodos } from '../redux/actions';

const getWeekNumber = (date) => {
    date = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    date.setUTCDate(date.getUTCDate() + 4 - (date.getUTCDay() || 7));
    const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
    return Math.ceil(((date - yearStart) / 86400000 + 1) / 7);
};

const getWeekStartEnd = (weekNumber, year) => {
    const firstDayOfYear = new Date(year, 0, 1);
    const days = (weekNumber - 1) * 7;
    const startOfWeek = new Date(firstDayOfYear.setDate(firstDayOfYear.getDate() + days));
    const dayOfWeek = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
    const monday = new Date(startOfWeek.setDate(diff));
    const endOfWeek = new Date(monday);
    endOfWeek.setDate(monday.getDate() + 6);
    return { startOfWeek: monday, endOfWeek };
};

const getTodosForWeek = (todos, weekNumber, year) => {
    const { startOfWeek, endOfWeek } = getWeekStartEnd(weekNumber, year);
    const weekTodos = {};

    for (let d = new Date(startOfWeek); d <= endOfWeek; d.setDate(d.getDate() + 1)) {
        const dateKey = d.toISOString().split('T')[0];
        weekTodos[dateKey] = { completed: 0, notCompleted: 0 };
    }

    todos.forEach((todo) => {
        const dueDate = todo.dueDate.split('T')[0];
        if (weekTodos.hasOwnProperty(dueDate)) {
            if (todo.completed) {
                weekTodos[dueDate].completed += 1;
            } else {
                weekTodos[dueDate].notCompleted += 1;
            }
        }
    });

    return weekTodos;
};

const Stats = () => {
    const [loading, setLoading] = useState(true);
    const todos = useSelector((state) => state.todos);
    const userId = useSelector((state) => state.auth.userId);
    const dispatch = useDispatch();
    const [weekTodos, setWeekTodos] = useState({});
    const [selectedWeek, setSelectedWeek] = useState(getWeekNumber(new Date()));
    const [currentWeekNumber, setCurrentWeekNumber] = useState(getWeekNumber(new Date()));

    useFocusEffect(
        React.useCallback(() => {
            Orientation.lockToLandscape(); // Lock to landscape mode when the screen is focused

            return () => {
                Orientation.unlockAllOrientations(); // Unlock all orientations when the screen is unfocused
            };
        }, []),
    );

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
        const currentWeekTodos = getTodosForWeek(todos, selectedWeek, new Date().getFullYear());
        setWeekTodos(currentWeekTodos);
        setCurrentWeekNumber(selectedWeek);
    }, [todos, selectedWeek]);

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#0000ff" />
                <Text style={styles.loadingText}>Loading...</Text>
            </View>
        );
    }

    const labels = Object.keys(weekTodos);
    const completedData = Object.values(weekTodos).map((item) => item.completed);
    const notCompletedData = Object.values(weekTodos).map((item) => item.notCompleted);

    const data = {
        labels: labels,
        legend: ['Chưa hoàn thành', 'Đã hoàn thành'],
        data: labels.map((_, index) => [notCompletedData[index], completedData[index]]),
        barColors: ['#ff0000', '#00ff00'],
    };

    const screenWidth = Dimensions.get('window').width;

    return (
        <ScrollView>
            <View style={styles.container}>
                <View style={styles.pickerContainer}>
                    <Text style={styles.header}>Chọn số tuần:</Text>
                    <Picker
                        selectedValue={selectedWeek}
                        style={styles.picker}
                        onValueChange={(itemValue) => setSelectedWeek(itemValue)}
                    >
                        {[...Array(52)].map((_, i) => (
                            <Picker.Item key={i} label={`Tuần ${i + 1}`} value={i + 1} />
                        ))}
                    </Picker>
                </View>
                <Text style={styles.header}>Tuần số {currentWeekNumber}</Text>
                <Text style={styles.subHeader}>Số công việc đã thêm theo ngày trong tuần hiện tại</Text>
                <StackedBarChart
                    data={data}
                    width={screenWidth - 16} // Chiều rộng bằng chiều dài điện thoại
                    height={220}
                    chartConfig={{
                        backgroundColor: '#1f77b4',
                        backgroundGradientFrom: '#1f77b4',
                        backgroundGradientTo: '#1f77b4',
                        decimalPlaces: 0,
                        color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                        style: {
                            borderRadius: 16,
                        },
                        showValuesOnTopOfBars: false, // Ẩn các nhãn giá trị
                    }}
                    style={{
                        marginVertical: 8,
                        borderRadius: 16,
                    }}
                />
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 8,
        backgroundColor: '#fff',
    },
    pickerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 10,
    },
    picker: {
        height: 50,
        width: 150,
    },
    header: {
        fontSize: 18,
        textAlign: 'center',
        marginVertical: 10,
        fontWeight: 'bold',
        color: '#2c3e50',
    },
    subHeader: {
        fontSize: 16,
        textAlign: 'center',
        marginVertical: 10,
        color: '#34495e',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: '#34495e',
    },
});

export default Stats;
