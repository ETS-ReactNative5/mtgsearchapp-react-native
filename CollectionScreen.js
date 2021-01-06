import React, { useState, useEffect, useContext } from 'react';
import {Button,  StyleSheet, Text, View, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import Cardsearch from './Cardsearch';
import NewTableRow from './NewTableRow';
import { createStackNavigator } from "@react-navigation/stack"

// import {
//   createDrawerNavigator,
//   DrawerContentScrollView,
//   DrawerItemList,
//   DrawerItem,
// } from '@react-navigation/drawer';

import { AuthProvider, AuthContext } from './AuthContext'
import { AsyncStorage } from "react-native"

//conditional operator can be removed, only here to prevent console error

//const Stack= createStackNavigator()
//const DrawerNav= createDrawerNavigator()

const MTGForeignNames =(scryCards, mtgCards) =>{

  let combinedCards = scryCards ? scryCards.reduce((res, item)=>{
    if(res[item.name]===undefined){
      res[item.name]={}
    }
    res[item.name][item.set_name]={};
    item.amount=0;
    item.card_faces ? item.card_faces.map(j=>j.foreignNames=[]) : item.foreignNames=[] 
    for(let i in item){
        res[item.name][item.set_name][i]=item[i]
    }
    res[item.name][item.set_name].colors = item.colors.length > 0 ? item.colors.map(c=> c == "U" ? "Blue" : c =="B" ? "Black" : c == "G" ? "Green" : c == "R" ? "Red" : c == "W" ? "White" : "Colorless") : "Colorless"

    return res;
  },{}) : [];


  if(mtgCards !== undefined){
  mtgCards.forEach(wizardCard=>{
    if(wizardCard.foreignNames.length>0){
      for(let cardName in combinedCards){
        if(cardName.includes(wizardCard.name)){
          combinedCards[cardName][wizardCard.setName].card_faces ? combinedCards[cardName][wizardCard.setName].card_faces.map(k=>{ k.foreignNames=wizardCard.foreignNames})
          :combinedCards[cardName][wizardCard.setName].foreignNames = wizardCard.foreignNames; 
        }
      }
    }
  })
}
//console.log('combined cards', combinedCards)
  return combinedCards
}

//totalCards is combined cards object saved/manipulated outside of component to be safe from rerenders

let totalCards = {};


//place displayState in parent context (AuthContext) so filter options can adjust it
const CollectionScreen = () =>{
  const {colorFilters, displayState, setDisplayState, loginUserData, loggedIn } = useContext(AuthContext)

  const [loading, setLoading] = useState(false)
  
 useEffect(()=>{
   if(loggedIn == true){
    //console.log('logged in', loggedIn)
     getUserData()
   }  
 },[loggedIn])
 
 const getUserData= async() =>{
  try {
    let userCollectionData = await AsyncStorage.getItem(loginUserData.username)
    let userCollectionParsed= JSON.parse(userCollectionData)
    if(userCollectionParsed){
      //totalCards= userCollectionParsed.collection
      let initSort= createRow(userCollectionParsed.collection).sort((a,b)=>{
        const keyA = a.key.toUpperCase();
        const keyB = b.key.toUpperCase();
        return (keyA < keyB) ? -1 : (keyA > keyB) ? 1 : 0;
      })
    setDisplayState(initSort)
    }
   } catch(err) {
     console.log('get data error', err)
   }
 }
//save this for sorting by key purposes? change key to name
    // setDisplayState(displayData.sort((a,b)=>{
    //       const keyA = a.key.toUpperCase();
    //       const keyB = b.key.toUpperCase();
    //       return (keyA < keyB) ? -1 : (keyA > keyB) ? 1 : 0;
    //     }))
    //const sortObject = o => Object.keys(o).sort().reduce((r, k) => (r[k] = o[k], r), {})

//double check async storage    
const saveCollection = async (collect)=>{
    try {
     await AsyncStorage.setItem('collection',JSON.stringify(collect))
     await AsyncStorage.setItem(loginUserData.username, JSON.stringify({password:loginUserData.password, collection:collect}))
    } catch(err){
      console.log('save error', err)
    }
    console.log('saved collection', collect)
    //console.log('saved displayState', displayState)
}
 
 const clickPromises = (value) =>{
    //setSearchVal(value)
    cardFetch(value)
  } 
  
  async function cardFetch(val){
    setLoading(true)
    const scryResponse = await fetch("https://api.scryfall.com/cards/search?unique=prints&q="+val);
    const MTGresponse = await fetch("https://api.magicthegathering.io/v1/cards?name="+val);
    const scryData= await scryResponse.json();
    const MTGdata= await MTGresponse.json();
    const scry = scryData.data
    const mtg = MTGdata.cards
    //setCombinedCards(MTGForeignNames(scry, mtg))
    setDisplayState(createRow(MTGForeignNames(scry, mtg)))
    saveCollection(totalCards)
    setLoading(false)
  }

  const changeCardDataAmount = (name, set, amountVal)=>{
    totalCards[name][set].amount = Number(amountVal)
  }

 
  const createRow = (cardsObj)=>{
    //const sortObject = o => Object.keys(o).sort().reduce((r, k) => (r[k] = o[k], r), {})
  
     let displayComponents=[]
    
    for(let i in cardsObj){
      if(!Object.keys(totalCards).includes(i)){
        totalCards[i]= cardsObj[i]
        displayComponents.unshift(<NewTableRow visible={true} key={i} changeAmount={changeCardDataAmount} removeRow={removeRow}  name={i} mtginfo={cardsObj[i]}></NewTableRow>)
      } 
      else {
       displayComponents.push(<NewTableRow visible={true} key={i} changeAmount={changeCardDataAmount} removeRow={removeRow}  name={i} mtginfo={totalCards[i]}></NewTableRow>)
       }
    }
   
  let combinedDisplay = [...displayComponents,...displayState].reduce((acc,curr)=>{
    if(!acc.some(component=> component.key === curr.key)){
      acc.push(curr)
    }
    return acc
  },[])
  
    return combinedDisplay
    }

  const removeRow=(e) =>{
    delete totalCards[e]
    setDisplayState(createRow(totalCards))
    saveCollection(totalCards)
  }

  //FlatList instead of ScrollView?
  //wrap this in drawer navigator?
  return (
    <ScrollView  style={styles.container} scrollEnabled={true}>
    {/* <ColorTabs></ColorTabs> */}
      <View style={styles.buttonContainer}>
      <Cardsearch multiline
        numberOfLines={1} style={styles.searchstyle} clickHandlerProp={clickPromises} ></Cardsearch>
        <TouchableOpacity onPress={()=>saveCollection(totalCards)} style={{flexShrink: 1, backgroundColor:'#f5b5db',alignContent:'center',justifyContent:'center', borderRadius:10}}>
          <Text style={{textAlign:"center"}} >Save Collection</Text>
        </TouchableOpacity>
      </View>  
      {loading ? <View><Text>...Loading</Text><ActivityIndicator size="large"></ActivityIndicator>{displayState}</View> : displayState}  
          
        {/* <View style={{height:60}}></View>  */}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
    buttonContainer:{
      flexDirection:'row',
    },
    textinput:{
      borderColor: 'black',
      borderWidth: 1,
      width:'80%',
    },
    searchstyle:{
      flex:1,
      height:100,
      width:'80%',
      alignContent: 'space-around',
    },
    container: {
      top:50,
      overflow:'scroll',
    },
  });

export {CollectionScreen}