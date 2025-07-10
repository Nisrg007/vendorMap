// App.tsx - Main Application Entry Point
import React, { JSX } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StyleSheet, ViewStyle } from 'react-native';

//Paths can be changed remember to change this
import MapScreen from './src/features/vendorMap/screens/VendorMapScreen'; 
import { DataProvider } from './src/features/vendorMap/services/DataProvider';

// Define the tab navigator type so entry poit know our screens
type RootTabParamList = {
  Map: undefined;
};

const Tab = createBottomTabNavigator<RootTabParamList>();

export default function App(): JSX.Element {
  return (
    <GestureHandlerRootView style={styles.container}>
      <SafeAreaProvider>
        <DataProvider>
          <NavigationContainer>
            <Tab.Navigator screenOptions={{ headerShown: false }}>
              <Tab.Screen name="Map" component={MapScreen} />
            </Tab.Navigator>
          </NavigationContainer>
        </DataProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
  } as ViewStyle,
});


