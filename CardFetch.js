import React, { useState, useEffect } from "react";
//import {StyleSheet, Text, View, Button, Image, TextInput } from 'react-native';


//let searchedCards =[];
//let searchedCardsNames ={};

 const ScryFetch = (value) =>{
  //let scryCards;
  const [scryCardsState, setScryCards] = useState()
  const [MTGCardsState, setMTGCards] = useState()
  //const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

   useEffect(async ()=>{
     try{
    const scryResponse = await fetch("https://api.scryfall.com/cards/search?unique=prints&q="+value);
    const MTGresponse = await fetch("https://api.magicthegathering.io/v1/cards?name="+value);
    const scryData= await scryResponse.json();
    const MTGdata= await MTGresponse.json();
    const [scry] = scryData.data;
    const [mtg] = MTGdata.cards;
    setScryCards(scry);
    setMTGCards(mtg);
    setLoading(false)
     } catch(err){
       console.log('scryfetch error', err)
     }
  }, [])
  return {scryCardsState, MTGCardsState, loading}
 }
 //export default ScryFetch
 