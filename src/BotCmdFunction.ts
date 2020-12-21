/** @format */

import { Message } from "telegram-bot-types/lib/types/core/Message";


export type BotCmdFunction = (from: Message, restMsg?: string, ...a: any[]) => any;
