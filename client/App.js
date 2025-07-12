import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Analysis from './pages/Analysis';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Analysis">
        <Stack.Screen
          name="Analysis"
          component={Analysis}
          options={{
            title: 'Data Analysis',
            headerStyle: { backgroundColor: '#222222', margin: 10 },
            headerTintColor: '#ffffff',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
