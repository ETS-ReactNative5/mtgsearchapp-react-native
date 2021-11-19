import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { NavigationContainer, DrawerActions, getFocusedRouteNameFromRoute } from "@react-navigation/native"
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { CollectionScreen } from './CollectionScreen';
import { SearchScreen } from './SearchScreen';
import { CustomDrawerContent } from './Tabs/ColorTabs';
import { Amplify, Auth, DataStore } from 'aws-amplify'
import awsmobile from './src/aws-exports'
import { withAuthenticator } from 'aws-amplify-react-native'
import { CollectionContext } from './CollectionContext'
import { Card, CardSet } from './src/models';
/*
1) Add update button to collection screen to check for new set printing and update prices
2) add search bar to collection screen?
*/
/*
WARNING: Project imported from github. This means dependencies and aws storage crednetials may be missing. This will cause error warnings on load. They will have to be installed on this platform.
*/
Amplify.configure({
  ...awsmobile,
  Analytics: {
    disabled: true,
  },
})

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
        <View style={styles.tabContainer}>
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
        </View>}
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
  const [currentUser, setCurrentUser] = useState()

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
  if a card doesn't exist in user's collection, it will be added with first argument card of uploadCollection.
  if a card needs to be updated (amount, new set printing, etc.), card name, set name, and field to update with new val need to be passed.
  */
  const uploadCollection = async (card, name, setName, field, val) => {
  
    try {
      const originalCard = await DataStore.query(Card, c => c.name("eq", name).userID('eq', currentUser))     
      if (originalCard.length) {
        const cardSetToUpdate = await DataStore.query(CardSet, s => s.set_name('eq', setName).cardID('eq', originalCard[0].id))
          await DataStore.save(CardSet.copyOf(cardSetToUpdate[0], update => {
            update[field] = val
          }))
      } else {
        const cardToAdd = await DataStore.save(
          new Card({
            "name": name,
            "userID": currentUser
          }),
        );
        Object.entries(card).forEach(async (el) => {
          await DataStore.save(
            new CardSet({
              "amount": el[1].amount,
              "card_faces": el[1].card_faces,
              "colors": el[1].colors,
              "icon_uri": el[1].icon_uri,
              "multiverse_ids": el[1].multiverse_ids,
              "name": name,
              "prices": el[1].prices,
              "set_name": el[1].set_name,
              "image_uris": el[1].image_uris,
              cardID: cardToAdd.id
            })
          )
        })
        console.info('saved new card', cardToAdd)
      }

    } catch (err) {
      console.info(`Error saving to amplify DB ${err}`)
    }
  }

  useEffect(() => {
    const userinfo = async () => {
      try {
        const sessionData = await Auth.currentUserInfo()
        setCurrentUser(sessionData.attributes.email)
        const queriedCards = (await DataStore.query(Card)).filter(c => c.userID === sessionData.attributes.email)
        const queriedCardSets = await Promise.all((queriedCards.map(async (card) => (await DataStore.query(CardSet)).filter(s => s.cardID === card.id))))
        const queriedCollection = queriedCardSets.reduce((acc, curr, index) => {
          acc[curr[0].name] = {}
          for (let i of curr) {
            acc[curr[0].name][i.set_name] = {}
            Object.assign(acc[curr[0].name][i.set_name], i)
            if (i.card_faces) {
              acc[curr[0].name][i.set_name].card_faces = JSON.parse(i.card_faces[0])
            }
          }
          return acc
        }, {})
        setCollection(queriedCollection)
      } catch (err) {
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
      user: currentUser,
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