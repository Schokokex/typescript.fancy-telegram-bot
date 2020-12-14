/** @format */

import { Immutable } from './utils/Immutable';
import { BotCmd } from './BotCmd';

export default class BotCmdMap extends Map<string, BotCmd> {
	constructor(entries?: [string, BotCmd][] | null) {
		super(entries);
	}

	toString() {
		let toString = '';
		this.forEach((botCmd, key) => {
			if (botCmd.description && !botCmd.overrideDontShow) {
				toString += `${key}: ${botCmd.description}\n`;
			}
		});
		return toString;
	}

	toJson(): Immutable<{ [a: string]: BotCmd }> {
		const a: { [a: string]: BotCmd } = {};
		this.forEach((val, key) => {
			a[key] = val;
		});
		return a;
	}

	toArray(): Immutable<[_: string, _: BotCmd][]> {
		const a: [_: string, _: BotCmd][] = [];
		this.forEach((val, key) => {
			a.push([key, val]);
		});
		return a;
	}
}
