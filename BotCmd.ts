import { BotCmdFunction } from './BotCmdFunction';

export class BotCmd {
    readonly function: BotCmdFunction;
    readonly description?: string;
    readonly overrideDontShow?: boolean;
    readonly forceIsVisible: boolean | undefined;
    constructor(func: BotCmdFunction, desc?: string, forceIsVisible?: boolean | undefined) {
        this.function = func;
        this.description = desc;
        this.forceIsVisible = forceIsVisible;
    }
}