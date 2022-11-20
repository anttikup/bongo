class AssertionError extends Error {
  constructor(message) {
    super(message);
    this.name = 'AssertionError';
  }
}

export const assert = (condition, message) => {
    if ( !condition ) {
        throw new AssertionError(message);
    }
};
