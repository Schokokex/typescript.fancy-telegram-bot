/** @format */

import { InlineKeyboardButton } from "telegram-bot-types/lib/types/core/InlineKeyboardButton";


export default class CallbackButton implements InlineKeyboardButton {
	readonly text: string;
	readonly callback_data?: string | undefined;
	constructor(text: string, callback_string: string) {
		this.text = text;
		this.callback_data = callback_string;
	}
}
