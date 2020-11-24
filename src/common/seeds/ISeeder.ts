export interface ISeeder<T> {
  run(): Promise<void>
}
