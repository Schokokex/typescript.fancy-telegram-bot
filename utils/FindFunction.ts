/** @format */

import { Immutable } from './Immutable';
type Func<T> = () => T | Promise<T>;

/**
 * an implementation similar to [].find() , but works with async functions
 *
 */
export default class FindFunction<T> {
	private readonly validator;
	private readonly breakCondition;
	/**
	 *
	 * @param validator a Function to fiter the good result
	 * @param breakCondition optional (Gets executed First!): stop testing and return Fail
	 */
	constructor(validator: (result: T) => any, breakCondition?: (result: T) => any) {
		this.validator = validator;
		this.breakCondition = breakCondition;
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
	readonly run = async (
		...functions: Func<T>[]
	): Promise<Immutable<[T, Func<T>, number, T[]] | [undefined, undefined, undefined, T[]]>> => {
		const res = [];
		//run functions one by one
		for (const [i, foo] of functions.entries()) {
			if (foo instanceof Function) {
				res[i] = await foo();
				// "break" if valid function
				if (this.breakCondition?.(res[i])) break;
				if (this.validator(res[i])) return [res[i], foo, i, res];
			}
		}
		return [undefined, undefined, undefined, res];
	};
}
