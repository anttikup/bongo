class AssertionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AssertionError';
  }
}

export const assert = (condition: boolean, message: string) => {
    if ( !condition ) {
        throw new AssertionError(message);
    }
};
