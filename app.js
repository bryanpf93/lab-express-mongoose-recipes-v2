const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose")

const Recipe = require("./models/Recipe.model")

mongoose.set('runValidators', true);

const app = express();

// MIDDLEWARE

app.use(logger("dev"));
app.use(express.static("public"));
app.use(express.json());


// Iteration 1 - Connect to MongoDB
// DATABASE CONNECTION

const MONGODB_URI = "mongodb://127.0.0.1:27017/express-mongoose-recipes-dev"

mongoose
    .connect(MONGODB_URI)
    .then((x) => console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`))
    .catch((err) => console.error("Error connecting to mongo", err));


// ROUTES
//  GET  / route - This is just an example route
app.get('/', (req, res) => {
    res.send("<h1>LAB | Express Mongoose Recipes</h1>");
});


//  Iteration 3 - Create a Recipe route
//  POST  /recipes route

app.post("/recipes", (req, res, next) => {

    const newRecipe = req.body

    Recipe
        .create(newRecipe)
        .then((recipeFromDB) => {
            res.status(201).json(recipeFromDB)
            console.log("success!")
        })
        .catch((err) => {
            console.log("error creating a new recipe...", err)
            res.status(500).json({ error: "Error creating a new recipe in the DB..." })
        })

})

// app.post("/recipes", async (req, res, next) => {

//     const newRecipe = req.body

//     try {
//         const recipeFromDB = await Recipe.create(newRecipe)
//         res.status(201).json(recipeFromDB)
//         console.log("success!")
//     } catch (err) {
//         console.log("error creating a new recipe...", err)
//         res.status(500).json({ error: "Error creating a new recipe in the DB..." })
//     }

// })

//  Iteration 4 - Get All Recipes
//  GET  /recipes route

app.get("/recipes", (req, res, next) => {

    let filter = {}

    Recipe
        .find(filter)
        .then((recipeFromDB) => {
            res.json(recipeFromDB)
        })
        .catch((err) => {
            console.log("Error getting recipes from DB... \n\n", err)
            res.status(500).json({ error: "Failed to get list of recipes" })
        })
})

// app.get("/recipes", async (req, res, next) => {

//     let filter = {}

//     try {
//         const recipeFromDB = await Recipe.find(filter)
//         res.json(recipeFromDB)
//     } catch (err) {
//         console.log("Error getting recipes from DB... \n\n", err)
//         res.status(500).json({ error: "Failed to get list of recipes" })
//     }

// })


//  Iteration 5 - Get a Single Recipe
//  GET  /recipes/:id route

app.get("/recipes/:recipeId", (req, res, next) => {

    const { recipeId } = req.params

    Recipe
        .findById(recipeId)
        .then((recipeFromDB) => {
            res.json(recipeFromDB)
        })
        .catch((err) => {
            console.log("Error getting recipe details from DB...\n\n", err);
            res.status(500).json({ error: "Failed to get recipe details" });
        })
})

// app.get("/recipes/:recipeId", async (req, res, next) => {

//     const { recipeId } = req.params

//     try {
//         const recipeFromDB = await Recipe.findById(recipeId)
//         res.json(recipeFromDB)
//     } catch (err) {
//         console.log("Error getting recipe details from DB...\n\n", err);
//         res.status(500).json({ error: "Failed to get recipe details" });
//     }

// })

//  Iteration 6 - Update a Single Recipe
//  PUT  /recipes/:id route

app.put("/recipes/:recipeId", (req, res, next) => {

    const { recipeId } = req.params
    const newDetails = req.body

    Recipe
        .findByIdAndUpdate(recipeId, newDetails, { new: true })
        .then((recipeFromDB) => {
            res.json(recipeFromDB)
        })
        .catch((err) => {
            console.error("Error updating recipe...", err);
            res.status(500).json({ error: "Failed to update a recipe" });
        })
})

// app.put("/recipes/:recipeId", async (req, res, next) => {

//     const { recipeId } = req.params
//     const newDetails = req.body

//     try {
//         const recipeFromDB = await Recipe.findByIdAndUpdate(recipeId, newDetails, { new: true })
//         res.json(recipeFromDB)
//     } catch (err) {
//         console.error("Error updating recipe...", err);
//         res.status(500).json({ error: "Failed to update a recipe" });
//     }

// })

//  Iteration 7 - Delete a Single Recipe
//  DELETE  /recipes/:id route

app.delete("/recipes/:recipeId", (req, res, next) => {

    const { recipeId } = req.params

    Recipe
        .findByIdAndDelete(recipeId)
        .then((response) => {
            if (!response) {
                return res.status(404).json({ error: "Recipe not found" })
            }
            res.sendStatus(204)
        })
        .catch((err) => {
            console.error("Error deleting recipe...", err);
            res.status(500).json({ error: "Failed to delete a recipe" });
        })
})

// app.delete("/recipes/:recipeId", async (req, res, next) => {

//     const { recipeId } = req.params

//     try {
//         const response = await Recipe.findByIdAndDelete(recipeId)

//         if (!response) {
//             return res.status(404).json({ error: "Recipe not found" })
//         }

//         res.sendStatus(204)
//     } catch (err) {
//         console.error("Error deleting recipe...", err);
//         res.status(500).json({ error: "Failed to delete a recipe" });
//     }

// })


// Start the server
app.listen(3000, () => console.log('My first app listening on port 3000!'));



//❗️DO NOT REMOVE THE BELOW CODE
module.exports = app;
