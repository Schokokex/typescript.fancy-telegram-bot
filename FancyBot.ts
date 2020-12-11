import Axios from 'axios';
import { Request, RequestHandler, Response } from "express";
import { inspect } from 'util';

import { BotCmd, newBotCmd } from "./BotCmd";
import BotCmdMap from './BotCmdMap';
import CallbackButton from './CallbackButton';
import MessageEntityImproved from './MessageEntityImproved';
import TelegramApi, { FetchResult } from './TelegramApi/TelegramApi';
import { CallbackQuery } from './TelegramApi/types/CallbackQuery';
import { InlineKeyboardButton } from './TelegramApi/types/InlineKeyboardButton';
import { Message } from './TelegramApi/types/Message';
import { Update } from './TelegramApi/types/Update';
import TelegramApiUsingAxios from './TelegramApiUsingAxios';
import FindFunction from "./utils/FindFunction";


type NewMsgParams = { msgOrId: number | Message, text: string, file?: string, buttons?: InlineKeyboardButton[][] };
type UpdateMsgParams = { msg: Message, text: string, file?: string, buttons?: InlineKeyboardButton[][] };

export default abstract class FancyBot {
    // #region Properties (9)

    private readonly adminID: number;
    private readonly api: TelegramApi;
    private readonly commands = new BotCmdMap();

    protected botOnlineName: string | undefined;

    readonly CMD_DEL_MSG = "del";
    readonly DELETE_BUTTON = new CallbackButton("❌", this.CMD_DEL_MSG);

    readonly alertAdmin = (message: string) => {
        this.sendDeletableMessage({ msgOrId: this.adminID, text: "Alert: " + message.substr(0, 3000) }).catch(console.error);
    }

    readonly requestHandler: RequestHandler = (req: Request, res: Response) => {
        try {
            const update: Update = req.body;
            const msg = update.message || update.edited_message;
            const cbq = update.callback_query;
            const chp = update.channel_post || update.edited_channel_post;

            msg && this.messageHandler(msg, Boolean(update.edited_message));
            cbq && this.callbackQueryHandler(cbq);
            chp && this.channelPostHandler(chp);

        } catch (error) {
            this.alertAdmin(`FancyBot handler error: ${error}`)
        }
        res.send("ok 200 :)");
    }

    readonly setWebhook = async (address: string, force = false) => {
        //TODO
        console.info("setting up webhook...");
        const fancyBot = this;
        if (force) {
            return this.api.setWebhook({ url: address });
        }
        const previousWebhook = await this.api.getWebookInfo();
        const newWebook = await this.api.setWebhook({ url: address });
        this.alertAdmin(`Webhook set to ${address}`);
        const testPing: Update = { update_id: 1, message: { message_id: 1, text: `/ping webhook set successfully`, date: 1, chat: { id: this.adminID, type: 'private' } } }
        Axios
            .post(address, testPing)
            .catch(e => { console.error(`>>>>>Error occured in setWebhook\n${e} <<<<<Error occured in setWebhook`) });
        const status = await this.api.getWebookInfo();
    }

    // #endregion Properties (9)

    // #region Constructors (1)

    /**
     * 
     * @param token 
     * @param adminId 
     * @param skipDefaultCommands defaults to false
     * @param listDefaultCommands defaults to false
     */
    constructor(obj: {
        token: string,
        adminId: number,
        skipDefaultCommands?: boolean,
        listDefaultCommands?: boolean
    }) {
        const forceIsVisible = !!obj.listDefaultCommands;
        const defaultCommands = !!obj.skipDefaultCommands;

        const fancyBot = this;
        this.api = new TelegramApiUsingAxios(obj.token);
        this.api.getMe().then(r => this.botOnlineName = r?.result?.username).catch(r => console.error(`FancyBot api connection test failed ${r}`));
        this.adminID = obj.adminId;

        const api = this.api;

        defaultCommands || this.setMoreCommands({
            "/nothing": newBotCmd(() => { }, 'nothing', false),

            [fancyBot.CMD_DEL_MSG]: newBotCmd((from: Message, restMsg?: string) => {
                return (from instanceof Object) &&
                    api.deleteMessage({ chat_id: from.chat.id, message_id: from.message_id })
                        .catch(e => fancyBot.alertAdmin(`FancyBot del_msg error ${inspect(e).substring(0, 200)}`))
            }, '', false),

            "/help": newBotCmd((fromMsgOrId: Message | number) => {
                fancyBot.sendDeletableMessage({ msgOrId: fromMsgOrId, text: `${fancyBot.commands}` })
            }, 'list commands', forceIsVisible),
            "/ping": newBotCmd((from: Message, restMsg?: string) => {
                return fancyBot.sendDeletableMessage({ msgOrId: from, text: restMsg || '/pong' })
            }, 'reply with same message', forceIsVisible),
            "/pong": newBotCmd((from: Message, restMsg?: string) => {
                return fancyBot.sendDeletableMessage({ msgOrId: from, text: restMsg || '/ping' })
            }, 'reply with /ping', forceIsVisible),
            "/id": newBotCmd((from: Message, restMsg?: string) => {
                const userId = from.chat.id
                return fancyBot.sendDeletableMessage({ msgOrId: userId, text: `\`${userId}\`` })
            }, 'reply with id', forceIsVisible),
        });
    }

    // #endregion Constructors (1)

    // #region Protected Methods (8)

    protected async uploadCommands() {
        const cmds = this.commands.toArray().filter(v => (v[1].forceIsVisible === undefined) ? v[1].description : v[1].forceIsVisible).map(v => { return { command: v[0], description: v[1].description || '' } })
        this.api.setMyCommands({ commands: cmds })
    }

    protected getImprovedMessageEntities(message: Message): MessageEntityImproved[] {
        if (message.text && message.entities) {
            const offsetWhitespace = message.text.indexOf(message.text.trimStart())
            return message.entities.map(e => new MessageEntityImproved(
                e,
                message.text!.substring(e.offset, e.offset + e.length),
                message.text!.substring(e.length + e.offset),
                e.offset - offsetWhitespace
            )) || [];
        }
        return [];
    }

    protected getMessageCommand(message: Message): MessageEntityImproved | undefined {
        if (!message.text) return undefined;

        const msgEntity = this.getImprovedMessageEntities(message);

        //learn haskell
        return msgEntity[0] ? (msgEntity[0].strippedOffset > 0) ? undefined
            : ('bot_command' === msgEntity[0].type) ? msgEntity[0]
                : (
                    msgEntity[1] &&
                    'mention' === msgEntity[0].type &&
                    'bot_command' === msgEntity[1].type &&
                    message.text.substring(0, msgEntity[1].offset).trim().length === msgEntity[0].length
                ) ? msgEntity[1]
                    : undefined
            : undefined;
    }


    protected async runCommand(cmdString: string, fromMsgOrId: Message, ...params: any[]) {
        const fancyBot = this;
        const cmd = fancyBot.commands.get(cmdString);
        if (cmd) {
            return (cmd.function(fromMsgOrId, ...params)?.catch?.((e: any) => {
                throw new Error(e)
            }));
        } else {
            return false
        }
    }


    protected async sendDeletableMessage(obj: NewMsgParams): Promise<FetchResult> {
        const buttons = (obj.buttons || []).concat([[this.DELETE_BUTTON]])
        const paramCopy = { ...obj, buttons: buttons }
        const isMessage = obj.msgOrId instanceof Object;
        if (isMessage) {
            return this.updateMessage({ ...paramCopy, msg: <Message>obj.msgOrId }, true)
        } else {
            return this.newMessage(paramCopy);
        }
    }

    protected async sendPermanentMessage(obj: UpdateMsgParams): Promise<FetchResult> {
        return this.updateMessage(obj, true)
    }

    protected setCommand(cmd: string, b: BotCmd) {
        this.commands.set(cmd, b);
    }

    protected setMoreCommands(cmds: { [cmd: string]: BotCmd }) {
        for (const cmdName in cmds) {
            const value = cmds[cmdName];
            this.setCommand(cmdName, value);
        }
    }

    // #endregion Protected Methods (8)

    // #region Protected Abstract Methods (3)

    protected abstract handleCallbackQuery(cbq: CallbackQuery): any;
    protected abstract handleChannelPost(cbq: Message): any;
    protected abstract handleMessage(message: Message, isUpdate: boolean): any;
    protected abstract handleBotCommand(entity: MessageEntityImproved, message: Message, isUpdate: boolean): any;

    // #endregion Protected Abstract Methods (3)

    // #region Private Methods (5)

    private async callbackQueryHandler(cbq: CallbackQuery) {
        if (cbq.data) {
            const splitIndex = (cbq.data.search(/\w\W/) + 1) || cbq.data.length;
            const cmdString = cbq.data.substring(0, splitIndex).trim();
            const restString = cbq.data.substring(splitIndex);
            if (cbq.data && cbq.message && this.commands.get(cmdString)) {
                await this.runCommand(cmdString, cbq.message, restString)
                    .catch(e => this.alertAdmin(`FancyBot cbq ${e}`));
            } else {
                await this.handleCallbackQuery(cbq);
            }
            this.api.answerCallbackQuery({ callback_query_id: cbq.id });
        }
    }

    private async channelPostHandler(chp: Message) {
        this.handleChannelPost(chp);
    }

    private async messageHandler(msg: Message, isUpdate: boolean) {
        const cmd = this.getMessageCommand(msg)
        if (cmd) {
            try {
                const res = await this.runCommand(cmd.string, msg, cmd.restString);
                this.handleBotCommand(cmd, msg, isUpdate)
            } catch (e) {
                this.sendDeletableMessage({ msgOrId: msg, text: `Cant execute ${cmd.string}: ${inspect(e)}` });
            }
        } else {
            this.handleMessage(msg, isUpdate);
        }
    }

    private async newMessage(obj: NewMsgParams): Promise<FetchResult> {
        //TODO
        const msg = obj.msgOrId instanceof Object && obj.msgOrId;
        const chatId = obj.msgOrId instanceof Object ? obj.msgOrId.chat.id : obj.msgOrId
        const keyb = obj.buttons && { inline_keyboard: obj.buttons };
        const file = obj.file

        if (file) {
            try {
                const [res, foo, i, fails] = await new FindFunction<FetchResult>(
                    r => r.ok,
                    r => r.description?.includes("wrong file identifier")
                ).run(
                    () => this.api.sendPhoto({ chat_id: chatId, photo: file, caption: obj.text, reply_markup: keyb }),
                    () => this.api.sendAudio({ chat_id: chatId, audio: file, caption: obj.text, reply_markup: keyb }),
                    () => this.api.sendVideo({ chat_id: chatId, video: file, caption: obj.text, reply_markup: keyb }),
                    () => this.api.sendAnimation({ chat_id: chatId, animation: file, caption: obj.text, reply_markup: keyb }),
                    () => this.api.sendVoice({ chat_id: chatId, voice: file, caption: obj.text, reply_markup: keyb }),
                    () => this.api.sendVideoNote({ chat_id: chatId, video_note: obj.text, reply_markup: keyb }),
                    () => this.api.sendDocument({ chat_id: chatId, document: file, caption: obj.text, reply_markup: keyb }),
                );
                if (res) {
                    if (msg) this.api.deleteMessage({ chat_id: msg.chat.id, message_id: msg.message_id })
                    return res;
                } else if (fails[0]?.description?.includes("wrong file identifier")) {
                    this.sendDeletableMessage({ msgOrId: chatId, text: `Corrupted File: ${file}` })
                    throw new Error(`Corrupted File ${file}`);
                } else {
                    this.alertAdmin(`FancyBot newMessage all documents failed ${inspect(fails)}`);
                    throw new Error(`FancyBot newMessage all documents failed ${inspect(fails)}`);
                }
            } catch (e) {
                this.alertAdmin(`FancyBot newMessage error ${inspect(e)}`);
                throw new Error(`FancyBot newMessage error ${inspect(e)}`);
            }
        } else {
            const res = this.api.sendMessage({ chat_id: chatId, text: obj.text, reply_markup: keyb });
            if (msg) this.api.deleteMessage({ chat_id: msg.chat.id, message_id: msg.message_id })
            return res;
        }
    }

    private async updateMessage(obj: UpdateMsgParams, elseNew = false): Promise<FetchResult> {
        const keyb = obj.buttons && { inline_keyboard: obj.buttons };
        const file = obj.file;
        if (file) {
            const [res, foo, i, fails] = await new FindFunction<FetchResult>(
                r => r.ok || r.description.includes("exactly the same"),
                r => r.description?.includes('message to edit not found')
            ).run(
                () => this.api.editMessageMedia({ media: { type: 'photo', media: file, caption: obj.text }, reply_markup: keyb, message_id: obj.msg.message_id, chat_id: obj.msg.chat.id }),
                () => this.api.editMessageMedia({ media: { type: 'animation', media: file, caption: obj.text }, reply_markup: keyb, message_id: obj.msg.message_id, chat_id: obj.msg.chat.id }),
                () => this.api.editMessageMedia({ media: { type: 'audio', media: file, caption: obj.text }, reply_markup: keyb, message_id: obj.msg.message_id, chat_id: obj.msg.chat.id }),
                () => this.api.editMessageMedia({ media: { type: 'video', media: file, caption: obj.text }, reply_markup: keyb, message_id: obj.msg.message_id, chat_id: obj.msg.chat.id }),
                () => this.api.editMessageMedia({ media: { type: 'document', media: file, caption: obj.text }, reply_markup: keyb, message_id: obj.msg.message_id, chat_id: obj.msg.chat.id }),
            );
            if (res) {
                return res;
            } else if (elseNew) {
                return this.newMessage({ ...obj, msgOrId: obj.msg });
            } else {
                return fails[0]
            }
        } else {
            const res = await this.api.editMessageText({ chat_id: obj.msg.chat.id, message_id: obj.msg.message_id, text: obj.text, reply_markup: keyb })
            if (res.ok) {
                return res;
            } else if (elseNew) {
                return this.newMessage({ ...obj, msgOrId: obj.msg })
            } else {
                return res;
            }
        }
    }

    // #endregion Private Methods (5)
}