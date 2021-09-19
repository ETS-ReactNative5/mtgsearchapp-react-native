import React from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';

let textToSearch;

const Cardsearch = (props) => {
  const TextChange = (event) => {
    textToSearch = event;
  }

  const handleClick = () => {
    props.clickHandlerProp(textToSearch)
  }

  return (
    <View style={styles.searchContainer}>
      <Text style={styles.readMe}>This App searches and catalogues Magic: The Gathering cards.{"\n"}
        Changing the amount will add them to your collection.{"\n"}
        Clicking a set name will bring up different languages for each card.
      </Text>
      <TextInput multiline numberOfLines={1} {...props} style={styles.textinput} onChangeText={(e) => TextChange(e)}></TextInput>
      <TouchableOpacity style={styles.searchButton} onPress={() => handleClick()}>
        <Text style={styles.searchButtonText}>Search{"\n"}for{"\n"}Cards</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  readMe: {
    color: 'white',
    padding: 10,
    gridColumn: 1,
    gridRow: 1,
  },
  searchButton: {
    textAlign: 'center',
    justifyContent: 'center',
    margin: 3,
    borderRadius: 10,
    shadowColor: '#11FFFF',
    shadowRadius: 10,
    shadowOpacity: .4,
    width: '40%',
    top: 25,
    gridColumn: 2,
    gridRow: 1 / 2,
  },
  searchContainer: {
    display: 'grid',
    gridTemplateColumns: `2fr 1fr`,
    gridTemplateRows: `.5fr 1fr`,
  },
  textinput: {
    borderColor: 'white',
    backgroundColor: 'white',
    height: 25,
    gridColumn: 1,
    gridRow: 2,
  },
  searchButtonText: {
    color: '#11FFFF',
    textShadowColor: 'white',
    textShadowRadius: 5,
    fontWeight: 700,
    letterSpacing: '.1em',
    fontSize: 18,
  },
});

export default Cardsearch