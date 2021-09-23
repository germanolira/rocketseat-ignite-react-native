import React from 'react';
import { Platform } from 'react-native'
import { MaterialIcons } from '@expo/vector-icons'
import { useTheme } from 'styled-components';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { Dashboard } from '../screens/Dashboard';
import { Register } from '../screens/Register';
import { TransitionPresets } from '@react-navigation/stack';

const { Navigator, Screen } = createBottomTabNavigator();

export function AppRoutes() {
  const theme = useTheme();
  return (
    <Navigator
      initialRouteName="Home"
      screenOptions={({ route, navigation }) => ({
        tabBarActiveTintColor: theme.colors.secondary,
        tabBarInactiveTintColor: theme.colors.text,
        tabBarLabelPosition: 'beside-icon',
        tabBarStyle: {
          width: '100%',
          height: 75,
          paddingVertical: Platform.OS === 'ios' ? 20 : 0,
        },
        headerShown: false,
        gestureEnabled: true,
        ...TransitionPresets.ModalPresentationIOS,
      })}
    >
      <Screen
        name="Listagem"
        component={Dashboard}
        options={{
          tabBarIcon: (({ color, size }) => (
            <MaterialIcons
              name="format-list-bulleted"
              size={size}
              color={color}
            />

          ))
        }}
      />

      <Screen
        name="Cadastrar"
        component={Register}
        options={{
          tabBarIcon: (({ color, size }) => (
            <MaterialIcons
              name="attach-money"
              size={size}
              color={color}
            />

          ))
        }}
      />

      <Screen
        name="Resumo"
        component={Register}
        options={{
          tabBarIcon: (({ color, size }) => (
            <MaterialIcons
              name="pie-chart"
              size={size}
              color={color}
            />

          ))
        }}
      />
    </Navigator>
  )
}