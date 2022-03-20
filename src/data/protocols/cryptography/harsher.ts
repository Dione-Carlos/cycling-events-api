export interface Harsher {
  hash (value: string): Promise<string>
}
