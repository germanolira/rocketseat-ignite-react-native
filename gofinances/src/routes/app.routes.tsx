import React from 'react';

import { Platform } from 'react-native'
import { MaterialIcons } from '@expo/vector-icons'
import { useTheme } from 'styled-components';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { TransitionPresets } from '@react-navigation/stack';

import { Dashboard } from '../screens/Dashboard';
import { Register } from '../screens/Register';
import { Resume } from '../screens/Resume';

const { Navigator, Screen } = createBottomTabNavigator(); // importando/criando o TabNavigator

export function AppRoutes() { // AppRoutes é o nome da função que será exportada
  const theme = useTheme(); // useTheme() é uma função do styled-components que retorna o tema atual
  return (
    <Navigator // Navigator cria a barra de navegação do app
      initialRouteName="Home" // Seta a rota inicial do app, o que vai ser exibiçdo quando o app for aberto
      screenOptions={({ route, navigation }) => ({ // screenOptions estiliza a barra de navegação
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
      <Screen // Screen define outra tela
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
        component={Resume}
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