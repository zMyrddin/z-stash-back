// const mongoose = require('mongoose');
const { databaseConnect } = require('./database');
const { Stash } = require ('./models/StashModel');
const { User } = require ('./models/UserModel');
// import { Stash } from './models/StashModel';
// import { User } from './models/UserModel';

databaseConnect().then(async () => {

    console.log("Creating seed data!");

    // const Stash = mongoose.model('Stash', {
    //     name: String,
    //     location: String,
    //     landmarks: [String],
    //     hostileSighting: Boolean,
    //     importantNotes: [String]
    // });

    let newUser1 = new User ({
        username:"admin",
        password: "fireflyadmin",
        isAdmin: true
    });

    await newUser1.save().then(() =>{
        console.log("Seed user created")
    });

    let newStash1 = new Stash({
        name: "Stash 1",
        location: "In the woods near the old mill.",
        landmarks: ["5m West of the broken shovel","near puddle when raining"],
        hostileSighting: false,
        importantNotes: ["Contains canned goods.","Nothing else is special"]
    });

    await newStash1.save().then(() => {
        console.log("Seed stash is saved in the DB.");
    });


});