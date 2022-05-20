# **MTG Collector**
![React Native](https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB) ![Amazon AWS](https://img.shields.io/badge/Amazon_AWS-232F3E?style=for-the-badge&logo=amazon-aws&logoColor=white) 
![Hasura](https://camo.githubusercontent.com/f0962e80927e9ab6d06f29fd45002d361374201ca98cf3898f3b8a926c35b79b/68747470733a2f2f696d672e736869656c64732e696f2f7374617469632f76313f7374796c653d666f722d7468652d6261646765266d6573736167653d48617375726126636f6c6f723d323232323232266c6f676f3d486173757261266c6f676f436f6c6f723d314542344434266c6162656c3d)
![GraphQL](https://camo.githubusercontent.com/2e1f2dc091af830685d2057c2d4c797b639c7d1601a8d6019629272c210b707b/68747470733a2f2f696d672e736869656c64732e696f2f7374617469632f76313f7374796c653d666f722d7468652d6261646765266d6573736167653d4772617068514c26636f6c6f723d453130303938266c6f676f3d4772617068514c266c6f676f436f6c6f723d464646464646266c6162656c3d)

Magic: the Gathering collection app built in React Native

Searches for and catalogues client's Magic: the Gathering card collection.
A simple application with a screen for search results, a screen showing user's collection, and a drawer with filtering options.
Login is handle with ![Amazon AWS](https://img.shields.io/badge/Amazon_AWS-232F3E?style=for-the-badge&logo=amazon-aws&logoColor=white) Amplify Authentication.
Backend is hosted with ![Hasura](https://camo.githubusercontent.com/f0962e80927e9ab6d06f29fd45002d361374201ca98cf3898f3b8a926c35b79b/68747470733a2f2f696d672e736869656c64732e696f2f7374617469632f76313f7374796c653d666f722d7468652d6261646765266d6573736167653d48617375726126636f6c6f723d323232323232266c6f676f3d486173757261266c6f676f436f6c6f723d314542344434266c6162656c3d)

#### **Auto saving/loading**
Adding a card to a collection (by changing the "Amount" field of searched cards) or changing the amount of a card already in the user's collection will automatically save the collection.
Collections load for users after login.

- ### **Search**
Searches by card names. Renders an image, sets, prices, delete button, and languages (if applicable) for each result.
Set names are clickable and render the card art for that set and buttons for each language that card is available in. Language buttons render the card art for that set and language.
Changing the amount field associated with a card's set sends it to the user's collection.
Deleting cards from this screen removes them from search results.

- ### **Collection**
Shows the total cards a user has added to their collection.
Loads cards with previously saved amounts. Changing card amount fields saves new amount to user's collection.
Deleting cards from this screen removes them from the user's collection.

- ### **Filters Drawer**
Drawer of buttons to filter visible cards alphabetically and by colors.
Filters are applied to both collection and search results.
Accessible by button or swipe.

## Tech Stuff (How?)
- This app is built using Expo's framework.
- Authentication is handled by aws-amplify-react-native withAuthenticator() login flow. Email scope is used for user ID to query Amplify's GraphQL backend.
- ### Navigation
Navigation layout uses a Bottom Tab Navigator nested in a Drawer Navigator from @react-navigation
- ### Searches
Searches make GET requests to both the Wizards of the Coast API for foreign cards and the Scryfall API for prices and everything else. These results are filtered and combined into a new object, the children of which contain individual card data.
- ### Collections
When a card is saved to a collection, a new row is created in a table containing card set data with a foreign key linked to 
a table containing non-set specific card information, which has a foreign key linked to the collection id. Updates and deletes effect card and card set tables.
- ### Filters
Filter options are passed to a Context Provider so they can be accessed by both the search results and a user's existing collection.

## Why?
This was one of the first project ideas I ever had, back when I started out learning from freeCodeCamp, before I knew React or React native. It started as just making simple fetch requests and displaying results, but I wanted to make a collection tracker for myself, instead of downloading an existing one.
I had used ![Amazon AWS](https://img.shields.io/badge/Amazon_AWS-232F3E?style=for-the-badge&logo=amazon-aws&logoColor=white)  for hosting personal websites and ![React Native](https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB) in other projects, so I decided to see how they worked in conjunction.
Before exploring ![Amazon AWS](https://img.shields.io/badge/Amazon_AWS-232F3E?style=for-the-badge&logo=amazon-aws&logoColor=white) Amplify, I had no idea what a relational database was or how to interact with one using GraphQL, and building this out was a good exercising in understanding how databases I am unfamiliar with works. After more GraphQL experience, migrated from AWS to ![Hasura](https://camo.githubusercontent.com/f0962e80927e9ab6d06f29fd45002d361374201ca98cf3898f3b8a926c35b79b/68747470733a2f2f696d672e736869656c64732e696f2f7374617469632f76313f7374796c653d666f722d7468652d6261646765266d6573736167653d48617375726126636f6c6f723d323232323232266c6f676f3d486173757261266c6f676f436f6c6f723d314542344434266c6162656c3d) since I find Hasura easier to use.
