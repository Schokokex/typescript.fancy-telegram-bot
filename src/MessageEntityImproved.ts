/** @format */

import { MessageEntity } from './TelegramApi/types/MessageEntity';

export default class MessageEntityImproved implements MessageEntity {
	readonly type: string;
	readonly offset: number;
	readonly length: number;
	readonly url;
	readonly user;
	readonly language;

	readonly string: string;
	readonly restString: string;
	readonly strippedOffset: number;

	constructor(
		messageEntity: MessageEntity,
		string: string,
		restString: string,
		strippedOffset: number,
	) {
		this.type = messageEntity.type;
		this.offset = messageEntity.offset;
		this.length = messageEntity.length;

		this.string = string;
		this.restString = restString;
		this.strippedOffset = strippedOffset;
		this.url = messageEntity.url;
		this.user = messageEntity.user;
		this.language = messageEntity.language;
	}
}
