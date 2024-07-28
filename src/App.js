import React from 'react';
import { Provider } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { store } from './redux/store';

import TodoList from './screens/todos/TodoList';
import AddTodo from './screens/AddTodo';
import { Login, Register, Welcome } from './screens';
import UITab from './UITab';

const Stack = createStackNavigator();

const App = () => {
    return (
        <Provider store={store}>
            <NavigationContainer>
                <Stack.Navigator
                    initialRouteName="Welcome"
                    screenOptions={{
                        headerShown: false,
                    }}
                >
                    <Stack.Screen name="Welcome" component={Welcome} />
                    <Stack.Screen name="Login" component={Login} />
                    <Stack.Screen name="Register" component={Register} />
                    <Stack.Screen name="UITab" component={UITab} />
                    <Stack.Screen name="TodoList" component={TodoList} />
                    <Stack.Screen name="AddTodo" component={AddTodo} />
                </Stack.Navigator>
            </NavigationContainer>
        </Provider>
    );
};

export default App;
