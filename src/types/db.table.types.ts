export interface DatabaseTable {
  NAME: string;
  COLUMNS: {
    [key: string]: string;
  };
}
