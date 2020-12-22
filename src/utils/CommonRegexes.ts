/** @format */

/**
 * @example "6546564 rijgiorsj gjito hi" => [6546564, "rijgiorsj gjito hi"]
 * @example "654ggg6564 gegtoi" => [654, "ggg6564 gegtoi"]
 * @example "ggg633564 rhr" => [633564, "rhr"]
 * @example "asdfgergws" => Error           //TODO rather return [undefined, undefined]?
 * 
 * @param inp any string
 */
export function intAndStrippedRest(inp: string): [n: number, r: string] {
	const matched = inp.match(/\W*(\d+)\W*(.*)/);
	if(matched){
		const res = matched.slice(1);
		return [Number(res[0]), res[1]];
	}
	throw new Error(`Couldnt get number, string from ${inp}`)
}
