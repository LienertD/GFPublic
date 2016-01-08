/**
 * Created by Jonatan on 28/12/2015.
 */

function GfEvent(id, eventname, eventimage, authorid, from, until, lat, lng, address) {
    this.id = id;
    this.eventname = eventname;
    this.eventimage = eventimage;
    this.authorid = authorid;
    this.from = from;
    this.until = until;
    this.lat = lat;
    this.lng = lng;
    this.address = address;
}

GfShare.prototype.toString = function () {
    return this.eventname;
};