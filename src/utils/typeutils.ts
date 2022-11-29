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
    const num = parseNumberField(val, fieldName);
    if ( Math.floor(num) !== num ) {
        throw new Error(`Incorrect or missing integer in field ${fieldName}: ${val}`);
    }

    return num;
};


const isBoolean = (val: unknown): val is boolean => {
    return val === true || val === false;
};

export const parseBooleanField = (val: unknown, fieldName: string): boolean => {
    if ( !isBoolean(val) ) {
        throw new Error(`Incorrect or missing boolean in field '${fieldName}': ${val}`);
    }

    return val;
}

const isString = (text: unknown): text is string => {
    return typeof text === 'string' || text instanceof String;
};

export const parseStringField = (text: unknown, fieldName: string): string => {
    if ( !text || !isString(text) ) {
        throw new Error(`Incorrect or missing string in field '${fieldName}': ${text}`);
    }

    return text;
}
