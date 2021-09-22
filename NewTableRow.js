import React, { useState } from 'react';
import { StyleSheet, Text, View, Image, TextInput, TouchableOpacity, } from 'react-native';
import { Icon } from 'react-native-elements'
// import { SvgUri, Svg, G } from 'react-native-svg'

const SetComponenets = (props) => {
    // const [svgSource, setSvgSource] = useState(undefined)
    const [pressed, setIsPressed] = useState(false)

    const handleOnPress = () => {
        let pic = props.setinfo.card_faces !== undefined ? props.setinfo.card_faces[0].image_uris.normal : props.setinfo.image_uris.normal
        let back = props.setinfo.card_faces !== undefined ? props.setinfo.card_faces[1].image_uris.normal : undefined;
        !pressed ? props.highlight(props.set) : props.highlight(undefined)
        setIsPressed(!pressed)
        props.flipArt(pic, back)
    }

    // useEffect(() => {
    //     const getSVG = async () => {
    //         try {
    //             const SVGstatus = await fetch(props.setinfo.icon_uri)
    //             if (SVGstatus.status === 200 && SVGstatus.ok === true) {
    //                 setSvgSource(SVGstatus.url.slice(0, SVGstatus.url.indexOf('?')))
    //             }
    //         } catch (err) {
    //             console.log('error getting set svg', err)
    //         }
    //     }
    //     getSVG()
    // }, [])

    return (
        <View style={props.containerstyle}>
            <TouchableOpacity style={{
                display: 'flex',
                flexDirection: 'column',
                // height: svgSource && 50,
                borderWidth: 1,
                borderColor: 'rgba(255, 0, 0, .4)',
                borderRadius: 10,
            }} onPress={() => {
                props.createLanguages(props.setinfo);
                handleOnPress()
            }}>
                <Text style={props.buttonstyle}>{props.set}</Text>
                {/* {svgSource && <Svg viewBox='0 0 200 300' preserveAspectRatio="xMinYMin slice" >
                    <G  >
                        <SvgUri uri={svgSource}  />
                    </G>
                </Svg>} */}
            </TouchableOpacity>
        </View>
    )
}

const AmountComponents = (props) => {
    const [amount, setAmount] = useState(props.mtginfo.amount)
    const handleAmountChange = (val) => {
        setAmount(val);
        props.changeAmount(props.mtginfo.name, props.mtginfo.set_name, val)
    }
    let usd = props.mtginfo.prices.usd ? Number(props.mtginfo.prices.usd) * Number(amount) : 0.00;
    let euros = props.mtginfo.prices.eur ? Number(props.mtginfo.prices.eur) * Number(amount) : 0.00;
    let tix = props.mtginfo.prices.tix ? Number(props.mtginfo.prices.tix) * Number(amount) : 0.00;
    let foil = props.mtginfo.prices.usd_foil ? Number(props.mtginfo.prices.usd_foil) * Number(amount) : 0.00;

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
                <TextInput style={props.highlightedAmount} className="amount" value={String(props.mtginfo.amount)} keyboardType='numeric' onChangeText={(e) => handleAmountChange(e)}></TextInput>
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
    const [displayName, setDisplayName] = useState(props.name)
    const [imageUri, setImageUri] = useState(false)
    const [flipUri, setFlipUri] = useState(false)
    const [frontUri, setFrontUri] = useState(false)
    const [currentSet, setCurrentSet] = useState()
    const [foreignLanguageComps, setForeignLanguageComps] = useState([])

    const sets = Object.keys(props.mtginfo);
    let image = props.mtginfo[sets[0]].card_faces ? props.mtginfo[sets[0]].card_faces[0].image_uris.normal : props.mtginfo[sets[0]].image_uris.normal;
    let flip = props.mtginfo[sets[0]].card_faces ? props.mtginfo[sets[0]].card_faces[1].image_uris.normal : '';
    let languages;

    const updateImage = (image, name) => {
        setImageUri(image)
        setDisplayName(name)
    }

    const createLanguages = (e) => {
        const english =  <Language
            updateImage={updateImage}
            cardname={props.name}
            foreignInfo={{
                imageUrl: image,
                name: props.name,
                language: 'English'
            }}
            key={props.name + 'English'} />

        languages = e.foreignNames ?
            e.foreignNames.map(l =>
                <Language updateImage={updateImage} cardname={e.name} foreignInfo={l} key={l.name + l.language} />)
            : e.card_faces && e.card_faces[0].foreignNames ?
                e.card_faces[0].foreignNames.map(l =>
                    <Language updateImage={updateImage} cardname={e.name} foreignInfo={l} key={l.name + l.language} />)
                : []

        setForeignLanguageComps([english, ...languages])
    }

    const onImagePress = () => {
        !flipUri && setFlipUri(flip)
        flipUri !== false && imageUri !== flipUri ? setImageUri(flipUri) : setImageUri(frontUri)
    }

    const rowHighlight = (set) => {
        setCurrentSet(set)
    }

    const flipArt = (front, back) => {
        setFrontUri(front)
        setImageUri(front)
        if (back) setFlipUri(back)
    }

    return (
        props.visible == true && <View id={props.name + 'Container'} className='rowContainer'>
            <Text id={props.name} style={{ color: 'white' }}>{displayName}</Text>
            <View className='cardContainer' style={styles.cardContainer}>
                <View >
                    <TouchableOpacity onPress={onImagePress} style={styles.cardImageTouchableOpacity}>
                        <Image id={props.name + 'Image'} source={!imageUri ? { uri: image } : { uri: imageUri }} style={styles.cardImage} ></Image>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => { props.removeRow(props.name) }} style={styles.trashButton}>
                        <Icon name='trash' type='font-awesome' />
                    </TouchableOpacity>
                </View>
                <View className='infoContainer' style={styles.infoContainer}>
                    {sets.map(i =>
                        <View key={`${props.name}_set_${i}`}>
                            <SetComponenets
                                createLanguages={createLanguages}
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
            <View style={styles.languageContainer}>
                {currentSet && foreignLanguageComps.map(i => i)}
            </View>
        </View>
    )
}

/*
returns an array of NewTableRow based on filter options 
*/
export const createTable = (cardsObj, filters, removeRow, changeCardDataAmount) => {
    let displayComponents = []

    for (let i in cardsObj) {
        displayComponents.push(<NewTableRow visible={true} key={i} changeAmount={changeCardDataAmount} removeRow={removeRow} name={i} mtginfo={cardsObj[i]}></NewTableRow>)
    }
    if (filters.colors.length > 0) {
        displayComponents = displayComponents.map(curr => {
            let firstSet = Object.keys(curr.props.mtginfo)[0]

            curr.props.mtginfo[firstSet].colors.forEach(c => {
                if (!filters.colors.includes(c)) curr = React.cloneElement(curr, { visible: false })
            })

            return curr
        })
    }

    displayComponents = filters.alphabetical ? displayComponents.sort((a, z) => a.props.name.localeCompare(z.props.name)) : displayComponents.sort((a, z) => z.props.name.localeCompare(a.props.name))
    return displayComponents
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