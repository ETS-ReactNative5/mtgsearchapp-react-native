import React, { useContext, useEffect } from "react";
import { StyleSheet, View, FlatList } from 'react-native';
import { NewTableRow } from './NewTableRow';
import { CollectionContext } from './CollectionContext';
import { fetchQuery } from "./functions/fetchQuery";
import { listCollection } from "./graphql/queries";
import { deleteCardAndSets } from "./graphql/mutations";

const endpointURL = "https://mtgcollector.hasura.app/v1/graphql"
/*
returns uppercase alphabet array. i + 97 would be lowercase.
keep incase of future pagination implementation needs.
*/
// const alphabet = [...Array(26).keys()].map((_, i) => String.fromCharCode(i + 65))
// loadCounter, setLoadCounter, keep these for future pagination options? 
const queryCollection = async (collectionID, collection, saveCollection) => {
    try {
        const cardlist = await fetchQuery(listCollection, endpointURL, {
            collectionID: collectionID
        }, "ListCollection")
        // /*
        // card_faces, prices, and image_uris need JSON.parse()
        // */
        const formattedCardlist = cardlist.data.CardSet.reduce((acc, curr) => {
            if (!acc[curr.name]) acc[curr.name] = {}
            const { card_faces, prices, image_uris, ...setData } = curr
            Object.assign(acc[curr.name], {
                [curr.set_name]: {
                    ...setData,
                    card_faces: card_faces.length > 0 && JSON.parse(card_faces),
                    prices: JSON.parse(prices),
                    image_uris: JSON.parse(image_uris)
                }
            })
            return acc
        }, {})
        saveCollection({ ...collection, ...formattedCardlist })
    }
    catch (err) {
        console.log('Error, no collection found:', err)
    }

}

export const CollectionScreen = () => {
    const { saveCollection, collection, alphabetical, uploadCollection, userData } = useContext(CollectionContext)
    /*
    delete will have to delete both Card and CardSet from database.
    batch CardSet deletes.
    can potentially batch both Card and CardSet deletes into one resolver and request.
    */
    const removeRow = async (cardName) => {
            try {
                const removeCardAndSets = await fetchQuery(deleteCardAndSets, endpointURL, {
                    collectionID: userData.collectionID,
                    name: cardName
                }, "DeleteCardAndSets")
                // console.info(removeCardAndSets)
                const newTotalCards = collection
                delete newTotalCards[cardName]
                saveCollection({ ...newTotalCards })
            } catch (err) {
                console.info('error', err)
            }
    }
    /*
    each individual card === totalCards[name]
    when amount is changed, can upload totalCards[name] to AWS
    */
    const changeCardDataAmount = (name, set, amountVal) => {
        saveCollection({
            ...collection,
            [name]: {
                ...collection[name],
                [set]: {
                    ...collection[name][set],
                    amount: Number(amountVal)
                }
            },
        });
        uploadCollection({
            ...collection[name],
            [set]: {
                ...collection[name][set],
                amount: Number(amountVal)
            }
        }, name, set, 'amount', Number(amountVal))
    }

    useEffect(() => {
        queryCollection(userData.collectionID, collection, saveCollection)
    }, [])

    // const handleScroll = () => {
    //     if (loadCounter <= alphabet.length) {
    //         queryCollection(loadCounter, setLoadCounter, userData.collectionID, collection, saveCollection)
    //     }
    //     console.log('scroll done')
    // }

    return (
        <>
            <View
            >
                {/* <View style={styles.buttonContainer}></View> */}
                {collection && <FlatList data={Object.keys(collection).sort((a, z) => alphabetical
                    ? a.localeCompare(z)
                    : z.localeCompare(a)).map(card => collection[card]
                    )
                }
                    renderItem={({ item }) =>
                        <NewTableRow changeAmount={changeCardDataAmount} removeRow={removeRow} name={item[Object.keys(item)[0]].name} mtginfo={item} />
                    }
                    keyExtractor={(item) => `${item[Object.keys(item)[0]].name}_${Object.keys(item)[0]}`}
                    style={styles.container}
                    initialNumToRender={10}
                />}
            </View>
        </>
    )
}



const styles = StyleSheet.create({
    buttonContainer: {
        flexDirection: 'row',
    },
    container: {
        height: '100%',
        overflow: 'scroll',
        backgroundColor: '#753BA5',
    },
})