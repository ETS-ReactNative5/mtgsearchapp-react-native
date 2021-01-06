import React, {useState, useEffect} from 'react';
import {Dimensions, StyleSheet, Text, View, Button, Image, TextInput, TouchableOpacity, TouchableHighlight } from 'react-native';
import { Icon } from 'react-native-elements'


//change style if pressed w/ternary?
//may have to pass function down from NewTableRow to highlight corresponding Amount to set clicked
//onClick={()=>{this.imgChange(); this.props.createLanguages(this.props.mtgInfo); this.props.flipArt(this.pic,flipPic)}
const SetComponenets = (props) =>{
    const handleOnPress = () =>{
        let pic= props.setinfo.card_faces !== undefined ? props.setinfo.card_faces[0].image_uris.normal : props.setinfo.image_uris.normal
        let back= props.setinfo.card_faces !== undefined ? props.setinfo.card_faces[1].image_uris.normal : undefined;
        props.highlight(props.set)
        props.flipArt(pic, back)
    }
    //console.log('set info',props.setinfo)
    //console.log('foreign names',props.setinfo.foreignNames)
    return(
        <View style={props.containerstyle}>
            <TouchableOpacity onPress={()=>{props.resetName(); props.createLanguages(props.setinfo);handleOnPress()}}>
                <Text style={props.buttonstyle}>{props.set}</Text>
            </TouchableOpacity>
        </View>
    )
}


//if amount can be manipulated here, can take it out of CardFetch data addition
//change inherited styles to make parent View change color
const AmountComponents = (props) =>{
    const [amount, setAmount] = useState(props.mtginfo.amount)
    const handleAmountChange = (val) =>{
        setAmount(val);
        props.changeAmount(props.mtginfo.name, props.mtginfo.set_name, val)
    }
    let usd = props.mtginfo.prices.usd ? Number(props.mtginfo.prices.usd)*Number(amount): 0.00;
    let euros = props.mtginfo.prices.eur ? Number(props.mtginfo.prices.eur)*Number(amount): 0.00;
    let tix = props.mtginfo.prices.tix ? Number(props.mtginfo.prices.tix)*Number(amount): 0.00;
    let foil = props.mtginfo.prices.usd_foil ? Number(props.mtginfo.prices.usd_foil)*Number(amount): 0.00;
    return(
    <View style={{backgroundColor:props.highlightstyle}}>
        <View className="moneyContainer" style={styles.moneyContainer}>
            <Text className="usd" style={styles.usd}>&#36;{usd.toFixed(2)}</Text>
            <Text className="euros" style={styles.euros}>&#8364;{euros.toFixed(2)}</Text>
            <Text className="tix" style={styles.tix}>T{tix.toFixed(2)}</Text>
            <Text className="foil" style={styles.foil}>F&#36;{foil.toFixed(2)}</Text>
        </View>
        <View className="amountContainer" style={styles.amountContainer}>
            <Text style={{color:props.highlightedText}}>Amount</Text>
            <TextInput style={styles.amountInput} className="amount" defaultValue={String(props.mtginfo.amount)} keyboardType='numeric' onChangeText={(e)=>handleAmountChange(e)}></TextInput>
        </View>
    </View>
    )
}


const Language = (props) =>{
    return(
        <TouchableOpacity style={styles.languageButton} onPress={()=>props.updateImage(props.foreignInfo.imageUrl,props.foreignInfo.name)}>
            <Text style={styles.languageText}>{props.foreignInfo.language}</Text>
        </TouchableOpacity>
    )
}
const NewTableRow = (props) =>{
    //console.log('NewTableRow props', props.removeRow)
//const NewTableRow = (name, image, flip,  prices, sets, languages, amount) =>{
//console.log(props.mtginfo)

//may need this state for setting foreign images
//may have to create complex state objects for each set to test if checked
//do something here to update the mtginfo.amount prop
const [displayName, setDisplayName] = useState(props.name)
const [imageUri, setImageUri] = useState(false)
const [flipUri, setFlipUri] = useState(false)
const [frontUri, setFrontUri] = useState(false)
const [currentSet, setCurrentSet] = useState('')
const [foreignLanguageComps, setForeignLanguageComps] = useState([])
//look into useReducer instead of complex state?
//const [cardAmounts, setCardAmount] = useState(Object.assign(...Object.keys(props.mtginfo).map(i=>({[i]:0}))))

const name = props.name;
const sets = Object.keys(props.mtginfo);
let image = props.mtginfo[sets[0]].card_faces ? props.mtginfo[sets[0]].card_faces[0].image_uris.normal : props.mtginfo[sets[0]].image_uris.normal;
let flip = props.mtginfo[sets[0]].card_faces ? props.mtginfo[sets[0]].card_faces[1].image_uris.normal : '';
let languages;
//console.log(props.mtginfo)
//add something here for flip cards
 const updateImage =(image, name) =>{
     setImageUri(image)
     setDisplayName(name)
  }


const createLanguages=(e) =>{
     languages = e.foreignNames ? e.foreignNames.map(l=><Language updateImage={updateImage} cardname={e.name} foreignInfo={l} key={l.name + l.language} />)
   : e.card_faces && e.card_faces[0].foreignNames ? e.card_faces[0].foreignNames.map(l=><Language updateImage={updateImage} cardname={e.name} foreignInfo={l} key={l.name + l.language}/>)
   : []
    setForeignLanguageComps(languages)
}

//clean this up
const onImagePress = ()=>{
    if(flipUri == false){
        setFlipUri(flip)
    }
    if (flipUri !== false && imageUri !== flipUri){
        setImageUri(flipUri)
    } else if(imageUri == flipUri){
        setImageUri(frontUri)
    }
    
}
//clean up ternary operators in SetComponents?
const rowHighlight = (set) =>{
    setCurrentSet(set)
}

const flipArt =(front, back) =>{
    setFrontUri(front)
    setImageUri(front)
    if(back) setFlipUri(back)
  }

const defaultName = () =>{
    setDisplayName(props.name)
}

//can't use onLoad to setImageUri, every time it rerenders, sets to  setIamgeUri() invoked variable
//must imbed touchable Images in TouchableOpacity components    
//clean up ternary operators in SetComponents?
//console.log('NewTableRow visible',props.name, props.visible)
    return(
      props.visible== true &&  <View id={name+'Container'} className='rowContainer'>
            <Text id={name}>{displayName}</Text>
            <View className='cardContainer' style={styles.cardContainer}>
                <View >
                    <TouchableOpacity onPress={onImagePress} style={styles.cardImageTouchableOpacity}>
                        <Image id={name+'Image'} source={!imageUri ? {uri:image} : {uri:imageUri}} style={styles.cardImage} ></Image>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={()=>{props.removeRow(props.name)}} style={styles.trashButton}>
                        <Icon name='trash' type='font-awesome'/>
                    </TouchableOpacity>
                </View>
                <View className='infoContainer' style={styles.infoContainer}>
                    {/*Combine bellow components to one map*/}
                    {/*Combine highlightedtext and highlightstyle*/}
                    {sets.map(i=><SetComponenets resetName={defaultName} createLanguages={createLanguages} highlight={()=>rowHighlight(i)} flipArt={flipArt} set={i} setinfo={props.mtginfo[i]} key={name + ' ' +i} buttonstyle={currentSet == i ?  styles.setButtonText : styles.highlightedButtonText} containerstyle={currentSet == i ? styles.setButtonContainer : styles.highlightedButtonContainer}></SetComponenets>)}
                    {sets.map(obj=><AmountComponents changeAmount={props.changeAmount} key={props.mtginfo[obj].multiverse_ids[0]? props.name + ' ' +props.mtginfo[obj].multiverse_ids[0] : props.name+obj} mtginfo={props.mtginfo[obj]} highlightstyle={currentSet == obj ?  'red' : 'white'} highlightedText={currentSet == obj ? 'white' : 'black'}></AmountComponents>)}
                </View>
            </View> 
            <View style={styles.languageContainer}>{foreignLanguageComps.map(i=>i)}</View>
        </View>
    
    )
}

export default NewTableRow

const styles = StyleSheet.create({
    trashButton:{
        marginTop:10,
        height:25,
        backgroundColor:"#3da5ff",
    },
    languageText:{
        textAlign:'center',
        padding:10
    },
    languageButton:{
        width:'30%',
        borderColor:'black',
        borderWidth:1,
        margin:5,
    },
    languageContainer:{
        display:'flex',
        flexDirection:'row',
        flexWrap:'wrap', 
        justifyContent:'space-evenly',
    },
    amountInput:{
        borderColor:'black',
        borderWidth:1,
        textAlign:'center',
        backgroundColor:'white',
        width:'60%',
        height:18,
        marginTop:2,
    },
    foil:{
        color:"#ffd700",
    },
    usd:{
        color:"blue",
    },
    euros:{
        color:"purple",
    },
    tix:{
        color:"orange",
    },
    cardContainer:{
        display:'flex',
        flexDirection:'row',
        alignContent:'space-between'
    },
    cardImage:{
        height: 210,
        width: 150,
    },
    cardImageTouchableOpacity:{
        height: 210,
        width: '40%',
    },
    //maybe change this in future to style children better, start here
    infoContainer:{
        width:'60%',
        padding:10,
    },
    setButtonContainer:{
        borderColor: 'black',
        borderWidth: 1,
        marginBottom:10,
        backgroundColor:'red',
    },
    setButtonText:{
        textAlign:'center',
        color:"white"
    },
    highlightedButtonContainer:{
        borderColor: 'black',
        borderWidth: 1,
        marginBottom:10,
        backgroundColor:'white',
    },
    highlightedButtonText:{
        textAlign:'center',
        color:"black"
    },
    moneyContainer:{
        display:'flex',
        flexDirection:'row',
        justifyContent:'space-between'
    },
    amountContainer:{
        display:'flex',
        flexDirection:'row',
        justifyContent:'space-around',
    }
})

//usd, euros, tix, owned, updateAmount func
/*
const AmountComponent = (props) =>{
    let usd, euros, tix;
     const updatePrice = (owned) =>{
        props.updateAmount(props.name, props.mtginfo.set_name, Number(owned.target.value))
        if(props.mtginfo.usd !== undefined){
        usd=Number(props.mtginfo.usd)*amount.target.value
        //this.setState({usd:Number(this.props.mtgInfo.usd)*amount.target.value})
      }
      if(this.props.mtgInfo.eur !== undefined){
        euros = Number(props.mtginfo.eur)*amount.target.value
        //this.setState({euros:Number(this.props.mtgInfo.eur)*amount.target.value})
      }
      if(this.props.mtgInfo.tix !== undefined){
        tix = Number(props.mtginfo.tix)*amount.target.value
        //this.setState({tix:Number(this.props.mtgInfo.tix)*amount.target.value})
      }
      }
      return (
          <View></View>
      )
}
*/