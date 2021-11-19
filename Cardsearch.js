import React from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';
import Svg, {Path} from 'react-native-svg'

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
        <TextInput {...props} style={styles.textinput} 
        onChange={(e)=>textToSearch = e.nativeEvent.text} 
        onSubmitEditing={(e) => TextChange(e)}></TextInput>
      </View>
      <TouchableOpacity style={styles.searchButton} onPress={() => handleClick()}>
        <Svg 
        width='42'
        height='42'
        viewBox='0 0 26 26'
        >
          <Path stroke="#11FFFF"
          d="M15.853 16.56c-1.683 1.517-3.911 2.44-6.353 2.44-5.243 0-9.5-4.257-9.5-9.5s4.257-9.5 9.5-9.5 9.5 4.257 9.5 9.5c0 2.442-.923 4.67-2.44 6.353l7.44 7.44-.707.707-7.44-7.44zm-6.353-15.56c4.691 0 8.5 3.809 8.5 8.5s-3.809 8.5-8.5 8.5-8.5-3.809-8.5-8.5 3.809-8.5 8.5-8.5z" />
        </Svg>
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
    marginLeft: 10,
    top: '25%',
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