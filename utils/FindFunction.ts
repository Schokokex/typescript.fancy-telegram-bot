type Func<T> = () => (T | Promise<T>)

/**
 * an implementation similar to [].find() , but works with async functions
 */
export default class FindFunction<T> {
    private readonly validator;
    constructor(validator: (result: T) => any) {
        this.validator = validator;
    }
    /**
     * 
     * @param functions functions to check.
     * @returns on Success:
     * [0] the successful value
     * [1] the successful function
     * [2] array index
     * [3] array of responses
     * 
     * @returns on Fail:
     * [0] undefined
     * [1] undefined
     * [2] undefined
     * [3] array of responses
     */
    readonly run = async (...functions: Func<T>[]): Promise<[T, Func<T>, number] | [undefined, undefined, undefined]> => {
        //run functions one by one
        for (const [i, foo] of functions.entries()) {
            if (foo instanceof Function) {
                const result = await foo();
                // "break" if valid function
                if (this.validator(result)) return [result, foo, i];
            }
        }
        return [undefined, undefined, undefined];
    }
}