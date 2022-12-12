import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import { NavigationContainer, DefaultTheme, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './screens/HomeScreen';
import LoginScreen from './screens/LoginScreen';
import AddNewShoeScreen from './screens/AddNewShoeScreen';
import QRScannerScreen from './screens/QRScannerScreen';
import { icons, COLORS, SIZES, FONTS } from './constants';



const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    border: "transparent"
  }
}

const Stack = createNativeStackNavigator();

const App = () => {
  
  

  return (
    
    
      <NavigationContainer theme={theme}>
        
        <Stack.Navigator
        //initialRouteName={'Login'}
        >
          
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{
              title: "SHOE COLLECTION",
              headerTintColor: COLORS.lightGray,
              headerTitleStyle: {
                ...FONTS.navTitle
              },
              headerLeft: ({ onPress }) => (
                <TouchableOpacity
                style={{ marginLeft: SIZES.padding }}
                  onPress={onPress}
                >
                  <Image
                  source={icons.menu}
                  resizeMode="contain"
                  style={{
                    width: 25,
                    height: 25
                  }}
                  />
                </TouchableOpacity>
              ),
              headerRight: ({}) => (
                <TouchableOpacity
                style={{ marginRight: SIZES.padding }}

                >
                  <Image
                  source={icons.search}
                  resizeMode="contain"
                  style={{
                    width: 30,
                    height: 30
                  }}
                  />
                </TouchableOpacity>
              )

            }}
          />
  
          <Stack.Screen
            options={{headerShown: false}}
            name="Login"
            component={LoginScreen}
          />
          <Stack.Screen
            options={{headerShown: true}}
            name="Add New Shoe"
            component={AddNewShoeScreen}
          />
          <Stack.Screen
            options={{headerShown: true}}
            name="QR Scanner"
            component={QRScannerScreen}
          />
        </Stack.Navigator>
        
      </NavigationContainer>
  )
}

export default () => {
  return <App />;
};

// export default function App() {
//   return (
//     <NavigationContainer>
//       <Stack.Navigator>
//         <Stack.Screen options={{headerShown: false}} name="Login" component={LoginScreen} />
//         <Stack.Screen name="Home" component={HomeScreen} />
//       </Stack.Navigator>
//     </NavigationContainer>
//   );
// }

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
