import React, { useContext } from "react";
import { StyleSheet, View, ScrollView, } from 'react-native';
import { NewTableRow } from './NewTableRow';
import { CollectionContext } from './CollectionContext';
import { DataStore } from '@aws-amplify/datastore';
import { Users, Card, CardSet } from './src/models';

export const CollectionScreen = () => {
    const { saveCollection, collection, alphabetical, uploadCollection } = useContext(CollectionContext)

    /*
    Add delete for DataStore(CardSet)
    */
    const removeRow = (cardName) => {
        (async function removeFromDB() {
            try {
                DataStore.delete(Card, c => c.name("eq", cardName))
                // DataStore.delete(Card, c => c.name("eq", null))//remove this later, added a null card while fucking around
            } catch (err) {
                console.info('Error deleting from DB', err)
            }
        })()
        const newTotalCards = collection
        delete newTotalCards[cardName]
        saveCollection({ ...newTotalCards })
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
        })
        uploadCollection({
            ...collection[name],
            [set]: {
                ...collection[name][set],
                amount: Number(amountVal)
            }
        }, name, set, 'amount', Number(amountVal))
    }
    return (
        <>
            <ScrollView style={styles.container} scrollEnabled={true}>
                <View style={styles.buttonContainer}>
                </View>
                {Object.keys(collection).sort((a,z)=> alphabetical ? a.localeCompare(z) : z.localeCompare(a) ).map(card => {
                    return <NewTableRow key={card} changeAmount={changeCardDataAmount} removeRow={removeRow} name={card} mtginfo={collection[card]} />;
                })}
            </ScrollView>
        </>
    )
}

const styles = StyleSheet.create({
    buttonContainer: {
        flexDirection: 'row',
    },
    container: {
        height: 100,
        overflow: 'scroll',
        backgroundColor: '#753BA5',
    },
    saveCollection: {
        backgroundColor: '#f5b5db',
        alignContent: 'center',
        justifyContent: 'center',
        borderRadius: 10
    }
})