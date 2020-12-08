import { Message } from "./TelegramApi/types/Message";

export type BotCmdFunction = (
    from: Message,
    restMsg?: string,
    ...a: any[]
) => any;