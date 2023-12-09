// this file handles boot up of server

const { app } = require ('./server');

app.listen(3000, () => {
    console.log("Server running");
});
