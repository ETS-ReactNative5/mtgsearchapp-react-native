# **MTG Collector**
![React Native](https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB) ![Amazon AWS](https://img.shields.io/badge/Amazon_AWS-232F3E?style=for-the-badge&logo=amazon-aws&logoColor=white) 

Magic: the Gathering collection app built in React Native

Searches for and catalogues client's Magic: the Gathering card collection.
A simple application with a screen for search results, a screen showing user's collection, and a drawer with filtering options.
Login is handle with ![Amazon AWS](https://img.shields.io/badge/Amazon_AWS-232F3E?style=for-the-badge&logo=amazon-aws&logoColor=white) Amplify Autheication.
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
- ### Collection Mutation
When a card is saved to a collection, a table containing data for each set is asscoiated with a card table that has a field with the user ID, uniquely identifying each card and set data to individual users across the whole database.
- ### Filters
Filter options are passed to a Context Provider so they can be accessed by both the search results and a user's existing collection.

## Why?
This was one of the first project ideas I ever had, back when I started out learning from freeCodeCamp, before I knew React or React native. It started as just making simple fetch requests and displaying results, but I wanted to make a collection tracker for myself, instead of downloading an existing one.
I had used ![Amazon AWS](https://img.shields.io/badge/Amazon_AWS-232F3E?style=for-the-badge&logo=amazon-aws&logoColor=white)  for hosting personal websites and ![React Native](https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB) in other projects, so I decided to see how they worked in conjunction.
Before exploring ![Amazon AWS](https://img.shields.io/badge/Amazon_AWS-232F3E?style=for-the-badge&logo=amazon-aws&logoColor=white) Amplify, I had no idea what a relational database was or how to interact with one using GraphQL (meaning this app's backend is almost certainly not configured optimally), and building this out was a good exercising in understanding how databases I am unfamiliar with works.

