// src/__tests__/helpers/typedMock.ts
export type MockedFunction<T extends (...args: any) => any> = jest.Mock<ReturnType<T>, Parameters<T>>;

export function mockFunction<T extends (...args: any) => any>(fn: T): MockedFunction<T> {
  return fn as unknown as MockedFunction<T>;
}
