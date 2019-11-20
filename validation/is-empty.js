const isEmpty = value => {
    return(value === undefined ||
        value === null ||
        (typeof value === 'object' && Object.keys(value).length === 0) ||
        (typeof value === 'string' && value.trim().length === 0)
        );
} // check for undefined null empty objects or strings

//*******better because validator will only check for an empty string

module.exports = isEmpty;