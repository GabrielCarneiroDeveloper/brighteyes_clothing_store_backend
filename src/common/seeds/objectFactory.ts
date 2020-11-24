type Constructor<T> = new (...args: any[]) => T

export function objectFactory<T>(
  dataList: Omit<T, 'id'>[],
  DestinationConstructor: Constructor<T>
): T[] {
  return dataList.map((data) => Object.assign(new DestinationConstructor(), data))
}
