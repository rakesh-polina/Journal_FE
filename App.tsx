import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Calendar from './components/Calendar';
import Home from './components/Home';
import Reminder from './components/Reminder/Reminder';
import { createStackNavigator } from '@react-navigation/stack';
import CreateUser from './components/Login/CreateUser';
import LoginScreen from './components/Login/Login';
import Password from './components/Login/Password';
import EventLog from './components/EventLog';
import CreateReminder from './components/Reminder/CreateReminder';
import Day from './components/Day';
import Profile from './components/Profile';
import { Text, View } from 'react-native';
import storage from './src/storage';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const CalendarNav = () => {
    return(
        <Stack.Navigator>
            <Stack.Screen name="Calendar" component={Calendar}/>
            <Stack.Screen name="EventLog" component={EventLog}/>
            <Stack.Screen name="Profile" component={Profile}/>
        </Stack.Navigator>
    )
}

const ReminderNav = () => {
    return(
        <Stack.Navigator>
            <Stack.Screen 
                name="Reminder" 
                component={Reminder} 
                initialParams={{ username: 'neel999' }} // Replace 'testUser' with the username you want to test with
            />
            <Stack.Screen name="CreateReminder" component={CreateReminder} initialParams={{ username: 'neel999' }}/>
            <Stack.Screen name="Profile" component={Profile}/>
        </Stack.Navigator>
    )
}

const HomeNav = () => {
    return(
        <Stack.Navigator>
            <Stack.Screen name="Home" component={Home}/>
            <Stack.Screen name="Day" component={Day}/>
            <Stack.Screen name="Profile" component={Profile}/>
        </Stack.Navigator>
    )
}

const MainNav = () => {
    return (
        // <Tab.Navigator>
        // Testing
        <Tab.Navigator initialRouteName="ReminderNav">
        <Tab.Screen name="HomeNav" component={HomeNav} options={{ headerShown: false }} />
        <Tab.Screen name="CalendarNav" component={CalendarNav} options={{ headerShown: false }}/>
        <Tab.Screen name="ReminderNav" component={ReminderNav} options={{ headerShown: false }} />
    </Tab.Navigator>
        
    );
};

const Voided = () =>{
    return(
        <View>
            <Text>Hey</Text>
        </View>
    )
}

const App = () => {
    // const [loggedIn, setLoggedIn] = useState<boolean>(false); // State to track login status
    const [loggedIn, setLoggedIn] = useState<boolean>(true); //testing
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
                <Stack.Navigator>
                 <Stack.Screen 
                 name='Login' 
                 component={LoginScreen}
                 options={{ headerShown: false }}
                 />
                <Stack.Screen name='CreateUser' component={CreateUser} />
                <Stack.Screen name='Password' component={Password} />
                <Stack.Screen 
                name='MainNav' 
                component={MainNav} 
                options={{ 
                    headerShown: false,
                     }}/>
                </Stack.Navigator>
            ) : (
                <MainNav />
            )}
        </NavigationContainer>
    );
}

export default App;
