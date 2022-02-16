export const insertCollection = /* GraphQL */`
    mutation InsertCollection($userID: String!){
        insert_Collection(objects:{userID:$userID}) {
            returning {
                id
            }
        }
    }
`;

export const updateCardSetAmount = /* GraphQL */`
    mutation UpdateCardSetAmount($collectionID: uuid, $name: String, $set_name: String, $amount: Int) {
        update_CardSet(where: {
            byCard: {
                byCollection: {
                    id: {
                        _eq: $collectionID
                    }
                }, 
                name: {
                    _eq: $name
                    }
                }, 
            set_name: {
                _eq: $set_name
                }
            }, 
            _set: {
                amount: $amount
        }) {
        affected_rows
        returning {
            name
            set_name
            amount
        }
    }
}
`

export const insertCard = /* GraphQL */`
    mutation InsertCard($name: String, $colors:_text, $sets: _text, $collectionID: uuid){
        insert_Card(objects: {
            name: $name, 
            collectionID: $collectionID, 
            sets: $sets, 
            colors: $colors}) {
                returning {
                    collectionID
                    sets
                    name
                    colors
                    id
                }
            }
    }
`

export const insertCardSet = /* GraphQL */`
    mutation InsertCardSet($amount: Int, $colors:_text, $icon_uri: String, $multiverse_ids: _int4, $name: String, $prices: json, $set_name: String!, $image_uris: json, $cardID: uuid, $card_faces: json) {
        insert_CardSet(objects:{
            amount: $amount,
            colors: $colors,
            icon_uri :$icon_uri, 
            multiverse_ids: $multiverse_ids, 
            name:$name, 
            prices:$prices, 
            set_name:$set_name, 
            image_uris:$image_uris, 
            cardID:$cardID, 
            card_faces:$card_faces
        }){
            affected_rows
        }
    }
`

// const insertMultipleCardSets = `
//   mutation InsertCardSets($amount: Int, $colors: _text, $icon_uri: String, $multiverse_ids: _int4, $name: String, $prices: json, $set_name: String!, $image_uris: json, $cardID: uuid, $card_faces: json) {
//     set1: insert_CardSet(objects: {amount: $amount, colors: $colors, icon_uri: $icon_uri, multiverse_ids: $multiverse_ids, name: $name, prices: $prices, set_name: $set_name, image_uris: $image_uris, cardID: $cardID, card_faces: $card_faces}) {
//       returning {
//         id
//       }
//     }
//     set2: insert_CardSet(objects: {amount: $amount, colors: $colors, icon_uri: $icon_uri, multiverse_ids: $multiverse_ids, name: $name, prices: $prices, set_name: $set_name, image_uris: $image_uris, cardID: $cardID, card_faces: $card_faces}) {
//       returning {
//         id
//       }
//     }
//   }
// `;

export const deleteCardAndSets = /* GraphQL */`
    mutation DeleteCardAndSets($collectionID: uuid, $name: String){
        delete_CardSet(where:{
            byCard:{
                byCollection:{
                    id:{
                        _eq: $collectionID
                    }
                }
            },
            name:{
                _eq:$name
            }
        }) {
            affected_rows
        }
        delete_Card(where:{
            byCollection:{
                id:{
                    _eq: $collectionID
                }
            },
            name:{
                _eq:$name
            }
            }) {
            affected_rows
        }
    }
`