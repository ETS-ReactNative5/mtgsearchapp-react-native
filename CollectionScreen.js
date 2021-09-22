import React, { useContext } from "react";
import { StyleSheet, View, ScrollView, } from 'react-native';
import { createTable } from './NewTableRow';
import { CollectionContext } from './CollectionContext';

export const CollectionScreen = () => {
    const { colorFilters, saveCollection, collection, alphabetical } = useContext(CollectionContext)

    const removeRow = (e) => {
        const newTotalCards = totalCards
        delete newTotalCards[e]
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
    }

    return (
        <>
            <ScrollView style={styles.container} scrollEnabled={true}>
                <View style={styles.buttonContainer}>
                </View>
                {createTable(collection, { colors: colorFilters, alphabetical: alphabetical }, removeRow, changeCardDataAmount)}
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