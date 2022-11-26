export const isNumber = (val: unknown): val is number => {
    return typeof val === 'number' || val instanceof Number;
};

export const parseNumber = (val: unknown): number => {
    if (!val || !isNumber(val)) {
        throw new Error('Incorrect or missing number');
    }

    return val;
}

export const parseNumberField = (val: unknown, fieldName: string): number => {
    if ( !isNumber(val) ) {
        throw new Error(`Incorrect or missing number in field ${fieldName}: ${val}`);
    }

    return val;
};

export const parseIntegerField = (val: unknown, fieldName: string): number => {
    parseNumberField(val);
    if ( Math.floor(val) !== val ) {
        throw new Error(`Incorrect or missing integer in field ${fieldName}: ${val}`);
    }

    return val;
};


const isBoolean = (o: unknown): text is boolean => {
    return o === true || o === false;
};

const parseBooleanField = (o: unknown, fieldName: string): boolean => {
    if ( !isBoolean(o) ) {
        throw new Error(`Incorrect or missing boolean in field '${fieldName}': ${o}`);
    }

    return o;
}

const isString = (text: unknown): text is string => {
    return typeof text === 'string' || text instanceof String;
};

const parseStringField = (text: unknown, fieldName: string): string => {
    if ( !text || !isString(text) ) {
        throw new Error(`Incorrect or missing string in field '${fieldName}': ${text}`);
    }

    return text;
}
