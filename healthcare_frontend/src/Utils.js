function destructureJSONIntoOnlyKeysAndValues(IncomingJsonObject) {
    console.log("IncomingJsonObject", IncomingJsonObject);

    let fieldWithErrorList = {};


    function getAllKeysAndValues(obj) {
        console.log("obj", obj);
        let keysAndValues = {};
        for (const [key, value] of Object.entries(obj)) {
            if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
                const nestedKeysAndValues = getAllKeysAndValues(value);
                for (const [nestedKey, nestedValue] of Object.entries(nestedKeysAndValues)) {
                    keysAndValues[nestedKey] = nestedValue;
                }
            } else if (typeof value === 'array' && value !== null) {
                keysAndValues[key] = value;
            }
            else {
                keysAndValues[key] = value;
            }
        }
        return keysAndValues;
    }

    const keysAndValues = getAllKeysAndValues(IncomingJsonObject);

    return keysAndValues;

}

export default destructureJSONIntoOnlyKeysAndValues;