
export const getCollection = /* GraphQL */`
  query GetCollection($userID: String!) {
    Collection(where:{userID:{_eq: $userID}}) {
      id
      userID
    }
  }
`;

export const getCard = /* GraphQL */`
  query GetCard($collectionID: uuid, $name:String) {
    Card(where:{
      byCollection: {id:{_eq: $collectionID}},
      name: {_eq: $name}
      }) {
        colors
        id
        name
        sets
      }
  }
`;

export const getCardSet = /* GraphQL */`
  query GetCardSet($cardID: uuid, $set_name: String){
    CardSet(where:{
      byCard: {id:{_eq: $cardId}},
      set_name:{_eq: $set_name}
    }) {
      name
      set_name
      prices
      cardID
      card_faces
      colors
      icon_uri
      id
      image_uris
      multiverse_ids
    }
  }
`

export const listCollection =/* GraphQL */`
  query ListCollection($collectionID: uuid){
    CardSet(where:{
      byCard:{
        byCollection:{
          id:{_eq: $collectionID}
        }
      }
    }) {
      id
      amount
      icon_uri
      multiverse_ids
      name
      prices
      set_name
      image_uris
      cardID
      card_faces
      colors
    }
  }
`