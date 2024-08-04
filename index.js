var express = require('express');
var { graphqlHTTP } = require('express-graphql');
var { buildSchema } = require('graphql');

// Sample restaurant data
var restaurants = [
    {
        "id": 1,
        "name": "Restaurant A",
        "cuisine": "Italian",
        "location": "New York",
        "rating": 4.5
    },
    {
        "id": 2,
        "name": "Restaurant B",
        "cuisine": "Chinese",
        "location": "San Francisco",
        "rating": 4.0
    }
];

// Construct a schema, using GraphQL schema language
var schema = buildSchema(`
  type Query {
    restaurant(id: ID!): Restaurant
    restaurants: [Restaurant]
  },
  type Mutation {
    setrestaurant(name: String!, cuisine: String!, location: String!, rating: Float!): Restaurant
    Deleterestaurant(id: ID!): String
    editrestaurant(id: ID!, name: String, cuisine: String, location: String, rating: Float): Restaurant
  },
  type Restaurant {
    id: ID
    name: String
    cuisine: String
    location: String
    rating: Float
  }
`);

// The root provides a resolver function for each API endpoint
var root = {
    restaurant: ({ id }) => restaurants.find(restaurant => restaurant.id == id),
    restaurants: () => restaurants,
    setrestaurant: ({ name, cuisine, location, rating }) => {
        const newRestaurant = {
            id: restaurants.length + 1,
            name,
            cuisine,
            location,
            rating
        };
        restaurants.push(newRestaurant);
        return newRestaurant;
    },
    Deleterestaurant: ({ id }) => {
        const index = restaurants.findIndex(restaurant => restaurant.id == id);
        if (index === -1) return "Restaurant not found";
        restaurants.splice(index, 1);
        return "Restaurant deleted";
    },
    editrestaurant: ({ id, name, cuisine, location, rating }) => {
        const restaurant = restaurants.find(restaurant => restaurant.id == id);
        if (!restaurant) return null;
        if (name) restaurant.name = name;
        if (cuisine) restaurant.cuisine = cuisine;
        if (location) restaurant.location = location;
        if (rating) restaurant.rating = rating;
        return restaurant;
    }
};

var app = express();
app.use('/graphql', graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,
}));
app.listen(4000);
console.log('Running a GraphQL API server at http://localhost:4000/graphql');

