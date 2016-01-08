/**
 * Created by Jonatan on 15/12/2015.
 */

var mongoose = require('mongoose');
var ShareSchema = mongoose.Schema({
    userid : String,
    eventid : String,
    time : Date,
    mood : Number,
    lat : Number,
    lng : Number,
    address: String,
    reason : String
});

module.exports = mongoose.model('Share', ShareSchema);