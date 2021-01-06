import React, { useState} from 'react';
import {StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';

let textToSearch;

const Cardsearch = (props) =>{
  const TextChange = (event)=>{
    textToSearch=event;
  }

  const handleClick = () =>{
     props.clickHandlerProp(textToSearch)
    }
    
    return (
      <View style={styles.searchContainer}>
        <Text>Card Search</Text>
        <TextInput {...props} style={styles.textinput} onChangeText={(e)=>TextChange(e)}></TextInput>
        <TouchableOpacity style={styles.searchButton} onPress={()=>handleClick()}>
          <Text style={{textAlign:"center"}}>Add Card</Text>
        </TouchableOpacity>
      </View>
    )
    }

    const styles = StyleSheet.create({
      searchButton:{
        height:25,
        backgroundColor:"#3da5ff",
        width:'80%'
      },
      searchContainer:{
        width:'80%',
      },
      textinput:{
        borderColor: 'black',
        borderWidth: 1,
      },
    });

export default Cardsearch