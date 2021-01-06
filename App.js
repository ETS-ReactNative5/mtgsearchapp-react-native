import React, { useState, useEffect, useContext } from 'react';
import {Button,  StyleSheet, Text, View, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { createStackNavigator } from "@react-navigation/stack"
import { NavigationContainer, StackActions, DrawerActions } from "@react-navigation/native"
import { Login, LogOut } from './Login'
import { AuthProvider, AuthContext } from './AuthContext'
import { AsyncStorage } from "react-native"
import { ColorTabs } from './Tabs/ColorTabs';
import {CollectionScreen} from './CollectionScreen'


//conditional operator can be removed, only here to prevent console error
const Stack= createStackNavigator()
//const DrawerNav= createDrawerNavigator()

// can set options={{header:()=>null}} in Stack.Screen to get rid of headers or custom components, or in Stack.Navigator for all
export default function App() {
  //header: {textAlign:'center'}, 
  //title:'Collection'
  return  (
    <AuthProvider>
      
    <NavigationContainer >
      <Stack.Navigator>
        <Stack.Screen name="Login" component={Login}/>
        {/* component={CollectionScreen} */}
        <Stack.Screen name="Collection"  component={ColorTabs} options={({navigation}) =>({
          headerLeft : () =>(<LogOut navigation={navigation}></LogOut>),
          headerRight: () => (<Button title="Filters" onPress={()=>{navigation.dispatch(DrawerActions.toggleDrawer())}}></Button>),
          headerTitleStyle :{textAlign: 'center',alignSelf:'center'}
        })
      }/>
      </Stack.Navigator>
     
    </NavigationContainer>
    
    </AuthProvider>
  )

}
