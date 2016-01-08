/**
 * Created by Jonatan on 31/12/2015.
 */

function EventServiceException(message) {
    this.name = "EventServiceException";
    this.message = message;
    this.stack = (new Error()).stack;
}

// IE9

EventServiceException.prototype = Object.create(Error.prototype);
EventServiceException.prototype.constructor = EventServiceException;