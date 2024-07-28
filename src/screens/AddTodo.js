import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Text, Alert, ScrollView } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { ref, push } from 'firebase/database';
import { Calendar } from 'react-native-calendars';
import DateTimePicker from '@react-native-community/datetimepicker';

import { addTodo } from '../redux/actions';
import { db } from '../firebase/Firebase';
import UIHeader from './UIHeader';
import UIButton from '../UIButton';

const AddTodo = () => {
    const [text, setText] = useState('');
    const [priority, setPriority] = useState('normal');
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedDay, setSelectedDay] = useState('');
    const [startTime, setStartTime] = useState(new Date());
    const [endTime, setEndTime] = useState(new Date());
    const [showStartTimePicker, setShowStartTimePicker] = useState(false);
    const [showEndTimePicker, setShowEndTimePicker] = useState(false);
    const [error, setError] = useState(null);

    const dispatch = useDispatch();
    const userId = useSelector((state) => state.auth.userId);

    const handleAddTodo = async () => {
        if (!selectedDate) {
            setError('Error');
            Alert.alert('Error', 'Please select a valid date.');
            return;
        }

        const selectedDateObj = new Date(selectedDate);
        const currentDate = new Date();

        if (selectedDateObj < currentDate.setHours(0, 0, 0, 0)) {
            setError('Error');
            Alert.alert('Error', 'You can only add tasks for today or future dates.');
            return;
        }

        if (endTime <= startTime) {
            setError('Error');
            Alert.alert('Error', 'End time must be after start time.');
            return;
        }

        const newTodo = {
            title: text,
            completed: false,
            startTime: startTime.toISOString(),
            endTime: endTime.toISOString(),
            dueDate: selectedDate,
            priority,
        };

        const todoRef = ref(db, `users/${userId}/todos`);
        const newTodoRef = await push(todoRef, newTodo);
        dispatch(
            addTodo({
                id: newTodoRef.key,
                ...newTodo,
            }),
        );
        setText('');
        setSelectedDate('');
        setError('');
    };

    const onDayPress = (day) => {
        setSelectedDate(day.dateString);
        setSelectedDay(new Date(day.timestamp).toLocaleDateString('en-US', { weekday: 'long' }));
    };

    const nameIcon = error ? 'exclamation' : 'check';

    return (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
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
            <View style={styles.container}>
                <TextInput style={styles.input} value={text} onChangeText={setText} placeholder="Enter todo" />
            </View>
            <View style={styles.calendarContainer}>
                <Calendar
                    onDayPress={onDayPress}
                    markedDates={{
                        [selectedDate]: { selected: true, marked: true, selectedColor: 'blue' },
                    }}
                    minDate={new Date().toISOString().split('T')[0]} // Prevent selection of past dates
                />
            </View>
            <View style={styles.container}>
                <Text style={styles.priorityText}>Priority:</Text>
                <View style={styles.priorityButtons}>
                    <Button title="Low" onPress={() => setPriority('low')} />
                    <Button title="Normal" onPress={() => setPriority('normal')} />
                    <Button title="High" onPress={() => setPriority('high')} />
                </View>
                <Text style={styles.selectedPriorityText}>Selected: {priority}</Text>
            </View>
            <View style={styles.container}>
                <Button title="Select Start Time" onPress={() => setShowStartTimePicker(true)} />
                {showStartTimePicker && (
                    <DateTimePicker
                        value={startTime}
                        mode="time"
                        is24Hour={true}
                        display="default"
                        onChange={(event, selectedTime) => {
                            setShowStartTimePicker(false);
                            if (selectedTime) {
                                setStartTime(selectedTime);
                            }
                        }}
                    />
                )}
                <Text style={styles.timeText}>Start Time: {startTime.toLocaleTimeString()}</Text>
            </View>
            <View style={styles.container}>
                <Button title="Select End Time" onPress={() => setShowEndTimePicker(true)} />
                {showEndTimePicker && (
                    <DateTimePicker
                        value={endTime}
                        mode="time"
                        is24Hour={true}
                        display="default"
                        onChange={(event, selectedTime) => {
                            setShowEndTimePicker(false);
                            if (selectedTime) {
                                setEndTime(selectedTime);
                            }
                        }}
                    />
                )}
                <Text style={styles.timeText}>End Time: {endTime.toLocaleTimeString()}</Text>
            </View>
            <UIButton
                style={{ backgroundColor: '#3498db', marginVertical: 20 }}
                title={'Add Todo'}
                onPress={handleAddTodo}
                nameIcon={nameIcon}
            />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    scrollContainer: {
        flexGrow: 1,
        padding: 20,
        backgroundColor: '#f0f0f0',
    },
    container: {
        marginVertical: 10,
    },
    input: {
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 10,
        padding: 10,
        backgroundColor: '#fff',
    },
    calendarContainer: {
        marginVertical: 20,
    },
    priorityText: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    priorityButtons: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 10,
    },
    selectedPriorityText: {
        fontSize: 16,
        color: '#555',
    },
    timeText: {
        marginTop: 10,
        fontSize: 16,
        color: '#555',
    },
});

export default AddTodo;
