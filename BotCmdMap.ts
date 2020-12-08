import { BotCmd } from "./BotCmd";

export default class BotCmdMap extends Map<string, BotCmd> {
    constructor(entries?: ([string, BotCmd])[] | null) {
        super(entries);
    }

    toString() {
        let toString = '';
        this.forEach((botCmd, key) => {
            if (botCmd.description && (!botCmd.overrideDontShow)) {
                toString += `${key}: ${botCmd.description}\n`;
            }
        })
        return toString
    }
}