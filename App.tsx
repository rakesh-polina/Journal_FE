import React, { useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
// import Icon from 'react-native-vector-icons/Ionicons'; // Import the Icon component
import Ionicons from '@react-native-vector-icons/ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Calendar from './components/Calendar';
import Home from './components/Home';
import Remainder from './components/Remainder';
import { createStackNavigator } from '@react-navigation/stack';
import CreateUser from './components/Login/CreateUser';
import LoginScreen from './components/Login/Login';
import Password from './components/Login/Password';
import EventLog from './components/EventLog';
import CreateRemainder from './components/CreateRemainder';
import Day from './components/Day';
import Profile from './components/Profile';
import HeaderButton from './components/cards/headerButton';

import storage from './src/storage';
import theme from './styles/theme';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();


const CalendarNav = () => {
    return(
        <Stack.Navigator
            screenOptions={{
            headerStyle: {
              backgroundColor: '#fff', // Header background color
              height: 65,
            },
            headerTintColor: '#000', // Header text color
            headerTitleStyle: {
                marginLeft: 10,
                //   fontWeight: 'bold', // Custom title font style
            },
            headerRight: () => <HeaderButton />,

          }}
          >
            <Stack.Screen name="Calendar" component={Calendar}/>
            <Stack.Screen name="EventLog" component={EventLog}/>
            <Stack.Screen name="Profile" component={Profile}/>
        </Stack.Navigator>
    )
}

const RemainderNav = () => {
    return(
        <Stack.Navigator
            screenOptions={{
            headerStyle: {
              backgroundColor: '#fff', // Header background color
              height: 65,
            },
            headerTintColor: '#000', // Header text color
            headerTitleStyle: {
            //   fontWeight: 'bold', // Custom title font style
                marginLeft: 10,
            },
            headerRight: () => <HeaderButton />,
          }}
          >
            <Stack.Screen name="Remainder" component={Remainder}/>
            <Stack.Screen name="CreateRemainder" component={CreateRemainder}/>
            <Stack.Screen name="Profile" component={Profile}/>
        </Stack.Navigator>
    )
}

const HomeNav = () => {
    return(
        <Stack.Navigator
        screenOptions={{
            headerStyle: {
              backgroundColor: '#fff', // Header background color
              height: 65,
            },
            headerTintColor: '#000', // Header text color
            headerTitleStyle: {
                marginLeft: 10,
                //   fontWeight: 'bold', // Custom title font style
            },
            headerRight: () => <HeaderButton />,
          }}
          >
            <Stack.Screen name="Home" component={Home}/>
            <Stack.Screen name="Day" component={Day}/>
            <Stack.Screen name="Profile" component={Profile}/>
        </Stack.Navigator>
    )
}

const MainNav = () => {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconPath, iconColor, iconSize;

                    if (route.name === 'HomeNav') {
                        iconPath = focused
                            ? require('./assets/icons/home-outline.png')
                            : require('./assets/icons/home.png');
                        iconColor = focused? theme.primary : '#000';
                        iconSize = focused? 30 : 25 ;
                    } else if (route.name === 'CalendarNav') {
                        iconPath = focused
                            ? require('./assets/icons/calendar-outline-2.png')
                            : require('./assets/icons/calendar.png');
                        iconColor = focused? theme.primary : '#000';
                        iconSize = focused? 38 : 33 ;
                    } else {
                        iconPath = focused
                            ? require('./assets/icons/notification-outline.png')
                            : require('./assets/icons/notification.png');
                        iconColor = focused? theme.primary : '#000';
                        iconSize = focused? 30 : 25 ;
                    }

                    return (
                            <Image
                                source={iconPath}
                                style={{ width: iconSize, height: iconSize,tintColor: iconColor }}
                                resizeMode="contain"
                            />
                    );
                },
                tabBarLabel: () => null,
                tabBarActiveTintColor: theme.primary,
                tabBarInactiveTintColor: '#000',
                tabBarStyle: {
                height: 90,
                paddingBottom: 10,
                paddingTop: 10,
                backgroundColor: '#f8f8f8',
                borderTopColor: '#e0e0e0',
                },
                showLabel: false,
                
                headerShown: false,
            })}
            
          >
            <Tab.Screen name="HomeNav" component={HomeNav} options={{ headerShown: false }} />
            <Tab.Screen name="CalendarNav" component={CalendarNav} options={{ headerShown: false }}/>
            <Tab.Screen name="RemainderNav" component={RemainderNav} options={{ headerShown: false }} />
        </Tab.Navigator>
            
    )
};

const App = () => {
    const [loggedIn, setLoggedIn] = useState<boolean>(false); // State to track login status
    storage.load({
            key: 'loginState',
            // autoSync: true,
            // syncInBackground: true,
            // syncParams: {
            // extraFetchOptions: {
            //     // blahblah
            // },
            // someFlag: true
            // }
        })
        .then(ret => {
            if (ret.email) {
                setLoggedIn(true);
            }
        })
        .catch(err => {
            console.warn(err.message);
            switch (err.name) {
            case 'NotFoundError':
                // TODO;
                break;
            case 'ExpiredError':
                // TODO
                break;
            }
        });


    return (
        // <Calendar/>
        <NavigationContainer>
            {!loggedIn ? (
                <Stack.Navigator
                screenOptions={{
                    headerStyle: {
                      backgroundColor: '#fff', // Header background color
                      height: 65,
                    },
                    headerTintColor: '#000', // Header text color
                    headerTitleStyle: {
                    //   fontWeight: 'bold', // Custom title font style
                    },
                  }}
                >
                 <Stack.Screen 
                 name='Login' 
                 component={LoginScreen}
                 options={{ headerShown: false }}
                 />
                <Stack.Screen name='CreateUser' component={CreateUser} />
                <Stack.Screen name='Password' component={Password} />
                <Stack.Screen name="Profile" component={Profile}/>
                <Stack.Screen 
                name='MainNav' 
                component={MainNav} 
                options={{ 
                    headerShown: false,
                    headerLeft: () => null,
                     }}/>
                </Stack.Navigator>
            ) : (
                <MainNav />
            )}
        </NavigationContainer>
    );
}

const styles = StyleSheet.create({
    icon: {
      marginTop: 32,
      paddingHorizontal: 24,
    },
    sectionTitle: {
      fontSize: 24,
      fontWeight: '600',
    },
    sectionDescription: {
      marginTop: 8,
      fontSize: 18,
      fontWeight: '400',
    },
    highlight: {
      fontWeight: '700',
    },
  });


export default App;
