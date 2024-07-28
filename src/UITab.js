import React from 'react';
import { View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { AddTodo, TodoList, Stats } from './screens';
import { colors, fontSizes } from './constants';

const Tab = createBottomTabNavigator();

function UITab() {
    const screenOptions = ({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: 'white',
        tabBarInactiveTintColor: colors.inactive,
        tabBarActiveBackgroundColor: colors.primary,
        tabBarInactiveBackgroundColor: colors.primary,
        tabBarBackground: () => <View style={{ backgroundColor: colors.primary, flex: 1 }}></View>,
        tabBarIcon: ({ focused, color, size }) => {
            return (
                <Icon
                    style={{
                        paddingTop: 5,
                    }}
                    name={
                        route.name == 'Add todo'
                            ? 'plus'
                            : route.name == 'Todos'
                            ? 'clipboard-list'
                            : route.name == 'Stats'
                            ? 'chart-bar'
                            : ''
                    }
                    size={23}
                    color={focused ? 'white' : colors.inactive}
                />
            );
        },
    });
    return (
        //<NavigationContainer>
        <Tab.Navigator screenOptions={screenOptions}>
            <Tab.Screen name="Add todo" component={AddTodo} />
            <Tab.Screen name="Todos" component={TodoList} />
            <Tab.Screen name="Stats" component={Stats} />
            {/* Add more screens here */}
        </Tab.Navigator>
        //</NavigationContainer>
    );
}

export default UITab;
