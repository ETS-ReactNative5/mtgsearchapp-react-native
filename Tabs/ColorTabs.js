import React, { useContext, useState } from 'react'
import {
    createDrawerNavigator,
    DrawerContentScrollView,
    DrawerItemList,
    DrawerItem,
  } from '@react-navigation/drawer';
import { Image, ScrollView, StyleSheet, TouchableOpacity, Text, View, Easing } from 'react-native'
import { AuthProvider, AuthContext } from '../AuthContext.js'
import { CollectionScreen } from '../CollectionScreen.js'

const DrawerNav = createDrawerNavigator()
const colors = ["Black", "Blue", "Colorless", "Green", "Red", "White"]
//const dark = ["Black", "Blue", "Colorless"]

 const manaIconPath = {
  "Black" : require('../assets/mana/Black.png'),
  "Blue" : require('../assets/mana/Blue.png'),
  "Colorless" : require('../assets/mana/Colorless.png'),
  "Green" : require('../assets/mana/Green.png'),
  "Red" : require('../assets/mana/Red.png'),
  "White" : require('../assets/mana/White.png')
 }
 const manaIconColor = {
  "Black" : "#000000",
  "Blue" : "#a9dff9",
  "Colorless" : "#ccc2c0",
  "Green" : "#9ad2ad",
  "Red" : "#f9a98e",
  "White" : "#fefad4"
 }

const CustomDrawerButton = ({buttonColor}) =>{
  const {colorSelection} = useContext(AuthContext)
  const [clicked, setClicked] = useState(false)  
    
  const handlePress = (colorIdentity) =>{
      colorSelection(colorIdentity)
      setClicked(!clicked ? true : false)
    }
    //console.log('clicked',buttonColor, clicked)
    //const labelStyles = dark.includes(buttonColor) ? 'white' :'black';
    //const backgroundStyles = buttonColor !== 'Colorless' ? buttonColor.toLowerCase() : 'gray';

   //clicked ?  "white" : "black" 
  return(
    <DrawerItem
            icon={()=><Image source={manaIconPath[buttonColor]} style={styles.manaSymbolIcon} key={buttonColor + 'symbol'} style={styles.manaSymbolIcon} ></Image>}
            label={buttonColor} 
            labelStyle={{color: buttonColor == 'Black' ? "white" : clicked ?  "white" : "black"}}
            style={[ 
              {backgroundColor: clicked ? 'blue' : manaIconColor[buttonColor]}, 
              clicked ? styles.clickedDrawerButton :styles.drawerButton
            ]} 
            key={buttonColor} 
            onPress={() => handlePress(buttonColor)} > 
    </DrawerItem>
  )

}

const CustomDrawerContent = (props)=>{

    return (
      <View style={{flex:1}}>
        <Text style={styles.drawerTitle}> Filter Options</Text>
        <DrawerContentScrollView {...props}>
            {colors.map(c=> <CustomDrawerButton {...props} buttonColor={c}></CustomDrawerButton>)}
        </DrawerContentScrollView>
      </View>
      );
}

 export const ColorTabs = ()=>{
    //drawerContent={props => <CustomDrawerContent {...props}/>}
    return(
<DrawerNav.Navigator  
  drawerContentOptions={{
    activeTintColor:'pink',
    itemStyle: { height:0 },
    contentContainerStyle:'Flatlist'
  }}
    
  drawerOpenRoute= 'RightSideMenu'
    drawerCloseRoute= 'RightSideMenuClose'
    drawerToggleRoute= 'RightSideMenuToggle' drawerPosition="right" drawerContent={props => <CustomDrawerContent {...props}/>}>
     <DrawerNav.Screen name="Clear Filters?" component={CollectionScreen}></DrawerNav.Screen> 
</DrawerNav.Navigator>
    )
 }
const styles = StyleSheet.create({
  drawerTitle:{
    textAlign: 'center',
    alignSelf:'center', 
    fontSize: 24,
  },
  manaSymbolIcon:{
    height:'100%',
    width:'14%',
  },
  drawerButton :{
    width:'80%',
    marginTop:10,
    shadowOpacity: .30,
    shadowRadius: 4.65,
    shadowColor: "#000",
    elevation:7,
    shadowOffset: {
      width: 0,
      height: 3,
    },
  },
    clickedDrawerButton :{
      width:'80%',
      marginTop:10,
  }
})

