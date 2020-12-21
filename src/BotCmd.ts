/** @format */

import { BotCmdFunction } from './BotCmdFunction';

export type BotCmd = {
	readonly function: BotCmdFunction;
	readonly description?: string;
	readonly overrideDontShow?: boolean;
	readonly forceIsVisible: boolean | undefined;
};
export const newBotCmd = (
	func: BotCmdFunction,
	desc?: string,
	forceIsVisible?: boolean | undefined,
): BotCmd => {
	return {
		function: func,
		description: desc,
		forceIsVisible: forceIsVisible,
	};
};
