import { BotCmdFunction } from './BotCmdFunction';

export class BotCmd {
    readonly function: BotCmdFunction;
    description?: string;
    overrideDontShow?: boolean;
    constructor(foo: BotCmdFunction, desc?: string, overr = false) {
        this.function = foo;
        this.description = desc;
        this.overrideDontShow = overr;
    }
}