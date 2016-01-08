/**
 * Created by Jonatan on 31/12/2015.
 */

function ShareServiceException(message) {
    this.name = "ShareServiceException";
    this.message = message;
    this.stack = (new Error()).stack;
}

// IE9

ShareServiceException.prototype = Object.create(Error.prototype);
ShareServiceException.prototype.constructor = ShareServiceException;