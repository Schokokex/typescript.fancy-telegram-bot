/** @format */

export default class DefinedArray<T> extends Array<T> {
	constructor(...values: (T | undefined)[]) {
		const asd = <T[]>values.filter(v => v !== undefined);
		super(...asd);
		Object.freeze(this);
	}
}
