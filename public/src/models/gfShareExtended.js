/**
 * Created by Jonatan on 31/12/2015.
 */

function GfShareExtended(id, user, event, time, mood, lat, lng, address, reason) {
    this.id = id;
    this.user = user;
    this.event = event;
    this.time = time;
    this.mood = mood;
    this.lat = lat;
    this.lng = lng;
    this.address = address;
    this.reason = reason;
}

GfShare.prototype.toString = function () {
    return this.userid + " (" + this.time + ")";
};