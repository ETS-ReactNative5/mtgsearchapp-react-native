import React, { useEffect, useState, useContext } from 'react';
import { StyleSheet, Text, View, Image, TextInput, TouchableOpacity, } from 'react-native';
import { Icon } from 'react-native-elements'
import { CollectionContext } from './CollectionContext';

const SetComponenets = (props) => {
    const [pressed, setIsPressed] = useState(false)

    const handleOnPress = () => {
        props.showLanguages()
        let pic = props.setinfo.card_faces !== null && props.setinfo.card_faces !==  undefined ? props.setinfo.card_faces[0].image_uris.normal : props.setinfo.image_uris.normal
        let back = props.setinfo.card_faces !== null && props.setinfo.card_faces !== undefined ? props.setinfo.card_faces[1].image_uris.normal : undefined;
        !pressed ? props.highlight(props.set) : props.highlight(undefined)
        setIsPressed(!pressed)
        props.flipArt(pic, back)
    }

    return (
        <View style={props.containerstyle}>
            <TouchableOpacity style={{
                display: 'flex',
                flexDirection: 'column',
                borderWidth: 1,
                borderColor: 'rgba(255, 0, 0, .4)',
                borderRadius: 10,
            }} onPress={() => {
                handleOnPress()
            }}>
                <Text style={props.buttonstyle}>{props.set}</Text>
            </TouchableOpacity>
        </View>
    )
}
/*
uses onSubmitEditing, an option specifically for phone keys.
*/
const AmountComponents = (props) => {
    const [amount, setAmount] = useState()

    const handleAmountChange = (event) => {
        const val = event.nativeEvent.text
        setAmount(Number(val));
        props.changeAmount(props.mtginfo.name, props.mtginfo.set_name, val)
    }
    let usd = props.mtginfo.prices.usd ? Number(props.mtginfo.prices.usd) * Number(amount) : 0.00;
    let euros = props.mtginfo.prices.eur ? Number(props.mtginfo.prices.eur) * Number(amount) : 0.00;
    let tix = props.mtginfo.prices.tix ? Number(props.mtginfo.prices.tix) * Number(amount) : 0.00;
    let foil = props.mtginfo.prices.usd_foil ? Number(props.mtginfo.prices.usd_foil) * Number(amount) : 0.00;

    useEffect(() => {
        setAmount(props.mtginfo.amount)
    }, [])

    return (
        <View style={props.highlightstyle}>
            <View className="moneyContainer" style={styles.moneyContainer}>
                <Text className="usd" style={styles.usd}>&#36;{usd.toFixed(2)}</Text>
                <Text className="euros" style={styles.euros}>&#8364;{euros.toFixed(2)}</Text>
                <Text className="tix" style={styles.tix}>T{tix.toFixed(2)}</Text>
                <Text className="foil" style={styles.foil}>F&#36;{foil.toFixed(2)}</Text>
            </View>
            <View className="amountContainer" style={styles.amountContainer}>
                <Text style={{ color: props.highlightedText }}>Amount</Text>
                <TextInput style={props.highlightedAmount}
                    defaultValue={props.mtginfo.amount > 0 ? String(props.mtginfo.amount) : ' '}
                    className="amount"
                    keyboardType='numeric'
                    onSubmitEditing={(e) => handleAmountChange(e)}
                    // onBlur = {(e) => handleAmountChange(e) }
                    ></TextInput>
            </View>
        </View>
    )
}


const Language = (props) => {

    return (
        <TouchableOpacity style={styles.languageButton} onPress={() => props.updateImage(props.foreignInfo.imageUrl, props.foreignInfo.name)}>
            <Text style={styles.languageText}>{props.foreignInfo.language}</Text>
        </TouchableOpacity>
    )
}
//(name, image, flip,  prices, sets, languages, amount)
export const NewTableRow = (props) => {
    const { colorFilters } = useContext(CollectionContext)
    const [displayName, setDisplayName] = useState(props.name)
    const [imageUri, setImageUri] = useState(false)
    const [flipUri, setFlipUri] = useState(false)
    const [frontUri, setFrontUri] = useState(false)
    const [currentSet, setCurrentSet] = useState()
    const [languagesVisible, setLanguagesVisible] = useState(false)
    const [sets, setSets] = useState([])
    const [visibility, setVisibility] = useState(true)

    useEffect(() => {
        const sortedKeys = Object.keys(props.mtginfo).sort()
        setSets(sortedKeys)
        if (props.mtginfo[sortedKeys[0]].card_faces) {
            setImageUri(props.mtginfo[sortedKeys[0]].card_faces[0].image_uris.normal)
            setFrontUri(props.mtginfo[sortedKeys[0]].card_faces[0].image_uris.normal)
            setFlipUri(props.mtginfo[sortedKeys[0]].card_faces[1].image_uris.normal)
        } else {
            setImageUri(props.mtginfo[sortedKeys[0]].image_uris.normal)
        }
    }, [])

    const updateImage = (image, name) => {
        setImageUri(image)
        setDisplayName(name)
    }

    const onImagePress = () => {
        if(flipUri) imageUri !== flipUri ? setImageUri(flipUri) : setImageUri(frontUri)
    }

    const rowHighlight = (set) => {
        setCurrentSet(set)
    }

    const flipArt = (front, back) => {
        setFrontUri(front)
        setImageUri(front)
        if (back) setFlipUri(back)
    }

    useEffect(() => {
        if (colorFilters.length) {
            console.info(colorFilters)
            const firstSet = Object.keys(props.mtginfo)[0]
            props.mtginfo[firstSet].colors.forEach(c => {
                setVisibility(colorFilters.includes(c))
            })
        } else {
            setVisibility(true)
        }
    })
   
    return (
        visibility === true && <View id={props.name + 'Container'} className='rowContainer'>
            <Text id={props.name} style={{ color: 'white' }}>{displayName}</Text>
            <View className='cardContainer' style={styles.cardContainer}>
                <View >
                    <TouchableOpacity onPress={onImagePress} style={styles.cardImageTouchableOpacity}>
                        <Image id={props.name + 'Image'} source={imageUri && { uri: imageUri }} style={styles.cardImage} ></Image>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => { props.removeRow(props.name) }} style={styles.trashButton}>
                        <Icon name='trash' type='font-awesome' />
                    </TouchableOpacity>
                </View>
                <View className='infoContainer' style={styles.infoContainer}>
                    {sets.sort().map(i =>
                        <View key={`${props.name}_set_${i}`}>
                            <SetComponenets
                                showLanguages={() => setLanguagesVisible(!languagesVisible)}
                                highlight={rowHighlight}
                                flipArt={flipArt}
                                set={i}
                                setinfo={props.mtginfo[i]}
                                key={props.name + ' ' + i}
                                buttonstyle={currentSet === i ? styles.highlightedButtonText : styles.setButtonText}
                                containerstyle={currentSet === i ? styles.highlightedButtonContainer : styles.setButtonContainer}
                            />
                            <AmountComponents
                                highlightedAmount={currentSet === i ? styles.highlightAmount : styles.amountInput}
                                changeAmount={props.changeAmount}
                                key={props.mtginfo[i].multiverse_ids[0] ? props.name + ' ' + props.mtginfo[i].multiverse_ids[0] : props.name + i}
                                mtginfo={props.mtginfo[i]}
                                highlightstyle={currentSet === i ? styles.highlightedAmountComponent : styles.amountComponent}
                                highlightedText={currentSet === i ? 'white' : 'red'}
                            />
                        </View>
                    )}
                </View>
            </View>
            {currentSet &&
                <View style={styles.languageContainer}>
                    <Language
                        updateImage={updateImage}
                        cardname={props.name}
                        foreignInfo={{
                            imageUrl: imageUri,
                            name: props.name,
                            language: 'English'
                        }}
                        key={props.name + 'English'} />
                    {props.mtginfo[currentSet].foreignNames ? 
                    props.mtginfo[currentSet].foreignNames.map(l =>
                        <Language updateImage={updateImage} cardname={props.mtginfo[currentSet].name} foreignInfo={l} key={l.name + l.language} />)
                        : 
                        (props.mtginfo[currentSet].card_faces && props.mtginfo[currentSet].card_faces[0].foreignNames) &&
                            props.mtginfo[currentSet].card_faces[0].foreignNames.map(l =>
                                <Language updateImage={updateImage} cardname={props.mtginfo[currentSet].name} foreignInfo={l} key={l.name + l.language} />)      
                    }
                </View>
            }
        </View>
    )
}

/*
#11FFFF rgba(17, 255, 255, .4) = vaporwave blue 
*/
const styles = StyleSheet.create({
    highlightedAmountComponent: {
        paddingBottom: 10,
        borderRadius: 5,
        backgroundColor: 'red',
        shadowColor: 'white',
        shadowRadius: 10,
        shadowOpacity: .4,
    },
    amountComponent: {
        paddingBottom: 10,
        borderRadius: 5
    },
    trashButton: {
        marginTop: 10,
        height: 25,
        backgroundColor: "#3da5ff",
    },
    languageText: {
        textAlign: 'center',
        padding: 10,
        color: '#11FFFF',
        textShadowRadius: 5,
        fontWeight: "700",
        letterSpacing: 1,
        borderRadius: 10,
    },
    languageButton: {
        width: '30%',
        borderColor: `rgba(17, 255, 255, .4)`,
        borderWidth: 1,
        margin: 5,
    },
    languageContainer: {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-evenly',
    },
    amountInput: {
        borderColor: 'red',
        shadowColor: 'red',
        shadowRadius: 10,
        shadowOpacity: .4,
        borderWidth: 1,
        textAlign: 'center',
        width: '60%',
        height: 18,
        marginTop: 2,
        color: 'white'
    },
    highlightAmount: {
        borderColor: 'white',
        shadowColor: 'white',
        shadowRadius: 15,
        shadowOpacity: .4,
        borderWidth: 1,
        textAlign: 'center',
        width: '60%',
        height: 18,
        marginTop: 2,
        color: 'white'
    },
    foil: {
        color: "#ffd700",
    },
    usd: {
        color: "blue",
    },
    euros: {
        color: "#77B05F",
    },
    tix: {
        color: "orange",
    },
    cardContainer: {
        display: 'flex',
        flexDirection: 'row',
        alignContent: 'space-between',
    },
    cardImage: {
        height: 210,
        width: 150,
        borderRadius: 10,
    },
    cardImageTouchableOpacity: {
        height: 210,
        width: '40%',
    },
    infoContainer: {
        width: '60%',
        padding: 10,
    },
    setButtonContainer: {
        shadowColor: 'red',
        shadowRadius: 10,
        shadowOpacity: .4,
        marginBottom: 5,
        width: `100%`,
    },
    setButtonText: {
        textAlign: 'center',
        color: "red",
    },
    highlightedButtonContainer: {
        shadowColor: 'white',
        shadowRadius: 10,
        shadowOpacity: .4,
        marginBottom: 5,
        backgroundColor: 'red',
        borderRadius: 5,
    },
    highlightedButtonText: {
        textAlign: 'center',
        color: "white"
    },
    moneyContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    amountContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-around',
        borderRadius: 5,
    }
})