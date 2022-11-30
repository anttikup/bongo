export const isBoolean = (val: unknown): val is boolean => {
    return val === true || val === false;
};

export const isNumber = (obj: unknown): obj is number => {
    return typeof obj === "number";
};

export const isString = (obj: unknown): obj is string => {
    return typeof obj === "string";
};

export const isObject = (obj: unknown): obj is Record<string, unknown> => {
    return typeof obj === "object" && obj !== null;
};

export const isArray = <T>(obj: unknown): obj is Array<T>  => {
    return isObject(obj) && obj.length !== undefined;
};
