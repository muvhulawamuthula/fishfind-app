import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Text } from 'react-native';

import DamListScreen from './src/screens/DamListScreen';
import DamDetailScreen from './src/screens/DamDetailScreen';
import NearbyScreen from './src/screens/NearbyScreen';
import AdvisorScreen from './src/screens/AdvisorScreen';
import { colors } from './src/theme';

const Tab = createBottomTabNavigator();
const DamsStack = createNativeStackNavigator();
const NearbyStack = createNativeStackNavigator();
const AdvisorStack = createNativeStackNavigator();

const screenOptions = {
  headerStyle: { backgroundColor: colors.surface },
  headerTintColor: colors.primary,
  headerTitleStyle: { fontWeight: '700', fontSize: 17, color: colors.textPrimary },
  headerShadowVisible: false,
  headerBackTitleVisible: false,
  contentStyle: { backgroundColor: colors.bg },
};

function DamsNavigator() {
  return (
    <DamsStack.Navigator screenOptions={screenOptions}>
      <DamsStack.Screen name="DamList" component={DamListScreen} options={{ title: 'Gauteng Dams' }} />
      <DamsStack.Screen name="DamDetail" component={DamDetailScreen} options={({ route }) => ({ title: route.params.dam.name })} />
      <DamsStack.Screen name="Advisor" component={AdvisorScreen} options={{ title: 'AI Advisor' }} />
    </DamsStack.Navigator>
  );
}

function NearbyNavigator() {
  return (
    <NearbyStack.Navigator screenOptions={screenOptions}>
      <NearbyStack.Screen name="NearbySearch" component={NearbyScreen} options={{ title: 'Nearby Dams' }} />
      <NearbyStack.Screen name="NearbyDetail" component={DamDetailScreen} options={({ route }) => ({ title: route.params.dam.name })} />
      <NearbyStack.Screen name="Advisor" component={AdvisorScreen} options={{ title: 'AI Advisor' }} />
    </NearbyStack.Navigator>
  );
}

function AdvisorNavigator() {
  return (
    <AdvisorStack.Navigator screenOptions={screenOptions}>
      <AdvisorStack.Screen name="AdvisorMain" component={AdvisorScreen} options={{ title: 'AI Advisor' }} />
    </AdvisorStack.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="light" />
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: colors.tabBar,
            borderTopWidth: 1,
            borderTopColor: colors.tabBorder,
          },
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.textMuted,
          tabBarLabelStyle: { fontSize: 11, fontWeight: '600', marginBottom: 2 },
        }}
      >
        <Tab.Screen
          name="Dams"
          component={DamsNavigator}
          options={{ tabBarIcon: () => <Text style={{ fontSize: 18 }}>🎣</Text> }}
        />
        <Tab.Screen
          name="Nearby"
          component={NearbyNavigator}
          options={{ tabBarIcon: () => <Text style={{ fontSize: 18 }}>📍</Text> }}
        />
        <Tab.Screen
          name="Advisor"
          component={AdvisorNavigator}
          options={{ tabBarIcon: () => <Text style={{ fontSize: 18 }}>🤖</Text> }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
