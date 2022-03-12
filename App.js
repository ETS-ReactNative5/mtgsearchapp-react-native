import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, SafeAreaView } from 'react-native';
import { NavigationContainer, DrawerActions, getFocusedRouteNameFromRoute } from "@react-navigation/native"
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { CollectionScreen } from './CollectionScreen';
import { SearchScreen } from './SearchScreen';
import { CustomDrawerContent } from './Tabs/ColorTabs';
import { Amplify, Auth } from 'aws-amplify'
import awsmobile from './aws-exports'
import { withAuthenticator } from 'aws-amplify-react-native'
import { CollectionContext } from './CollectionContext'
import { getCollection, getCard } from './graphql/queries';
import { insertCard, insertCardSet, insertCollection, updateCardSetAmount } from './graphql/mutations';
import dotenv from 'dotenv'
import { fetchQuery } from './functions/fetchQuery'
/*
1) Add update button to collection screen to check for new set printing and update prices
2) add search bar to collection screen?
3) Pagination for loading large collections.
*/
/*
WARNING: Project imported from github. This means dependencies and aws storage crednetials may be missing. This will cause error warnings on load. They will have to be installed on this platform.
*/
dotenv.config()

Amplify.configure({
  ...awsmobile,
  Analytics: {
    disabled: true,
  },
})

const endpointURL = "https://mtgcollector.hasura.app/v1/graphql"

const DrawerNav = createDrawerNavigator()
const Tab = createBottomTabNavigator();

const TabScreens = ({ route }) => {
  const [currentRoute, setCurrentRoute] = useState()

  useEffect(() => {
    setCurrentRoute(getFocusedRouteNameFromRoute(route))
  }, [route])


  return (
    <Tab.Navigator
      tabBar={({ navigation }) =>
        <SafeAreaView style={styles.tabContainer}>
          <TouchableOpacity
            style={currentRoute === 'Search' ? styles.highlightedTabButton : styles.tabButton}
            onPress={() => navigation.navigate('Search')}>
            <Text
              style={currentRoute === 'Search' ? styles.highlightedTabText : styles.tabText}
            >
              Search
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={currentRoute === 'Collection' ? styles.highlightedTabButton : styles.tabButton}
            onPress={() => navigation.navigate('Collection')}>
            <Text
              style={currentRoute === 'Collection' ? styles.highlightedTabText : styles.tabText}
            >
              Collection
            </Text>
          </TouchableOpacity>
        </SafeAreaView>
      }
      screenOptions={({ navigation }) => ({
        headerTitleAlign: 'center',
        headerStyle: {
          backgroundColor: '#753BA5',
        },
        headerRight: () => (
          <TouchableOpacity style={styles.signOutButton} title="Sign Out" onPress={() => Auth.signOut()}>
            <Text style={styles.signOutText}>Sign{"\n"}Out</Text>
          </TouchableOpacity>
        ),
        headerLeft: () => (
          <View style={styles.leftHeader}>
            <TouchableOpacity style={styles.filtersButton} title="Filters" onPress={() => { navigation.dispatch(DrawerActions.toggleDrawer()) }}>
              <Text style={styles.filtersText} >Filters</Text>
            </TouchableOpacity>
          </View>
        ),
      })}>
      <Tab.Screen name="Search" component={SearchScreen} options={{
        headerTitleStyle: {
          color: '#11FFFF',
          textShadowColor: '#11FFFF',
          textShadowRadius: 5,
          fontWeight: "700",
          letterSpacing: 1,
          fontSize: 24,
          textAlign: 'center',
        }
      }} />
      <Tab.Screen name="Collection" component={CollectionScreen} options={{
        headerTitleStyle: {
          color: '#11FFFF',
          textShadowColor: 'white',
          textShadowRadius: 5,
          fontWeight: "700",
          letterSpacing: 1,
          fontSize: 20,
          textAlign: 'center',
        }
      }} />
    </Tab.Navigator>
  )
}

/*
Tab Navigator to go between collection and search?
Could upload cards individually and automatically when amount is changed instead of saving one giant file?
*/
const App = () => {
  const [colorFilters, setColorFilters] = useState([])
  const [collection, setCollection] = useState({})
  const [alphabeticallySorted, setAlphabeticallySorted] = useState(true)
  const [userData, setUserData] = useState({ userID: '', collectionID: '' })

  const colorSelection = (color) => {
    let currentColors = colorFilters

    if (!currentColors.includes(color)) {
      currentColors.push(color)
    } else {
      currentColors = currentColors.filter(c => c !== color)
    }
    setColorFilters([...currentColors])
  }

  /*
  query card by: collectionID, name
  query card set by: cardId, set_name
  if card does exist, insert/mutate card set (with card ID as queried card ID) by field (maybe only amount?)
  if card doesn't exist, insert/mutate new card w/collectionID as userData.collectionID,
  and card sets w/cardID as newly created card id
  Postrges array notation uses {} instead of []
  arrays have to be converted to "{...args}" (ex:"{"black", "blue"}" for colrs) for Hasura Postgres DB
  */
  /* Put card query and field change in same request? */
  const uploadCollection = async (card, name, setName, field, val) => {
    try {
      const queriedCard = await fetchQuery(getCard, endpointURL, {
        collectionID: userData.collectionID,
        name: name
      }, "GetCard")
      if (queriedCard.data.Card.length > 0) {
        if (field == 'amount') {
          const updateCardSet = await fetchQuery(updateCardSetAmount, endpointURL, {
            collectionID: userData.collectionID,
            set_name: setName,
            name: name,
            amount: val
          }, "UpdateCardSetAmount")
          console.info('updated card', updateCardSet)
        }
      }
      else {
        const newCard = await fetchQuery(insertCard, endpointURL, {
          name: name,
          collectionID: userData.collectionID,
          sets: `{${Object.keys(card).join()}}`,
          colors: `{${card[setName].colors.join()}}`
        }, "InsertCard")

        /*
         instead of looping through each card set: 
         1)create a batch mutation 
         2)loop over sets, creating Aliases for each set
         3)send batched mutation in fetch request
        */
        //   const batchSetMutations = `mutation InsertCardSets {
        //       ${Object.keys(card).map((c,i) => `set${i} : insert_CardSet(objects: {amount: ${(field === 'amount' && setName === c) ? val : card[c].amount}, cardID: ${newCard.data.insert_Card.returning[0].id}, card_faces: ${card[c].card_faces ? JSON.stringify(card[c].card_faces) : []}, colors: {${card[c].colors.join()}}, icon_uri: ${card[c].icon_uri}, image_uris: ${JSON.stringify(card[c].image_uris)}, multiverse_ids: {${card[c].multiverse_ids.join()}}, name: ${name}, prices: ${JSON.stringify(card[c].prices)}, set_name: ${c}}) {
        //           returning {
        //             id
        //           }
        //         }`
        //       ).join("\n")}
        //     }`
        // const batchNewCardSets = await fetchQuery(batchSetMutations, endpointURL, {}, "InsertCardSets")
        // console.info(batchNewCardSets)

        Object.keys(card).forEach(async (c) => {
          const newCardSet = await fetchQuery(insertCardSet, endpointURL, {
            amount: (field === 'amount' && setName === c) ? val : card[c].amount, 
            cardID: newCard.data.insert_Card.returning[0].id, 
            card_faces: card[c].card_faces ? JSON.stringify(card[c].card_faces) : [], 
            colors: `{${card[c].colors.join()}}`, 
            icon_uri: card[c].icon_uri, 
            image_uris: JSON.stringify(card[c].image_uris), 
            multiverse_ids: `{${card[c].multiverse_ids.join()}}`, 
            name: name, 
            prices: JSON.stringify(card[c].prices), 
            set_name: c
          }, "InsertCardSet")
        })
      }
    }
    catch (err) {
      console.info(`Error saving card data`, err)
    }
  }

  useEffect(() => {
    const userinfo = async () => {
      try {
        const sessionData = await Auth.currentUserInfo()

        const userCollection = await fetchQuery(getCollection, endpointURL, {
          userID: sessionData.attributes.email
        }, "GetCollection")

        if (userCollection.data.Collection.length > 0) {
          const { userID, id } = userCollection.data.Collection[0]

          setUserData({
            userID: userID,
            collectionID: id
          })
          
        } else {
          const newUserCollection = await fetchQuery(insertCollection, endpointURL, {
            userID: sessionData.attributes.email
          }, "InsertCollection")

          setUserData({
            userID: sessionData.attributes.email,
            collectionID: newUserCollection.data.insert_Collection.returning[0].id
          })
        }
      }
      catch (err) {
        console.log('error', err)
      }
    }
    userinfo()
  }, [])
  // LogBox.ignoreLogs(['Setting a timer'])

  return (
    <CollectionContext.Provider value={{
      colorFilters: colorFilters,
      saveCollection: setCollection,
      collection: { ...collection },
      alphabetical: alphabeticallySorted,
      uploadCollection: uploadCollection,
      userData: userData,
    }}>
      <NavigationContainer >
        <DrawerNav.Navigator
          drawerContentOptions={{
            activeTintColor: 'pink',
            itemStyle: { height: 0 },
            contentContainerStyle: 'Flatlist'
          }}
          drawerOpenRoute='RightSideMenu'
          drawerCloseRoute='RightSideMenuClose'
          drawerToggleRoute='RightSideMenuToggle'
          drawerPosition="right"
          drawerContent={(props) => <CustomDrawerContent {...props} colorSelection={colorSelection} alphabeticalSort={setAlphabeticallySorted} alphabetical={alphabeticallySorted} />}
        >
          <DrawerNav.Screen name="Tabs" component={TabScreens} />
        </DrawerNav.Navigator>
      </NavigationContainer>
    </CollectionContext.Provider>
  )
}
// export default App
export default withAuthenticator(App)

/*
each container's backgroundColor needs to be the color of the border?
shadow is for iOS only
#753BA5 'rgba(117, 59, 165, opacity)' = vaporwave purple
#11FFFF rgba(17, 255, 255, .4) = vaporwave blue 
#f5b5db = pinkish
borders how to go around Views that are parents of Touchableopacity
*/
const styles = StyleSheet.create({
  tabContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    backgroundColor: '#753BA5',
    height: '6%',
  },
  tabButton: {
    textAlign: 'center',
    justifyContent: 'center',
    width: '50%',
  },
  tabText: {
    color: '#11FFFF',
    textShadowColor: '#11FFFF',
    textShadowRadius: 5,
    fontWeight: "700",
    letterSpacing: 1,
    fontSize: 24,
    textAlign: 'center'
  },
  highlightedTabButton: {
    width: '50%',
    textAlign: 'center',
    justifyContent: 'center',
    backgroundColor: '#11FFFF',
  },
  highlightedTabText: {
    color: '#753BA5',
    textShadowColor: '#753BA5',
    textShadowRadius: 5,
    fontWeight: "700",
    letterSpacing: 1,
    fontSize: 24,
    textAlign: 'center'
  },
  signOutButton: {
    height: '90%',
    justifyContent: 'center',
    width: '35%',
    margin: 5,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(17, 255, 255, .4)',
    shadowColor: '#11FFFF',
    shadowRadius: 10,
    shadowOpacity: .4,
  },
  signOutText: {
    color: '#11FFFF',
    textShadowColor: 'white',
    textShadowRadius: 5,
    fontWeight: "700",
    letterSpacing: 1,
    fontSize: 16,
    textAlign: 'center',
  },
  filtersText: {
    color: '#11FFFF',
    textShadowColor: 'white',
    textShadowRadius: 5,
    fontWeight: "700",
    letterSpacing: 1,
    fontSize: 16,
    textAlign: 'center',
  },
  filtersButton: {
    height: '90%',
    textAlign: 'center',
    justifyContent: 'center',
    width: '50%',
    margin: 3,
    borderWidth: 1,
    borderColor: 'rgba(17, 255, 255, .4)',
    borderRadius: 10,
    shadowColor: '#11FFFF',
    shadowRadius: 10,
    shadowOpacity: .4,
  },
  leftHeader: {
    display: 'flex',
    flexDirection: 'row',
    height: '100%',
    width: '100%',
    marginTop: 0,
  }
})