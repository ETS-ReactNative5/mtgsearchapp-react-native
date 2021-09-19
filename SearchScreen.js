import React, { useState, useContext } from 'react';
import { StyleSheet, Text, View, ScrollView, ActivityIndicator } from 'react-native';
import Cardsearch from './Cardsearch';
import { createTable } from './NewTableRow';
import { ColorContext } from './App';

const MTGForeignNames = (scryCards, mtgCards) => {

  let combinedCards = scryCards && scryCards.reduce((res, item) => {
    if (res[item.name] === undefined) {
      res[item.name] = {}
    }
    res[item.name][item.set_name] = {};
    res[item.name][item.set_name].amount = 0

    item.card_faces ? (item.card_faces.map(j => j.foreignNames = []), res[item.name][item.set_name].card_faces = item.card_faces)
      : (item.foreignNames = [], res[item.name][item.set_name].image_uris = item.image_uris)

    res[item.name][item.set_name].prices = item.prices
    res[item.name][item.set_name].multiverse_ids = item.multiverse_ids
    res[item.name][item.set_name].name = item.name
    res[item.name][item.set_name].set_name = item.set_name
    res[item.name][item.set_name].icon_uri = `https://c2.scryfall.com/file/scryfall-symbols/sets/${item.set}.svg?1631505600`

    res[item.name][item.set_name].colors = item.color_identity && item.color_identity.length > 0 ? item.color_identity.map(c => c == "U" ? "Blue" : c == "B" ? "Black" : c == "G" ? "Green" : c == "R" ? "Red" : c == "W" ? "White" : "Colorless") : ["Colorless"]

    return res;
  }, {});


  if (mtgCards !== undefined) {
    mtgCards.forEach(wizardCard => {
      if (wizardCard.foreignNames && wizardCard.foreignNames.length > 0) {
        for (let cardName in combinedCards) {
          if (cardName.includes(wizardCard.name)) {
            combinedCards[cardName][wizardCard.setName].card_faces ? combinedCards[cardName][wizardCard.setName].card_faces.map(k => { k.foreignNames = wizardCard.foreignNames })
              : combinedCards[cardName][wizardCard.setName].foreignNames = wizardCard.foreignNames;
          }
        }
      }
    })
  }
  return combinedCards
}

/*
Object structure for each card entry in totalCards:
[card name]:{
  [card set] : data
}
*/
const SearchScreen = ({ navigation, route }) => {
  const [loading, setLoading] = useState(false)
  const [totalCards, setTotalCards] = useState()
  const { colorFilters, saveCollection, collection, alphabetical } = useContext(ColorContext)

  async function cardFetch(val) {
    setLoading(true)
    const scryData = await (await fetch("https://api.scryfall.com/cards/search?unique=prints&q=" + val)).json();
    const MTGdata = await (await fetch("https://api.magicthegathering.io/v1/cards?name=" + val)).json();
    const scry = scryData.data
    const mtg = MTGdata.cards

    setTotalCards(MTGForeignNames(scry, mtg))
    setLoading(false)
  }

  /*
  each individual card === totalCards[name]
  when amount is changed, can upload totalCards[name] to AWS
  */
  const changeCardDataAmount = (name, set, amountVal) => {

    setTotalCards({
      ...totalCards,
      [name]: {
        ...totalCards[name],
        [set]: {
          ...totalCards[name][set],
          amount: Number(amountVal)
        }
      },
    })

    saveCollection({
      ...collection,
      [name]: {
        ...totalCards[name],
        [set]: {
          ...totalCards[name][set],
          amount: Number(amountVal)
        }
      },
    })
  }

  const removeRow = (e) => {
    const newTotalCards = totalCards
    delete newTotalCards[e]
    setTotalCards({ ...newTotalCards })
  }

  return (
    <>
      <ScrollView style={styles.container} scrollEnabled={true}>
        <View style={styles.buttonContainer}>
          <Cardsearch multiline numberOfLines={1} style={styles.searchstyle} clickHandlerProp={cardFetch} />
        </View>
        {loading && <View><Text>...Loading</Text><ActivityIndicator size="large"></ActivityIndicator></View>}
        {createTable(totalCards, { colors: colorFilters, alphabetical: alphabetical }, removeRow, changeCardDataAmount)}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: 'row',
  },
  textinput: {
    borderColor: 'black',
    borderWidth: 1,
    width: '80%',
  },
  searchstyle: {
    flex: 1,
    height: 100,
    width: '80%',
    alignContent: 'space-around',
  },
  container: {
    height: 100,
    overflow: 'scroll',
    backgroundColor: '#753BA5',

  },
});

export { SearchScreen }