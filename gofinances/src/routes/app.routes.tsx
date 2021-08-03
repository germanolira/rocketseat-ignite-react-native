import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { Dashboard } from '../screens/Dashboard';
import { Register } from '../screens/Register';
import { TransitionPresets } from '@react-navigation/stack';

const { Navigator, Screen } = createBottomTabNavigator();

export function AppRoutes() {
  return (
    <Navigator
      initialRouteName="Home"
      screenOptions={({ route, navigation }) => ({
        headerShown: false,
        gestureEnabled: true,
        ...TransitionPresets.ModalPresentationIOS,
      })}
    >
      <Screen
        name="Listagem"
        component={Dashboard}
      />

      <Screen
        name="Cadastrar"
        component={Register}
      />

      <Screen
        name="Resumo"
        component={Register}
      />
    </Navigator>
  )
}