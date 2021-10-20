import React from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';

let textToSearch;

const Cardsearch = (props) => {
  
  const TextChange = (event) => {
    textToSearch = event.nativeEvent.text;
    props.clickHandlerProp(event.nativeEvent.text)
  }

  const handleClick = () => {
    props.clickHandlerProp(textToSearch);
  }

  return (
    <View style={styles.searchContainer}>
      <View style={styles.searchTextContainer }>
        <Text style={styles.readMe}>This App searches and catalogues Magic: The Gathering cards.
          Changing the amount will add them to your collection.
          Clicking a set name will bring up different languages for each card.
        </Text>
        <TextInput {...props} style={styles.textinput} onSubmitEditing={(e) => TextChange(e)}></TextInput>
      </View>
      <TouchableOpacity style={styles.searchButton} onPress={() => handleClick()}>
        <Text style={styles.searchButtonText}>Search{"\n"}for{"\n"}Cards</Text>
      </TouchableOpacity>
    </View>
  )
}
/*
each container's backgroundColor needs to be the color of the border?
shadow is for iOS only
#753BA5/'rgba(17, 255, 255, opacity)' = vaporwave purple
#11FFFF = vaporwave blue
*/
const styles = StyleSheet.create({
  searchTextContainer:{
    display:'flex',
    flexDirection:'column',
    width:'80%',
  },
  readMe: {
    color: 'white',
    padding: 10,
  },
  searchContainer: {
    display: 'flex',
    flexDirection:'row',
    height:'60%'
  },
  searchButton: {
    textAlign: 'center',
    justifyContent: 'center',
    alignContent:'center',
    margin: 3,
    borderColor : 'rgba(17, 255, 255, .4)',
    borderWidth:1,
    borderRadius: 10,
    top: '15%',
    shadowColor: '#11FFFF',
    shadowRadius: 10,
    shadowOpacity: .4,
    width:'18.5%'
  },
  searchButtonText: {
    color: '#11FFFF',
    textShadowColor: 'white',
    textShadowRadius: 5,
    fontWeight: "700",
    letterSpacing: 1,
    fontSize: 18,
    textAlign: 'center',
  },
  textinput: {
    borderColor: 'white',
    backgroundColor: 'white',
    // height:100,
  },
  
});

export default Cardsearch