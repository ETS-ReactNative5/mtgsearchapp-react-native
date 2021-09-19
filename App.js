import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { NavigationContainer, DrawerActions, getFocusedRouteNameFromRoute } from "@react-navigation/native"
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { CollectionScreen } from './CollectionScreen';
import { SearchScreen } from './SearchScreen';
import { CustomDrawerContent } from './Tabs/ColorTabs';
import { Amplify, Auth, Storage } from 'aws-amplify'
import awsmobile from './src/aws-exports'
import { withAuthenticator } from 'aws-amplify-react-native'

Amplify.configure({
  ...awsmobile,
  Analytics: {
    disabled: true,
  },
})

export const ColorContext = React.createContext()

const DrawerNav = createDrawerNavigator()
const Tab = createBottomTabNavigator();

const TabScreens = ({ navigation, route }) => {
  const [currentRoute, setCurrentRoute] = useState()

  useEffect(() => {
    setCurrentRoute(getFocusedRouteNameFromRoute(route))
  })

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
            <TouchableOpacity onPress={() => uploadCollection()} style={styles.saveCollection}>
              <Text style={styles.saveCollectionText} >Save Collection</Text>
            </TouchableOpacity>
          </View>
        ),
      })}>
      <Tab.Screen name="Search" component={SearchScreen} options={{
        headerTitleStyle: {
          color: '#11FFFF',
          textShadowColor: '#11FFFF',
          textShadowRadius: 5,
          fontWeight: 700,
          letterSpacing: '.1em',
          fontSize: 24,
          textAlign: 'center',
        }
      }} />
      <Tab.Screen name="Collection" component={CollectionScreen} options={{
        headerTitleStyle: {
          color: '#11FFFF',
          textShadowColor: 'white',
          textShadowRadius: 5,
          fontWeight: 700,
          letterSpacing: '.1em',
          fontSize: 24,
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

  const colorSelection = (color) => {
    let currentColors = colorFilters

    if (!currentColors.includes(color)) {
      currentColors.push(color)
    } else {
      currentColors = currentColors.filter(c => c !== color)
    }

    setColorFilters([...currentColors])
  }

  const uploadCollection = async () => {
    try {
      const result = await Storage.put('Collection', JSON.stringify(collection), {
        level: 'private',
        contentType: 'application/json',
        progressCallback(progress) {
          console.log(`Uploaded: ${progress.loaded}/${progress.total}`);
        }
      });
    } catch (err) {
      console.log('save error', err)
    }
  }

  useEffect(() => {
    const userinfo = async () => {
      try {
        const dledCollection = await Storage.get('Collection', {
          download: true,
          level: 'private',
          contentType: 'application/json',
          progressCallback(progress) {
            console.log(`Downloaded: ${progress.loaded}/${progress.total}`);
          }
        })
        const parsedCollection = await dledCollection.Body.text()
        setCollection(JSON.parse(parsedCollection))
      } catch (err) {
        console.log('error', err)
      }
    }
    userinfo()
  }, [])

  return (
    <ColorContext.Provider value={{
      colorFilters: colorFilters,
      saveCollection: setCollection,
      collection: { ...collection },
      alphabetical: alphabeticallySorted
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
          <DrawerNav.Screen name="Tabs" component={TabScreens} initialParams={{ uploadCollection: uploadCollection }} />
        </DrawerNav.Navigator>
      </NavigationContainer>
    </ColorContext.Provider>
  )
}

export default withAuthenticator(App)

const styles = StyleSheet.create({
  tabContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    backgroundColor: '#753BA5',
    height: '6%'
  },
  tabButton: {
    textAlign: 'center',
    justifyContent: 'center',
    width: '50%',
  },
  highlightedTabButton: {
    width: '50%',
    textAlign: 'center',
    justifyContent: 'center',
    backgroundColor: '#11FFFF',
  },
  tabText: {
    color: '#11FFFF',
    textShadowColor: '#11FFFF',
    textShadowRadius: 5,
    fontWeight: 700,
    letterSpacing: '.1em',
    fontSize: 24,
  },
  highlightedTabText: {
    color: '#753BA5',
    textShadowColor: '#753BA5',
    textShadowRadius: 5,
    fontWeight: 700,
    letterSpacing: '.1em',
    fontSize: 24,
  },
  signOutButton: {
    height: '90%',
    textAlign: 'center',
    justifyContent: 'center',
    width: '30%',
    margin: 5,
    borderRadius: 10,
    shadowColor: '#11FFFF',
    shadowRadius: 10,
    shadowOpacity: .4,
  },
  signOutText: {
    color: '#11FFFF',
    textShadowColor: 'white',
    textShadowRadius: 5,
    fontWeight: 700,
    letterSpacing: '.1em',
    fontSize: 18,
    textAlign: 'center',
  },
  filtersText: {
    color: '#11FFFF',
    textShadowColor: 'white',
    textShadowRadius: 5,
    fontWeight: 700,
    letterSpacing: '.1em',
    fontSize: 18,
  },
  filtersButton: {
    height: '90%',
    textAlign: 'center',
    justifyContent: 'center',
    width: '40%',
    margin: 3,
    borderRadius: 10,
    shadowColor: '#11FFFF',
    shadowRadius: 10,
    shadowOpacity: .4,
  },
  saveCollectionText: {
    color: '#f5b5db',
    textAlign: "center",
    textShadowColor: 'white',
    textShadowRadius: 5,
    fontWeight: 700,
    letterSpacing: '.1em',
    fontSize: 12
  },
  saveCollection: {
    alignContent: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    width: '40%',
    marginLeft: 10,
    marginTop: 3,
    height: '90%',
    borderRadius: 10,
    shadowColor: '#f5b5db',
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