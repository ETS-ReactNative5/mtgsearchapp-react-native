import React, { useState, useEffect, useContext } from 'react';
import { StyleSheet, Text, View, Button, TextInput, TouchableOpacity } from 'react-native';
import { AuthContext } from './AuthContext'
import { AsyncStorage } from "react-native"

const Login  =({navigation}) =>{
    const [loginName, setLoginName] = useState()
    const [loginPassword, setLoginPassword] = useState()
    const { login} = useContext(AuthContext)
    const handlePress =()=>{
        login(loginName, loginPassword)
        !loginName && !loginPassword ? alert('Login and Password Required') : !loginName ? alert("Username Required") 
        : !loginPassword ? alert("Password Required") :  navigation.navigate("Collection")
    }
    const handleUserChange =(event)=>{
        setLoginName(event)
    }
    const handlePasswordChange =(event)=>{
        setLoginPassword(event)
    }
    
    return(
        <View >
            <TextInput style={styles.loginInputs} onChangeText={(e)=>handleUserChange(e)} placeholder ="Username"></TextInput>
            <TextInput style={styles.loginInputs} onChangeText={(e)=>handlePasswordChange(e)} placeholder="Password" secureTextEntry></TextInput>
            <Button title="Submit" onPress={()=>handlePress()}></Button>
            <Button title="Clear"  onPress={()=>AsyncStorage.clear()}>Clear</Button>
        </View>
    )
}

const LogOut = ({navigation}) =>{
    const {logout} = useContext(AuthContext)
    const handlePress =()=>{
        logout();
        navigation.navigate('Login')
    }
    
    
    return(
        <View>
            <Button title="Log Out" onPress={()=>handlePress()}></Button>
        </View>
    )
    }

const styles= StyleSheet.create({
 loginInputs:{
     borderColor: 'black',
     borderWidth: 1,
     margin:10,
 }
})


export {Login, LogOut}