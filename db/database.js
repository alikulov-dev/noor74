const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://azik:azik@cluster0.dtiq1.mongodb.net/myFirstDatabase?retryWrites=true', {
    connectTimeoutMS: 1000,
    useNewUrlParser: true,
    useUnifiedTopology: true,
}, (err) => {
    if (!err) { console.log('MongoDB Connection Succeeded.') }
    else { console.log('Error in DB connection : ' + err) }
});
