import React, { useState } from 'react'
import {
  DrawerContentScrollView,
  DrawerItem,
} from '@react-navigation/drawer';
import { Image, StyleSheet, Text, View } from 'react-native'
import { decode } from 'html-entities';

const colors = ["Black", "Blue", "Colorless", "Green", "Red", "White"]

const manaIconPath = {
  "Black": require('../assets/mana/Black.png'),
  "Blue": require('../assets/mana/Blue.png'),
  "Colorless": require('../assets/mana/Colorless.png'),
  "Green": require('../assets/mana/Green.png'),
  "Red": require('../assets/mana/Red.png'),
  "White": require('../assets/mana/White.png')
}
const manaIconColor = {
  "Black": "#000000",
  "Blue": "#a9dff9",
  "Colorless": "#ccc2c0",
  "Green": "#9ad2ad",
  "Red": "#f9a98e",
  "White": "#fefad4"
}

export const CustomDrawerContent = ({ colorSelection, alphabeticalSort, alphabetical }) => {

  return (
    <View style={styles.drawerContainer}>
      <Text style={styles.drawerTitle}> Filter Options</Text>
      <DrawerContentScrollView >
        {colors.map(c => <CustomDrawerButton key={c} colorSelection={colorSelection} buttonColor={c}></CustomDrawerButton>)}
        <AlphabetSortButton alphabetical={alphabetical} alphabeticalSort={alphabeticalSort} />
      </DrawerContentScrollView>
    </View>
  );
}

const CustomDrawerButton = ({ colorSelection, buttonColor }) => {
  const [clicked, setClicked] = useState(false)

  const handlePress = (colorIdentity) => {
    colorSelection(colorIdentity)
    setClicked(!clicked ? true : false)
  }
  return (
    <DrawerItem
      icon={() => <Image source={manaIconPath[buttonColor]} style={styles.manaSymbolIcon} key={buttonColor + 'symbol'} style={styles.manaSymbolIcon} ></Image>}
      label={buttonColor}
      labelStyle={{ color: buttonColor == 'Black' ? "white" : clicked ? "white" : "black" }}
      style={[
        { backgroundColor: clicked ? 'blue' : manaIconColor[buttonColor] },
        clicked ? styles.clickedDrawerButton : styles.drawerButton
      ]}
      key={buttonColor}
      onPress={() => handlePress(buttonColor)} />
  )
}

const AlphabetSortButton = ({ alphabetical, alphabeticalSort }) => {
  const arrow = decode('&rarr;', { level: 'html5' })

  return (
    <DrawerItem
      label={() => <Text
        style={{
          color: alphabetical ? 'black' : '#D8008D',
          textAlign: 'center',
          fontSize: 18,
          fontWeight: 700,
          textShadowColor: alphabetical ? '#13081C' : '#D8008D',
          textShadowRadius: 5,
        }}>
        {alphabetical ? `A${arrow}Z` : `Z${arrow}A`}
      </Text>}
      style={[
        { backgroundColor: alphabetical ? '#F15AD4' : 'black' },
        alphabetical ? styles.drawerButton : styles.clickedDrawerButton
      ]}
      key={`alphabetical sort`}
      onPress={() => alphabeticalSort(!alphabetical)}
    />
  )
}

const styles = StyleSheet.create({
  drawerContainer: {
    backgroundColor: '#451F6E',
    flex: 1
  },
  drawerTitle: {
    textAlign: 'center',
    alignSelf: 'center',
    fontSize: 24,
    color: 'white'
  },
  manaSymbolIcon: {
    height: '100%',
    width: '14%',
  },
  drawerButton: {
    width: '80%',
    marginTop: 10,
    shadowOpacity: .30,
    shadowRadius: 4.65,
    shadowColor: "#000",
    elevation: 7,
    shadowOffset: {
      width: 0,
      height: 3,
    },
  },
  clickedDrawerButton: {
    width: '80%',
    marginTop: 10,
  }
})

