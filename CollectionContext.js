import React, { useState } from 'react';

export const CollectionContext = React.createContext()

export const CollectionProvider  = ({ children }) => {
    const [colorFilters, setColorFilters] = useState([])
    const [collection, setCollection] = useState({})

    return <CollectionContext.Provider value={{
        colorFilters: colorFilters,
        setCollection: setCollection,
        collection: { ...collection },
        // alphabetical: alphabeticallySorted,
        // uploadCollection: uploadCollection,
        // user: currentUser,
      }}>
    {children}
    </CollectionContext.Provider>
}