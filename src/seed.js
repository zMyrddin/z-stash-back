const { databaseConnect } = require('./database');
const { Stash } = require ('./models/StashesModel');
const { User } = require ('./models/UserModel');


databaseConnect().then(async () => {

    console.log("Creating seed data!");



    let admin = new User ({
        username:"admin",
        password: "fireflyadmin",
        role: "admin"
    });

    await admin.save().then(() =>{
        console.log("Seed user created")
    });

    let scout = new User ({
        username:"scout",
        password: "fireflyscout",
        role: "scout"
    });

    await scout.save().then(() =>{
        console.log("Seed scout account created")
    });

    let member = new User ({
        username:"member",
        password: "fireflymember",
        role: "member"
    });

    await member.save().then(() =>{
        console.log("Seed member account created")
    });

    let newStash1 = new Stash({
        stashName: "Stash 1",
        location: "In the woods near the old mill.",
        landmarks: ["5m West of the broken shovel","near puddle when raining"],
        hostileSighting: false,
        notes: ["Contains canned goods.","Nothing else is special"]
    });

    await newStash1.save().then(() => {
        console.log("Seed stash is saved in the DB.");
    });


});