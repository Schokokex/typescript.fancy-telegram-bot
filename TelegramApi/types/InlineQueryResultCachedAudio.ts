/** @format */

import { MessageEntity } from './MessageEntity';
import { InlineKeyboardMarkup } from './InlineKeyboardMarkup';
import { InputTextMessageContent } from './InputTextMessageContent';
import { InputLocationMessageContent } from './InputLocationMessageContent';
import { InputVenueMessageContent } from './InputVenueMessageContent';
import { InputContactMessageContent } from './InputContactMessageContent';

/**
 * Represents a link to an MP3 audio file stored on the Telegram servers. By default, this audio file will be sent by the user. Alternatively, you can use input_message_content to send a message with the specified content instead of the audio.
 */
export type InlineQueryResultCachedAudio = {
	/**
	 * Type of the result, must be audio
	 */
	type: string;

	/**
	 * Unique identifier for this result, 1-64 bytes
	 */
	id: string;

	/**
	 * A valid file identifier for the audio file
	 */
	audio_file_id: string;

	/**
	 * Optional. Caption, 0-1024 characters after entities parsing
	 */
	caption?: string;

	/**
	 * Optional. Mode for parsing entities in the audio caption. See formatting options for more details.
	 */
	parse_mode?: string;

	/**
	 * Optional. List of special entities that appear in the caption, which can be specified instead of parse_mode
	 */
	caption_entities?: MessageEntity[];

	/**
	 * Optional. Inline keyboard attached to the message
	 */
	reply_markup?: InlineKeyboardMarkup;

	/**
	 * Optional. Content of the message to be sent instead of the audio
	 */
	input_message_content?:
		| InputTextMessageContent
		| InputLocationMessageContent
		| InputVenueMessageContent
		| InputContactMessageContent;
};
