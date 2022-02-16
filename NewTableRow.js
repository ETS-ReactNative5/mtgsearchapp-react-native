import React, { useEffect, useState, useContext } from 'react';
import { StyleSheet, Text, View, Image, TextInput, TouchableOpacity, } from 'react-native';
import { Icon } from 'react-native-elements'
import { CollectionContext } from './CollectionContext';

const SetComponenets = ({showLanguages, setinfo, set, highlight, containerstyle, buttonstyle, flipArt}) => {
    const [pressed, setIsPressed] = useState(false)


    const handleOnPress = () => {
        showLanguages()
        // let pic = setinfo.card_faces !== null && setinfo.card_faces !==  undefined ? setinfo.card_faces[0].image_uris.normal : setinfo.image_uris.normal
        // let back = setinfo.card_faces !== null && setinfo.card_faces !== undefined ? setinfo.card_faces[1].image_uris.normal : undefined;
        let pic = setinfo.card_faces ? setinfo.card_faces[0].image_uris.normal : setinfo.image_uris.normal
        let back = setinfo.card_faces && setinfo.card_faces[1].image_uris.normal;
        !pressed ? highlight(set) : highlight(undefined)
        setIsPressed(!pressed)
        flipArt(pic, back)
    }

    // console.info(setinfo)
    return (
        <View style={containerstyle}>
            <TouchableOpacity style={{
                display: 'flex',
                flexDirection: 'column',
                borderWidth: 1,
                borderColor: 'rgba(255, 0, 0, .4)',
                borderRadius: 10,
            }} onPress={() => {
                handleOnPress()
            }}>
                <Text style={buttonstyle}>{set}</Text>
            </TouchableOpacity>
        </View>
    )
}
/*
uses onSubmitEditing, an option specifically for phone keys.
*/
const AmountComponents = ({changeAmount, mtginfo, highlightstyle, highlightedText, highlightedAmount}) => {
    const [amount, setAmount] = useState()

    const handleAmountChange = (event) => {
        const val = event.nativeEvent.text
        setAmount(Number(val));
        changeAmount(mtginfo.name, mtginfo.set_name, val)
    }
    let usd = mtginfo.prices.usd ? Number(mtginfo.prices.usd) * Number(amount) : 0.00;
    let euros = mtginfo.prices.eur ? Number(mtginfo.prices.eur) * Number(amount) : 0.00;
    let tix = mtginfo.prices.tix ? Number(mtginfo.prices.tix) * Number(amount) : 0.00;
    let foil = mtginfo.prices.usd_foil ? Number(mtginfo.prices.usd_foil) * Number(amount) : 0.00;

    useEffect(() => {
        setAmount(mtginfo.amount)
    }, [])

    return (
        <View style={highlightstyle}>
            <View className="moneyContainer" style={styles.moneyContainer}>
                <Text className="usd" style={styles.usd}>&#36;{usd.toFixed(2)}</Text>
                <Text className="euros" style={styles.euros}>&#8364;{euros.toFixed(2)}</Text>
                <Text className="tix" style={styles.tix}>T{tix.toFixed(2)}</Text>
                <Text className="foil" style={styles.foil}>F&#36;{foil.toFixed(2)}</Text>
            </View>
            <View className="amountContainer" style={styles.amountContainer}>
                <Text style={{ color: highlightedText }}>Amount</Text>
                <TextInput style={highlightedAmount}
                    defaultValue={mtginfo.amount > 0 ? String(mtginfo.amount) : ' '}
                    className="amount"
                    keyboardType='numeric'
                    onSubmitEditing={(e) => handleAmountChange(e)}
                    // onBlur = {(e) => handleAmountChange(e) }
                    ></TextInput>
            </View>
        </View>
    )
}


const Language = ({updateImage, foreignInfo}) => {
    return (
        <TouchableOpacity style={styles.languageButton} onPress={() => updateImage(foreignInfo.imageUrl, foreignInfo.name)}>
            <Text style={styles.languageText}>{foreignInfo.language}</Text>
        </TouchableOpacity>
    )
}

//(name, image, flip,  prices, sets, languages, amount)
export const NewTableRow = ({changeAmount, removeRow, name, mtginfo}) => {
    const { colorFilters } = useContext(CollectionContext)
    const [displayName, setDisplayName] = useState(name)
    const [imageUri, setImageUri] = useState(false)
    const [flipUri, setFlipUri] = useState(false)
    const [frontUri, setFrontUri] = useState(false)
    const [currentSet, setCurrentSet] = useState()
    const [languagesVisible, setLanguagesVisible] = useState(false)
    const [sets, setSets] = useState([])
    const [visibility, setVisibility] = useState(true)

    useEffect(() => {
        const sortedKeys = Object.keys(mtginfo).sort()
        setSets(sortedKeys)
        if (mtginfo[sortedKeys[0]].card_faces) {
            setImageUri(mtginfo[sortedKeys[0]].card_faces[0].image_uris.normal)
            setFrontUri(mtginfo[sortedKeys[0]].card_faces[0].image_uris.normal)
            setFlipUri(mtginfo[sortedKeys[0]].card_faces[1].image_uris.normal)
        } else {
            setImageUri(mtginfo[sortedKeys[0]].image_uris.normal)
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
        back && setFlipUri(back)
    }

    useEffect(() => {
        if (colorFilters.length) {
            const firstSet = Object.keys(mtginfo)[0]
            mtginfo[firstSet].colors.forEach(c => {
                setVisibility(colorFilters.includes(c))
            })
        } else {
            setVisibility(true)
        }
    })
    
    return (
        visibility === true && <View id={name + 'Container'} className='rowContainer'>
            <Text id={name} style={{ color: 'white' }}>{displayName}</Text>
            <View className='cardContainer' style={styles.cardContainer}>
                <View >
                    <TouchableOpacity onPress={onImagePress} style={styles.cardImageTouchableOpacity}>
                        <Image id={name + 'Image'} 
                        source={imageUri ? { uri: imageUri } : undefined} 
                        style={styles.cardImage} ></Image>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => { removeRow(name) }} style={styles.trashButton}>
                        <Icon name='trash' type='font-awesome' />
                    </TouchableOpacity>
                </View>
                <View className='infoContainer' style={styles.infoContainer}>
                    {sets.sort().map(i =>
                        <View key={`${name}_set_${i}`}>
                            <SetComponenets
                                showLanguages={() => setLanguagesVisible(!languagesVisible)}
                                highlight={rowHighlight}
                                flipArt={flipArt}
                                set={i}
                                setinfo={mtginfo[i]}
                                key={name + ' ' + i}
                                buttonstyle={currentSet === i ? styles.highlightedButtonText : styles.setButtonText}
                                containerstyle={currentSet === i ? styles.highlightedButtonContainer : styles.setButtonContainer}
                            />
                            <AmountComponents
                                highlightedAmount={currentSet === i ? styles.highlightAmount : styles.amountInput}
                                changeAmount={changeAmount}
                                key={mtginfo[i].multiverse_ids[0] ? name + ' ' + mtginfo[i].multiverse_ids[0] : name + i}
                                mtginfo={mtginfo[i]}
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
                        cardname={name}
                        foreignInfo={{
                            imageUrl: imageUri,
                            name: name,
                            language: 'English'
                        }}
                        key={name + 'English'} />
                    {mtginfo[currentSet].foreignNames ? 
                    mtginfo[currentSet].foreignNames.map(l =>
                        <Language updateImage={updateImage} cardname={mtginfo[currentSet].name} foreignInfo={l} key={l.name + l.language} />)
                        : 
                        (mtginfo[currentSet].card_faces && mtginfo[currentSet].card_faces[0].foreignNames) &&
                            mtginfo[currentSet].card_faces[0].foreignNames.map(l =>
                                <Language updateImage={updateImage} cardname={mtginfo[currentSet].name} foreignInfo={l} key={l.name + l.language} />)      
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