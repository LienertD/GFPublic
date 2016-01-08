/**
 * Created by Jonatan on 31/12/2015.
 */

function ProfileServiceException(message) {
    this.name = "ProfileServiceException";
    this.message = message;
    this.stack = (new Error()).stack;
}

// IE9

ProfileServiceException.prototype = Object.create(Error.prototype);
ProfileServiceException.prototype.constructor = ProfileServiceException;