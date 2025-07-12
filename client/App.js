import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import Analysis from './pages/Analysis';
import Visualisation from './pages/Visualisation';
import Upload from './pages/Upload';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      initialRouteName="Upload"
      screenOptions={{
        headerShown: true,
        tabBarStyle: { backgroundColor: '#222'},
        tabBarActiveTintColor: '#1DCD9F',
        tabBarInactiveTintColor: '#888',
        tabBarLabelStyle: { fontWeight: 'bold', fontSize: 12, margin: 5 },
        headerStyle: {
          backgroundColor: '#222222',
        },
        headerTintColor: '#ffffff',
        headerTitleStyle: {
          fontSize: 18,
          paddingVertical: 8,
        },
      }}
    >
      <Tab.Screen name ="Upload" component={Upload} options={{title:"📣  SmartSheets", tabBarLabel: 'Upload', tabBarIcon: ({color, size}) => (<Ionicons name="attach" size={size} color={color}/>)}}/>
      <Tab.Screen name="Data Analysis" component={Analysis} options={{tabBarIcon: ({color, size}) => (<Ionicons name="analytics" size={size} color={color}/>)}}/>
      <Tab.Screen name="Data Visualisation" component={Visualisation} options={{tabBarIcon: ({color, size}) => (<Ionicons name="bar-chart-outline" size={size} color={color}/>)}}/>
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <MainTabs />
    </NavigationContainer>
  );
}
