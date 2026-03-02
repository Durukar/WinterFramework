/**
 * Creates a mock implementation of a class or interface for testing purposes.
 * This is useful when overriding providers in the WinterTestBuilder.
 *
 * @param partialImpl - A partial implementation of the type T.
 * @returns The partial implementation casted to type T.
 *
 * @example
 * ```ts
 * const mockService = createMock<UserService>({
 *   findAll: async () => [{ id: 1, name: 'Mock User' }]
 * });
 * ```
 */
export function createMock<T>(partialImpl: Partial<T>): T {
    return partialImpl as T;
}
