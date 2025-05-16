declare global {
  interface Error {
    _code?: number;
    _errors?: any;
  }
}

export {};
