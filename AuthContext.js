import React, {useState} from "react"
import { AsyncStorage } from "react-native"

export const AuthContext = React.createContext({})

// const getLoginData = async () =>{
//     let userData =  await AsyncStorage.getItem('credentials')
//     return JSON.parse(userData)
// }

export const AuthProvider = ({children}) =>{
    //add collection to credentials, to save everything to one storage item?
    const [loginUserData, setLoginUserData] = useState({username:'', password:'', collection:{}})
    const[displayState, setDisplayState] = useState([])
    const [loggedIn, setLoggedIn] = useState(false)
    const [colorFilters, setColorFilters] = useState([])
    
// collection,
return <AuthContext.Provider value={{displayState, setDisplayState, colorFilters, loginUserData, loggedIn, login:async (id, pw)=>{
    try{
    let userData = await AsyncStorage.getItem(id)
    let data = JSON.parse(userData)
        if(data && data.password == pw){
            setLoginUserData({username:id, password:pw, collection:data.collection})
            setLoggedIn(true)
        } 
        else if(id !== undefined && pw !== undefined) {
        AsyncStorage.setItem(id, JSON.stringify({password:pw, collection:''}))
        setLoginUserData({username:id, password:pw})
        alert('New Login Created')
        setLoggedIn(true)
            }
        } catch(err){
            console.log('error',err)
        }
        //setLoginCredentials({username:data.username, password:data.password})
}, logout:()=>{
setLoggedIn(false)
setDisplayState([])
setColorFilters([])
//console.log('Logged In', loggedIn)
}, colorSelection: (color) =>{
    let currentColors=colorFilters
    //if(!colorFilters.includes(color)){
    if(!currentColors.includes(color)){
        currentColors.push(color)
    } else {
        currentColors = currentColors.filter(c=>c!==color)
    }
    
    let filteredDisplay = displayState.map(curr =>{
            let firstSet=Object.keys(curr.props.mtginfo)[0]
            if(currentColors.length > 0){
              currentColors.forEach(c=>{
                curr.props.mtginfo[firstSet].colors.includes(c) ? curr= React.cloneElement(curr, {visible:true}) : curr= React.cloneElement(curr, {visible:false}) 
            })
        } else {
            curr= React.cloneElement(curr, {visible:true})
        }
            return curr
        })
    //console.log('test', filteredDisplay)
    //console.log(displayState)
    setColorFilters(currentColors)
    setDisplayState(filteredDisplay)
    
},
}}>{children}</AuthContext.Provider>
}

// let filteredDisplay = displayState.reduce((acc, curr) =>{
    //     let firstSet=Object.keys(curr.props.mtginfo)[0]
    //     //colorFilters.forEach(c=>{
    //     currentColors.forEach(c=>{
    //         !curr.props.mtginfo[firstSet].colors.includes(c) ? curr= React.cloneElement(curr, {visible:false}) 
    //         : curr= React.cloneElement(curr, {visible:true}) 
    //     })
    //     acc.push(curr)
    //     return acc
    // },[])
    // console.log('test', filteredDisplay)

// setUser( {username: id})
    // setPassword({password:pw})
    // AsyncStorage.setItem("user", JSON.stringify(id))
    // AsyncStorage.setItem("password", JSON.stringify(pw))