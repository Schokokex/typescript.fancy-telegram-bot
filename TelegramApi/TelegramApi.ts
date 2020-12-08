import { BotCommand } from './types/BotCommand';
import { ChatPermissions } from './types/ChatPermissions';
import { ForceReply } from './types/ForceReply';
import { InlineKeyboardMarkup } from './types/InlineKeyboardMarkup';
import { InputFile } from './types/InputFile';
import { InputMedia } from './types/InputMedia';
import { InputMediaAudio } from './types/InputMediaAudio';
import { InputMediaDocument } from './types/InputMediaDocument';
import { InputMediaPhoto } from './types/InputMediaPhoto';
import { InputMediaVideo } from './types/InputMediaVideo';
import { LabeledPrice } from './types/LabeledPrice';
import { MaskPosition } from './types/MaskPosition';
import { Message } from './types/Message';
import { MessageEntity } from './types/MessageEntity';
import { ReplyKeyboardMarkup } from './types/ReplyKeyboardMarkup';
import { ReplyKeyboardRemove } from './types/ReplyKeyboardRemove';
import { ShippingOption } from './types/ShippingOption';

/**
 * either   {ok: true, result:any} 
 * or       {ok: false, error_code:number, description: string}
 */
export type FetchResult<T = any> = { ok: true, result: T, description: undefined } | { ok: false, error_code: number, description: string, result: undefined }

export default abstract class TelegramApi {
    readonly BASE_URL = 'https://api.telegram.org/bot';

    protected abstract fetch(methodName: string, params: object): Promise<FetchResult>;

    protected getFullUrl(token: string, methodName: string) {
        return this.BASE_URL + token + '/' + methodName;
    }

    async getMe(): Promise<FetchResult<{
        id: number,
        is_bot: boolean,
        first_name: string,
        username: string,
        can_join_groups: boolean,
        can_read_all_group_messages: boolean,
        supports_inline_queries: boolean
    }>> {
        return this.fetch("getMe", {});
    }

    /**
     *
     * @param offset Identifier of the first update to be returned. Must be greater by one than the highest among the identifiers of previously received updates. By default, updates starting with the earliest unconfirmed update are returned. An update is considered confirmed as soon as getUpdates is called with an offset higher than its update_id. The negative offset can be specified to retrieve updates starting from -offset update from the end of the updates queue. All previous updates will forgotten.
     * @param limit Limits the number of updates to be retrieved. Values between 1-100 are accepted. Defaults to 100.
     * @param timeout Timeout in seconds for long polling. Defaults to 0, i.e. usual short polling. Should be positive, short polling should be used for testing purposes only.
     * @param allowed_updates A JSON-serialized list of the update types you want your bot to receive. For example, specify [“message”, “edited_channel_post”, “callback_query”] to only receive updates of these types. See Update for a complete list of available update types. Specify an empty list to receive all updates regardless of type (default). If not specified, the previous setting will be used.Please note that this parameter doesn&#x27;t affect updates created before the call to the getUpdates, so unwanted updates may be received for a short period of time.
     */
    async getUpdates(obj: { offset?: number, limit?: number, timeout?: number, allowed_updates?: string[], }) {
        return this.fetch("getUpdates", { offset: obj.offset, limit: obj.limit, timeout: obj.timeout, allowed_updates: obj.allowed_updates, });
    }

    /**
     *
     * @param url HTTPS url to send updates to. Use an empty string to remove webhook integration
     * @param certificate Upload your public key certificate so that the root certificate in use can be checked. See our self-signed guide for details.
     * @param ip_address The fixed IP address which will be used to send webhook requests instead of the IP address resolved through DNS
     * @param max_connections Maximum allowed number of simultaneous HTTPS connections to the webhook for update delivery, 1-100. Defaults to 40. Use lower values to limit the load on your bot&#x27;s server, and higher values to increase your bot&#x27;s throughput.
     * @param allowed_updates A JSON-serialized list of the update types you want your bot to receive. For example, specify [“message”, “edited_channel_post”, “callback_query”] to only receive updates of these types. See Update for a complete list of available update types. Specify an empty list to receive all updates regardless of type (default). If not specified, the previous setting will be used.Please note that this parameter doesn&#x27;t affect updates created before the call to the setWebhook, so unwanted updates may be received for a short period of time.
     * @param drop_pending_updates Pass true to drop all pending updates
     */
    async setWebhook(obj: { url: string, certificate?: InputFile, ip_address?: string, max_connections?: number, allowed_updates?: string[], drop_pending_updates?: boolean, }) {
        return this.fetch("setWebhook", { url: obj.url, certificate: obj.certificate, ip_address: obj.ip_address, max_connections: obj.max_connections, allowed_updates: obj.allowed_updates, drop_pending_updates: obj.drop_pending_updates, });
    }

    async getWebookInfo() {
        return this.fetch("getWebhookInfo", {});
    }

    /**
     *
     * @param drop_pending_updates Pass true to drop all pending updates
     */
    async deleteWebhook(obj: { drop_pending_updates?: boolean, }) {
        return this.fetch("deleteWebhook", { drop_pending_updates: obj.drop_pending_updates, });
    }

    /**
     *
     * @param chat_id Unique identifier for the target chat or username of the target channel (in the format @channelusername)
     * @param text Text of the message to be sent, 1-4096 characters after entities parsing
     * @param parse_mode Mode for parsing entities in the message text. See formatting options for more details.
     * @param entities List of special entities that appear in message text, which can be specified instead of parse_mode
     * @param disable_web_page_preview Disables link previews for links in this message
     * @param disable_notification Sends the message silently. Users will receive a notification with no sound.
     * @param reply_to_message_id If the message is a reply, ID of the original message
     * @param allow_sending_without_reply Pass true, if the message should be sent even if the specified replied-to message is not found
     * @param reply_markup Additional interface options. A JSON-serialized object for an inline keyboard, custom reply keyboard, instructions to remove reply keyboard or to force a reply from the user.
     */
    async sendMessage(obj: { chat_id: number | string, text: string, parse_mode?: string, entities?: MessageEntity[], disable_web_page_preview?: boolean, disable_notification?: boolean, reply_to_message_id?: number, allow_sending_without_reply?: boolean, reply_markup?: (InlineKeyboardMarkup | ReplyKeyboardMarkup | ReplyKeyboardRemove | ForceReply), }): Promise<FetchResult<Message>> {
        return this.fetch("sendMessage", { chat_id: obj.chat_id, text: obj.text, parse_mode: obj.parse_mode, entities: obj.entities, disable_web_page_preview: obj.disable_web_page_preview, disable_notification: obj.disable_notification, reply_to_message_id: obj.reply_to_message_id, allow_sending_without_reply: obj.allow_sending_without_reply, reply_markup: obj.reply_markup, });
    }

    /**
     *
     * @param chat_id Unique identifier for the target chat or username of the target channel (in the format @channelusername)
     * @param from_chat_id Unique identifier for the chat where the original message was sent (or channel username in the format @channelusername)
     * @param disable_notification Sends the message silently. Users will receive a notification with no sound.
     * @param message_id Message identifier in the chat specified in from_chat_id
     */
    async forwardMessage(obj: { chat_id: number | string, from_chat_id: number | string, message_id: number, disable_notification?: boolean, }) {
        return this.fetch("forwardMessage", { chat_id: obj.chat_id, from_chat_id: obj.from_chat_id, disable_notification: obj.disable_notification, message_id: obj.message_id, });
    }

    /**
     *
     * @param chat_id Unique identifier for the target chat or username of the target channel (in the format @channelusername)
     * @param from_chat_id Unique identifier for the chat where the original message was sent (or channel username in the format @channelusername)
     * @param message_id Message identifier in the chat specified in from_chat_id
     * @param caption New caption for media, 0-1024 characters after entities parsing. If not specified, the original caption is kept
     * @param parse_mode Mode for parsing entities in the new caption. See formatting options for more details.
     * @param caption_entities List of special entities that appear in the new caption, which can be specified instead of parse_mode
     * @param disable_notification Sends the message silently. Users will receive a notification with no sound.
     * @param reply_to_message_id If the message is a reply, ID of the original message
     * @param allow_sending_without_reply Pass true, if the message should be sent even if the specified replied-to message is not found
     * @param reply_markup Additional interface options. A JSON-serialized object for an inline keyboard, custom reply keyboard, instructions to remove reply keyboard or to force a reply from the user.
     */
    async copyMessage(obj: { chat_id: number | string, from_chat_id: number | string, message_id: number, caption?: string, parse_mode?: string, caption_entities?: MessageEntity[], disable_notification?: boolean, reply_to_message_id?: number, allow_sending_without_reply?: boolean, reply_markup?: (InlineKeyboardMarkup | ReplyKeyboardMarkup | ReplyKeyboardRemove | ForceReply), }) {
        return this.fetch("copyMessage", { chat_id: obj.chat_id, from_chat_id: obj.from_chat_id, message_id: obj.message_id, caption: obj.caption, parse_mode: obj.parse_mode, caption_entities: obj.caption_entities, disable_notification: obj.disable_notification, reply_to_message_id: obj.reply_to_message_id, allow_sending_without_reply: obj.allow_sending_without_reply, reply_markup: obj.reply_markup, });
    }

    /**
     *
     * @param chat_id Unique identifier for the target chat or username of the target channel (in the format @channelusername)
     * @param photo Photo to send. Pass a file_id as string to send a photo that exists on the Telegram servers (recommended), pass an HTTP URL as a string for Telegram to get a photo from the Internet, or upload a new photo using multipart/form-data. More info on Sending Files »
     * @param caption Photo caption (may also be used when resending photos by file_id), 0-1024 characters after entities parsing
     * @param parse_mode Mode for parsing entities in the photo caption. See formatting options for more details.
     * @param caption_entities List of special entities that appear in the caption, which can be specified instead of parse_mode
     * @param disable_notification Sends the message silently. Users will receive a notification with no sound.
     * @param reply_to_message_id If the message is a reply, ID of the original message
     * @param allow_sending_without_reply Pass true, if the message should be sent even if the specified replied-to message is not found
     * @param reply_markup Additional interface options. A JSON-serialized object for an inline keyboard, custom reply keyboard, instructions to remove reply keyboard or to force a reply from the user.
     */
    async sendPhoto(obj: { chat_id: number | string, photo: InputFile | string, caption?: string, parse_mode?: string, caption_entities?: MessageEntity[], disable_notification?: boolean, reply_to_message_id?: number, allow_sending_without_reply?: boolean, reply_markup?: (InlineKeyboardMarkup | ReplyKeyboardMarkup | ReplyKeyboardRemove | ForceReply), }) {
        return this.fetch("sendPhoto", { chat_id: obj.chat_id, photo: obj.photo, caption: obj.caption, parse_mode: obj.parse_mode, caption_entities: obj.caption_entities, disable_notification: obj.disable_notification, reply_to_message_id: obj.reply_to_message_id, allow_sending_without_reply: obj.allow_sending_without_reply, reply_markup: obj.reply_markup, });
    }

    /**
     *
     * @param chat_id Unique identifier for the target chat or username of the target channel (in the format @channelusername)
     * @param audio Audio file to send. Pass a file_id as string to send an audio file that exists on the Telegram servers (recommended), pass an HTTP URL as a string for Telegram to get an audio file from the Internet, or upload a new one using multipart/form-data. More info on Sending Files »
     * @param caption Audio caption, 0-1024 characters after entities parsing
     * @param parse_mode Mode for parsing entities in the audio caption. See formatting options for more details.
     * @param caption_entities List of special entities that appear in the caption, which can be specified instead of parse_mode
     * @param duration Duration of the audio in seconds
     * @param performer Performer
     * @param title Track name
     * @param thumb Thumbnail of the file sent; can be ignored if thumbnail generation for the file is supported server-side. The thumbnail should be in JPEG format and less than 200 kB in size. A thumbnail&#x27;s width and height should not exceed 320. Ignored if the file is not uploaded using multipart/form-data. Thumbnails can&#x27;t be reused and can be only uploaded as a new file, so you can pass “attach://&lt;file_attach_name&gt;” if the thumbnail was uploaded using multipart/form-data under &lt;file_attach_name&gt;. More info on Sending Files »
     * @param disable_notification Sends the message silently. Users will receive a notification with no sound.
     * @param reply_to_message_id If the message is a reply, ID of the original message
     * @param allow_sending_without_reply Pass true, if the message should be sent even if the specified replied-to message is not found
     * @param reply_markup Additional interface options. A JSON-serialized object for an inline keyboard, custom reply keyboard, instructions to remove reply keyboard or to force a reply from the user.
     */
    async sendAudio(obj: { chat_id: number | string, audio: InputFile | string, caption?: string, parse_mode?: string, caption_entities?: MessageEntity[], duration?: number, performer?: string, title?: string, thumb?: InputFile | string, disable_notification?: boolean, reply_to_message_id?: number, allow_sending_without_reply?: boolean, reply_markup?: (InlineKeyboardMarkup | ReplyKeyboardMarkup | ReplyKeyboardRemove | ForceReply), }) {
        return this.fetch("sendAudio", { chat_id: obj.chat_id, audio: obj.audio, caption: obj.caption, parse_mode: obj.parse_mode, caption_entities: obj.caption_entities, duration: obj.duration, performer: obj.performer, title: obj.title, thumb: obj.thumb, disable_notification: obj.disable_notification, reply_to_message_id: obj.reply_to_message_id, allow_sending_without_reply: obj.allow_sending_without_reply, reply_markup: obj.reply_markup, });
    }

    /**
     *
     * @param chat_id Unique identifier for the target chat or username of the target channel (in the format @channelusername)
     * @param document File to send. Pass a file_id as string to send a file that exists on the Telegram servers (recommended), pass an HTTP URL as a string for Telegram to get a file from the Internet, or upload a new one using multipart/form-data. More info on Sending Files »
     * @param thumb Thumbnail of the file sent; can be ignored if thumbnail generation for the file is supported server-side. The thumbnail should be in JPEG format and less than 200 kB in size. A thumbnail&#x27;s width and height should not exceed 320. Ignored if the file is not uploaded using multipart/form-data. Thumbnails can&#x27;t be reused and can be only uploaded as a new file, so you can pass “attach://&lt;file_attach_name&gt;” if the thumbnail was uploaded using multipart/form-data under &lt;file_attach_name&gt;. More info on Sending Files »
     * @param caption Document caption (may also be used when resending documents by file_id), 0-1024 characters after entities parsing
     * @param parse_mode Mode for parsing entities in the document caption. See formatting options for more details.
     * @param caption_entities List of special entities that appear in the caption, which can be specified instead of parse_mode
     * @param disable_content_type_detection Disables automatic server-side content type detection for files uploaded using multipart/form-data
     * @param disable_notification Sends the message silently. Users will receive a notification with no sound.
     * @param reply_to_message_id If the message is a reply, ID of the original message
     * @param allow_sending_without_reply Pass true, if the message should be sent even if the specified replied-to message is not found
     * @param reply_markup Additional interface options. A JSON-serialized object for an inline keyboard, custom reply keyboard, instructions to remove reply keyboard or to force a reply from the user.
     */
    async sendDocument(obj: { chat_id: number | string, document: InputFile | string, thumb?: InputFile | string, caption?: string, parse_mode?: string, caption_entities?: MessageEntity[], disable_content_type_detection?: boolean, disable_notification?: boolean, reply_to_message_id?: number, allow_sending_without_reply?: boolean, reply_markup?: (InlineKeyboardMarkup | ReplyKeyboardMarkup | ReplyKeyboardRemove | ForceReply), }) {
        return this.fetch("sendDocument", { chat_id: obj.chat_id, document: obj.document, thumb: obj.thumb, caption: obj.caption, parse_mode: obj.parse_mode, caption_entities: obj.caption_entities, disable_content_type_detection: obj.disable_content_type_detection, disable_notification: obj.disable_notification, reply_to_message_id: obj.reply_to_message_id, allow_sending_without_reply: obj.allow_sending_without_reply, reply_markup: obj.reply_markup, });
    }

    /**
     *
     * @param chat_id Unique identifier for the target chat or username of the target channel (in the format @channelusername)
     * @param video Video to send. Pass a file_id as string to send a video that exists on the Telegram servers (recommended), pass an HTTP URL as a string for Telegram to get a video from the Internet, or upload a new video using multipart/form-data. More info on Sending Files »
     * @param duration Duration of sent video in seconds
     * @param width Video width
     * @param height Video height
     * @param thumb Thumbnail of the file sent; can be ignored if thumbnail generation for the file is supported server-side. The thumbnail should be in JPEG format and less than 200 kB in size. A thumbnail&#x27;s width and height should not exceed 320. Ignored if the file is not uploaded using multipart/form-data. Thumbnails can&#x27;t be reused and can be only uploaded as a new file, so you can pass “attach://&lt;file_attach_name&gt;” if the thumbnail was uploaded using multipart/form-data under &lt;file_attach_name&gt;. More info on Sending Files »
     * @param caption Video caption (may also be used when resending videos by file_id), 0-1024 characters after entities parsing
     * @param parse_mode Mode for parsing entities in the video caption. See formatting options for more details.
     * @param caption_entities List of special entities that appear in the caption, which can be specified instead of parse_mode
     * @param supports_streaming Pass true, if the uploaded video is suitable for streaming
     * @param disable_notification Sends the message silently. Users will receive a notification with no sound.
     * @param reply_to_message_id If the message is a reply, ID of the original message
     * @param allow_sending_without_reply Pass true, if the message should be sent even if the specified replied-to message is not found
     * @param reply_markup Additional interface options. A JSON-serialized object for an inline keyboard, custom reply keyboard, instructions to remove reply keyboard or to force a reply from the user.
     */
    async sendVideo(obj: { chat_id: number | string, video: InputFile | string, duration?: number, width?: number, height?: number, thumb?: InputFile | string, caption?: string, parse_mode?: string, caption_entities?: MessageEntity[], supports_streaming?: boolean, disable_notification?: boolean, reply_to_message_id?: number, allow_sending_without_reply?: boolean, reply_markup?: (InlineKeyboardMarkup | ReplyKeyboardMarkup | ReplyKeyboardRemove | ForceReply), }) {
        return this.fetch("sendVideo", { chat_id: obj.chat_id, video: obj.video, duration: obj.duration, width: obj.width, height: obj.height, thumb: obj.thumb, caption: obj.caption, parse_mode: obj.parse_mode, caption_entities: obj.caption_entities, supports_streaming: obj.supports_streaming, disable_notification: obj.disable_notification, reply_to_message_id: obj.reply_to_message_id, allow_sending_without_reply: obj.allow_sending_without_reply, reply_markup: obj.reply_markup, });
    }

    /**
     *
     * @param chat_id Unique identifier for the target chat or username of the target channel (in the format @channelusername)
     * @param animation Animation to send. Pass a file_id as string to send an animation that exists on the Telegram servers (recommended), pass an HTTP URL as a string for Telegram to get an animation from the Internet, or upload a new animation using multipart/form-data. More info on Sending Files »
     * @param duration Duration of sent animation in seconds
     * @param width Animation width
     * @param height Animation height
     * @param thumb Thumbnail of the file sent; can be ignored if thumbnail generation for the file is supported server-side. The thumbnail should be in JPEG format and less than 200 kB in size. A thumbnail&#x27;s width and height should not exceed 320. Ignored if the file is not uploaded using multipart/form-data. Thumbnails can&#x27;t be reused and can be only uploaded as a new file, so you can pass “attach://&lt;file_attach_name&gt;” if the thumbnail was uploaded using multipart/form-data under &lt;file_attach_name&gt;. More info on Sending Files »
     * @param caption Animation caption (may also be used when resending animation by file_id), 0-1024 characters after entities parsing
     * @param parse_mode Mode for parsing entities in the animation caption. See formatting options for more details.
     * @param caption_entities List of special entities that appear in the caption, which can be specified instead of parse_mode
     * @param disable_notification Sends the message silently. Users will receive a notification with no sound.
     * @param reply_to_message_id If the message is a reply, ID of the original message
     * @param allow_sending_without_reply Pass true, if the message should be sent even if the specified replied-to message is not found
     * @param reply_markup Additional interface options. A JSON-serialized object for an inline keyboard, custom reply keyboard, instructions to remove reply keyboard or to force a reply from the user.
     */
    async sendAnimation(obj: { chat_id: number | string, animation: InputFile | string, duration?: number, width?: number, height?: number, thumb?: InputFile | string, caption?: string, parse_mode?: string, caption_entities?: MessageEntity[], disable_notification?: boolean, reply_to_message_id?: number, allow_sending_without_reply?: boolean, reply_markup?: (InlineKeyboardMarkup | ReplyKeyboardMarkup | ReplyKeyboardRemove | ForceReply), }) {
        return this.fetch("sendAnimation", { chat_id: obj.chat_id, animation: obj.animation, duration: obj.duration, width: obj.width, height: obj.height, thumb: obj.thumb, caption: obj.caption, parse_mode: obj.parse_mode, caption_entities: obj.caption_entities, disable_notification: obj.disable_notification, reply_to_message_id: obj.reply_to_message_id, allow_sending_without_reply: obj.allow_sending_without_reply, reply_markup: obj.reply_markup, });
    }

    /**
     *
     * @param chat_id Unique identifier for the target chat or username of the target channel (in the format @channelusername)
     * @param voice Audio file to send. Pass a file_id as string to send a file that exists on the Telegram servers (recommended), pass an HTTP URL as a string for Telegram to get a file from the Internet, or upload a new one using multipart/form-data. More info on Sending Files »
     * @param caption Voice message caption, 0-1024 characters after entities parsing
     * @param parse_mode Mode for parsing entities in the voice message caption. See formatting options for more details.
     * @param caption_entities List of special entities that appear in the caption, which can be specified instead of parse_mode
     * @param duration Duration of the voice message in seconds
     * @param disable_notification Sends the message silently. Users will receive a notification with no sound.
     * @param reply_to_message_id If the message is a reply, ID of the original message
     * @param allow_sending_without_reply Pass true, if the message should be sent even if the specified replied-to message is not found
     * @param reply_markup Additional interface options. A JSON-serialized object for an inline keyboard, custom reply keyboard, instructions to remove reply keyboard or to force a reply from the user.
     */
    async sendVoice(obj: { chat_id: number | string, voice: InputFile | string, caption?: string, parse_mode?: string, caption_entities?: MessageEntity[], duration?: number, disable_notification?: boolean, reply_to_message_id?: number, allow_sending_without_reply?: boolean, reply_markup?: (InlineKeyboardMarkup | ReplyKeyboardMarkup | ReplyKeyboardRemove | ForceReply), }) {
        return this.fetch("sendVoice", { chat_id: obj.chat_id, voice: obj.voice, caption: obj.caption, parse_mode: obj.parse_mode, caption_entities: obj.caption_entities, duration: obj.duration, disable_notification: obj.disable_notification, reply_to_message_id: obj.reply_to_message_id, allow_sending_without_reply: obj.allow_sending_without_reply, reply_markup: obj.reply_markup, });
    }

    /**
     *
     * @param chat_id Unique identifier for the target chat or username of the target channel (in the format @channelusername)
     * @param video_note Video note to send. Pass a file_id as string to send a video note that exists on the Telegram servers (recommended) or upload a new video using multipart/form-data. More info on Sending Files ». Sending video notes by a URL is currently unsupported
     * @param duration Duration of sent video in seconds
     * @param length Video width and height, i.e. diameter of the video message
     * @param thumb Thumbnail of the file sent; can be ignored if thumbnail generation for the file is supported server-side. The thumbnail should be in JPEG format and less than 200 kB in size. A thumbnail&#x27;s width and height should not exceed 320. Ignored if the file is not uploaded using multipart/form-data. Thumbnails can&#x27;t be reused and can be only uploaded as a new file, so you can pass “attach://&lt;file_attach_name&gt;” if the thumbnail was uploaded using multipart/form-data under &lt;file_attach_name&gt;. More info on Sending Files »
     * @param disable_notification Sends the message silently. Users will receive a notification with no sound.
     * @param reply_to_message_id If the message is a reply, ID of the original message
     * @param allow_sending_without_reply Pass true, if the message should be sent even if the specified replied-to message is not found
     * @param reply_markup Additional interface options. A JSON-serialized object for an inline keyboard, custom reply keyboard, instructions to remove reply keyboard or to force a reply from the user.
     */
    async sendVideoNote(obj: { chat_id: number | string, video_note: InputFile | string, duration?: number, length?: number, thumb?: InputFile | string, disable_notification?: boolean, reply_to_message_id?: number, allow_sending_without_reply?: boolean, reply_markup?: (InlineKeyboardMarkup | ReplyKeyboardMarkup | ReplyKeyboardRemove | ForceReply), }) {
        return this.fetch("sendVideoNote", { chat_id: obj.chat_id, video_note: obj.video_note, duration: obj.duration, length: obj.length, thumb: obj.thumb, disable_notification: obj.disable_notification, reply_to_message_id: obj.reply_to_message_id, allow_sending_without_reply: obj.allow_sending_without_reply, reply_markup: obj.reply_markup, });
    }

    /**
     *
     * @param chat_id Unique identifier for the target chat or username of the target channel (in the format @channelusername)
     * @param media A JSON-serialized array describing messages to be sent, must include 2-10 items
     * @param disable_notification Sends messages silently. Users will receive a notification with no sound.
     * @param reply_to_message_id If the messages are a reply, ID of the original message
     * @param allow_sending_without_reply Pass true, if the message should be sent even if the specified replied-to message is not found
     */
    async sendMediaGroup(obj: { chat_id: number | string, media: (InputMediaAudio | InputMediaDocument | InputMediaPhoto | InputMediaVideo)[], disable_notification?: boolean, reply_to_message_id?: number, allow_sending_without_reply?: boolean, }) {
        return this.fetch("sendMediaGroup", { chat_id: obj.chat_id, media: obj.media, disable_notification: obj.disable_notification, reply_to_message_id: obj.reply_to_message_id, allow_sending_without_reply: obj.allow_sending_without_reply, });
    }

    /**
     *
     * @param chat_id Unique identifier for the target chat or username of the target channel (in the format @channelusername)
     * @param latitude Latitude of the location
     * @param longitude Longitude of the location
     * @param horizontal_accuracy The radius of uncertainty for the location, measured in meters; 0-1500
     * @param live_period Period in seconds for which the location will be updated (see Live Locations, should be between 60 and 86400.
     * @param heading For live locations, a direction in which the user is moving, in degrees. Must be between 1 and 360 if specified.
     * @param proximity_alert_radius For live locations, a maximum distance for proximity alerts about approaching another chat member, in meters. Must be between 1 and 100000 if specified.
     * @param disable_notification Sends the message silently. Users will receive a notification with no sound.
     * @param reply_to_message_id If the message is a reply, ID of the original message
     * @param allow_sending_without_reply Pass true, if the message should be sent even if the specified replied-to message is not found
     * @param reply_markup Additional interface options. A JSON-serialized object for an inline keyboard, custom reply keyboard, instructions to remove reply keyboard or to force a reply from the user.
     */
    async sendLocation(obj: { chat_id: number | string, latitude: number, longitude: number, horizontal_accuracy?: number, live_period?: number, heading?: number, proximity_alert_radius?: number, disable_notification?: boolean, reply_to_message_id?: number, allow_sending_without_reply?: boolean, reply_markup?: (InlineKeyboardMarkup | ReplyKeyboardMarkup | ReplyKeyboardRemove | ForceReply), }) {
        return this.fetch("sendLocation", { chat_id: obj.chat_id, latitude: obj.latitude, longitude: obj.longitude, horizontal_accuracy: obj.horizontal_accuracy, live_period: obj.live_period, heading: obj.heading, proximity_alert_radius: obj.proximity_alert_radius, disable_notification: obj.disable_notification, reply_to_message_id: obj.reply_to_message_id, allow_sending_without_reply: obj.allow_sending_without_reply, reply_markup: obj.reply_markup, });
    }

    /**
     *
     * @param chat_id Required if inline_message_id is not specified. Unique identifier for the target chat or username of the target channel (in the format @channelusername)
     * @param message_id Required if inline_message_id is not specified. Identifier of the message to edit
     * @param inline_message_id Required if chat_id and message_id are not specified. Identifier of the inline message
     * @param latitude Latitude of new location
     * @param longitude Longitude of new location
     * @param horizontal_accuracy The radius of uncertainty for the location, measured in meters; 0-1500
     * @param heading Direction in which the user is moving, in degrees. Must be between 1 and 360 if specified.
     * @param proximity_alert_radius Maximum distance for proximity alerts about approaching another chat member, in meters. Must be between 1 and 100000 if specified.
     * @param reply_markup A JSON-serialized object for a new inline keyboard.
     */
    async editMessageLiveLocation(obj: { latitude: number, longitude: number, chat_id?: number | string, message_id?: number, inline_message_id?: string, horizontal_accuracy?: number, heading?: number, proximity_alert_radius?: number, reply_markup?: InlineKeyboardMarkup, }) {
        return this.fetch("editMessageLiveLocation", { chat_id: obj.chat_id, message_id: obj.message_id, inline_message_id: obj.inline_message_id, latitude: obj.latitude, longitude: obj.longitude, horizontal_accuracy: obj.horizontal_accuracy, heading: obj.heading, proximity_alert_radius: obj.proximity_alert_radius, reply_markup: obj.reply_markup, });
    }

    /**
     *
     * @param chat_id Required if inline_message_id is not specified. Unique identifier for the target chat or username of the target channel (in the format @channelusername)
     * @param message_id Required if inline_message_id is not specified. Identifier of the message with live location to stop
     * @param inline_message_id Required if chat_id and message_id are not specified. Identifier of the inline message
     * @param reply_markup A JSON-serialized object for a new inline keyboard.
     */
    async stopMessageLiveLocation(obj: { chat_id?: number | string, message_id?: number, inline_message_id?: string, reply_markup?: InlineKeyboardMarkup, }) {
        return this.fetch("stopMessageLiveLocation", { chat_id: obj.chat_id, message_id: obj.message_id, inline_message_id: obj.inline_message_id, reply_markup: obj.reply_markup, });
    }

    /**
     *
     * @param chat_id Unique identifier for the target chat or username of the target channel (in the format @channelusername)
     * @param latitude Latitude of the venue
     * @param longitude Longitude of the venue
     * @param title Name of the venue
     * @param address Address of the venue
     * @param foursquare_id Foursquare identifier of the venue
     * @param foursquare_type Foursquare type of the venue, if known. (For example, “arts_entertainment/default”, “arts_entertainment/aquarium” or “food/icecream”.)
     * @param google_place_id Google Places identifier of the venue
     * @param google_place_type Google Places type of the venue. (See supported types.)
     * @param disable_notification Sends the message silently. Users will receive a notification with no sound.
     * @param reply_to_message_id If the message is a reply, ID of the original message
     * @param allow_sending_without_reply Pass true, if the message should be sent even if the specified replied-to message is not found
     * @param reply_markup Additional interface options. A JSON-serialized object for an inline keyboard, custom reply keyboard, instructions to remove reply keyboard or to force a reply from the user.
     */
    async sendVenue(obj: { chat_id: number | string, latitude: number, longitude: number, title: string, address: string, foursquare_id?: string, foursquare_type?: string, google_place_id?: string, google_place_type?: string, disable_notification?: boolean, reply_to_message_id?: number, allow_sending_without_reply?: boolean, reply_markup?: (InlineKeyboardMarkup | ReplyKeyboardMarkup | ReplyKeyboardRemove | ForceReply), }) {
        return this.fetch("sendVenue", { chat_id: obj.chat_id, latitude: obj.latitude, longitude: obj.longitude, title: obj.title, address: obj.address, foursquare_id: obj.foursquare_id, foursquare_type: obj.foursquare_type, google_place_id: obj.google_place_id, google_place_type: obj.google_place_type, disable_notification: obj.disable_notification, reply_to_message_id: obj.reply_to_message_id, allow_sending_without_reply: obj.allow_sending_without_reply, reply_markup: obj.reply_markup, });
    }

    /**
     *
     * @param chat_id Unique identifier for the target chat or username of the target channel (in the format @channelusername)
     * @param phone_number Contact&#x27;s phone number
     * @param first_name Contact&#x27;s first name
     * @param last_name Contact&#x27;s last name
     * @param vcard Additional data about the contact in the form of a vCard, 0-2048 bytes
     * @param disable_notification Sends the message silently. Users will receive a notification with no sound.
     * @param reply_to_message_id If the message is a reply, ID of the original message
     * @param allow_sending_without_reply Pass true, if the message should be sent even if the specified replied-to message is not found
     * @param reply_markup Additional interface options. A JSON-serialized object for an inline keyboard, custom reply keyboard, instructions to remove keyboard or to force a reply from the user.
     */
    async sendContact(obj: { chat_id: number | string, phone_number: string, first_name: string, last_name?: string, vcard?: string, disable_notification?: boolean, reply_to_message_id?: number, allow_sending_without_reply?: boolean, reply_markup?: (InlineKeyboardMarkup | ReplyKeyboardMarkup | ReplyKeyboardRemove | ForceReply), }) {
        return this.fetch("sendContact", { chat_id: obj.chat_id, phone_number: obj.phone_number, first_name: obj.first_name, last_name: obj.last_name, vcard: obj.vcard, disable_notification: obj.disable_notification, reply_to_message_id: obj.reply_to_message_id, allow_sending_without_reply: obj.allow_sending_without_reply, reply_markup: obj.reply_markup, });
    }

    /**
     *
     * @param chat_id Unique identifier for the target chat or username of the target channel (in the format @channelusername)
     * @param question Poll question, 1-300 characters
     * @param options A JSON-serialized list of answer options, 2-10 strings 1-100 characters each
     * @param is_anonymous true, if the poll needs to be anonymous, defaults to true
     * @param type Poll type, “quiz” or “regular”, defaults to “regular”
     * @param allows_multiple_answers true, if the poll allows multiple answers, ignored for polls in quiz mode, defaults to false
     * @param correct_option_id 0-based identifier of the correct answer option, required for polls in quiz mode
     * @param explanation Text that is shown when a user chooses an incorrect answer or taps on the lamp icon in a quiz-style poll, 0-200 characters with at most 2 line feeds after entities parsing
     * @param explanation_parse_mode Mode for parsing entities in the explanation. See formatting options for more details.
     * @param explanation_entities List of special entities that appear in the poll explanation, which can be specified instead of parse_mode
     * @param open_period Amount of time in seconds the poll will be active after creation, 5-600. Can&#x27;t be used together with close_date.
     * @param close_date Point in time (Unix timestamp) when the poll will be automatically closed. Must be at least 5 and no more than 600 seconds in the future. Can&#x27;t be used together with open_period.
     * @param is_closed Pass true, if the poll needs to be immediately closed. This can be useful for poll preview.
     * @param disable_notification Sends the message silently. Users will receive a notification with no sound.
     * @param reply_to_message_id If the message is a reply, ID of the original message
     * @param allow_sending_without_reply Pass true, if the message should be sent even if the specified replied-to message is not found
     * @param reply_markup Additional interface options. A JSON-serialized object for an inline keyboard, custom reply keyboard, instructions to remove reply keyboard or to force a reply from the user.
     */
    async sendPoll(obj: { chat_id: number | string, question: string, options: string[], is_anonymous?: boolean, type?: string, allows_multiple_answers?: boolean, correct_option_id?: number, explanation?: string, explanation_parse_mode?: string, explanation_entities?: MessageEntity[], open_period?: number, close_date?: number, is_closed?: boolean, disable_notification?: boolean, reply_to_message_id?: number, allow_sending_without_reply?: boolean, reply_markup?: (InlineKeyboardMarkup | ReplyKeyboardMarkup | ReplyKeyboardRemove | ForceReply), }) {
        return this.fetch("sendPoll", { chat_id: obj.chat_id, question: obj.question, options: obj.options, is_anonymous: obj.is_anonymous, type: obj.type, allows_multiple_answers: obj.allows_multiple_answers, correct_option_id: obj.correct_option_id, explanation: obj.explanation, explanation_parse_mode: obj.explanation_parse_mode, explanation_entities: obj.explanation_entities, open_period: obj.open_period, close_date: obj.close_date, is_closed: obj.is_closed, disable_notification: obj.disable_notification, reply_to_message_id: obj.reply_to_message_id, allow_sending_without_reply: obj.allow_sending_without_reply, reply_markup: obj.reply_markup, });
    }

    /**
     *
     * @param chat_id Unique identifier for the target chat or username of the target channel (in the format @channelusername)
     * @param emoji Emoji on which the dice throw animation is based. Currently, must be one of “”, “”, “”, “”, or “”. Dice can have values 1-6 for “” and “”, values 1-5 for “” and “”, and values 1-64 for “”. Defaults to “”
     * @param disable_notification Sends the message silently. Users will receive a notification with no sound.
     * @param reply_to_message_id If the message is a reply, ID of the original message
     * @param allow_sending_without_reply Pass true, if the message should be sent even if the specified replied-to message is not found
     * @param reply_markup Additional interface options. A JSON-serialized object for an inline keyboard, custom reply keyboard, instructions to remove reply keyboard or to force a reply from the user.
     */
    async sendDice(obj: { chat_id: number | string, emoji?: string, disable_notification?: boolean, reply_to_message_id?: number, allow_sending_without_reply?: boolean, reply_markup?: (InlineKeyboardMarkup | ReplyKeyboardMarkup | ReplyKeyboardRemove | ForceReply), }) {
        return this.fetch("sendDice", { chat_id: obj.chat_id, emoji: obj.emoji, disable_notification: obj.disable_notification, reply_to_message_id: obj.reply_to_message_id, allow_sending_without_reply: obj.allow_sending_without_reply, reply_markup: obj.reply_markup, });
    }

    /**
     *
     * @param chat_id Unique identifier for the target chat or username of the target channel (in the format @channelusername)
     * @param action Type of action to broadcast. Choose one, depending on what the user is about to receive: typing for text messages, upload_photo for photos, record_video or upload_video for videos, record_voice or upload_voice for voice notes, upload_document for general files, find_location for location data, record_video_note or upload_video_note for video notes.
     */
    async sendChatAction(obj: { chat_id: number | string, action: string, }) {
        return this.fetch("sendChatAction", { chat_id: obj.chat_id, action: obj.action, });
    }

    /**
     *
     * @param user_id Unique identifier of the target user
     * @param offset Sequential number of the first photo to be returned. By default, all photos are returned.
     * @param limit Limits the number of photos to be retrieved. Values between 1-100 are accepted. Defaults to 100.
     */
    async getUserProfilePhotos(obj: { user_id: number, offset?: number, limit?: number, }) {
        return this.fetch("getUserProfilePhotos", { user_id: obj.user_id, offset: obj.offset, limit: obj.limit, });
    }

    /**
     *
     * @param file_id File identifier to get info about
     */
    async getFile(obj: { file_id: string, }) {
        return this.fetch("getFile", { file_id: obj.file_id, });
    }

    /**
     *
     * @param chat_id Unique identifier for the target group or username of the target supergroup or channel (in the format @channelusername)
     * @param user_id Unique identifier of the target user
     * @param until_date Date when the user will be unbanned, unix time. If user is banned for more than 366 days or less than 30 seconds from the current time they are considered to be banned forever
     */
    async kickChatMember(obj: { chat_id: number | string, user_id: number, until_date?: number, }) {
        return this.fetch("kickChatMember", { chat_id: obj.chat_id, user_id: obj.user_id, until_date: obj.until_date, });
    }

    /**
     *
     * @param chat_id Unique identifier for the target group or username of the target supergroup or channel (in the format @username)
     * @param user_id Unique identifier of the target user
     * @param only_if_banned Do nothing if the user is not banned
     */
    async unbanChatMember(obj: { chat_id: number | string, user_id: number, only_if_banned?: boolean, }) {
        return this.fetch("unbanChatMember", { chat_id: obj.chat_id, user_id: obj.user_id, only_if_banned: obj.only_if_banned, });
    }

    /**
     *
     * @param chat_id Unique identifier for the target chat or username of the target supergroup (in the format @supergroupusername)
     * @param user_id Unique identifier of the target user
     * @param permissions A JSON-serialized object for new user permissions
     * @param until_date Date when restrictions will be lifted for the user, unix time. If user is restricted for more than 366 days or less than 30 seconds from the current time, they are considered to be restricted forever
     */
    async restrictChatMember(obj: { chat_id: number | string, user_id: number, permissions: ChatPermissions, until_date?: number, }) {
        return this.fetch("restrictChatMember", { chat_id: obj.chat_id, user_id: obj.user_id, permissions: obj.permissions, until_date: obj.until_date, });
    }

    /**
     *
     * @param chat_id Unique identifier for the target chat or username of the target channel (in the format @channelusername)
     * @param user_id Unique identifier of the target user
     * @param is_anonymous Pass true, if the administrator&#x27;s presence in the chat is hidden
     * @param can_change_info Pass true, if the administrator can change chat title, photo and other settings
     * @param can_post_messages Pass true, if the administrator can create channel posts, channels only
     * @param can_edit_messages Pass true, if the administrator can edit messages of other users and can pin messages, channels only
     * @param can_delete_messages Pass true, if the administrator can delete messages of other users
     * @param can_invite_users Pass true, if the administrator can invite new users to the chat
     * @param can_restrict_members Pass true, if the administrator can restrict, ban or unban chat members
     * @param can_pin_messages Pass true, if the administrator can pin messages, supergroups only
     * @param can_promote_members Pass true, if the administrator can add new administrators with a subset of their own privileges or demote administrators that he has promoted, directly or indirectly (promoted by administrators that were appointed by him)
     */
    async promoteChatMember(obj: { chat_id: number | string, user_id: number, is_anonymous?: boolean, can_change_info?: boolean, can_post_messages?: boolean, can_edit_messages?: boolean, can_delete_messages?: boolean, can_invite_users?: boolean, can_restrict_members?: boolean, can_pin_messages?: boolean, can_promote_members?: boolean, }) {
        return this.fetch("promoteChatMember", { chat_id: obj.chat_id, user_id: obj.user_id, is_anonymous: obj.is_anonymous, can_change_info: obj.can_change_info, can_post_messages: obj.can_post_messages, can_edit_messages: obj.can_edit_messages, can_delete_messages: obj.can_delete_messages, can_invite_users: obj.can_invite_users, can_restrict_members: obj.can_restrict_members, can_pin_messages: obj.can_pin_messages, can_promote_members: obj.can_promote_members, });
    }

    /**
     *
     * @param chat_id Unique identifier for the target chat or username of the target supergroup (in the format @supergroupusername)
     * @param user_id Unique identifier of the target user
     * @param custom_title New custom title for the administrator; 0-16 characters, emoji are not allowed
     */
    async setChatAdministratorCustomTitle(obj: { chat_id: number | string, user_id: number, custom_title: string, }) {
        return this.fetch("setChatAdministratorCustomTitle", { chat_id: obj.chat_id, user_id: obj.user_id, custom_title: obj.custom_title, });
    }

    /**
     *
     * @param chat_id Unique identifier for the target chat or username of the target supergroup (in the format @supergroupusername)
     * @param permissions New default chat permissions
     */
    async setChatPermissions(obj: { chat_id: number | string, permissions: ChatPermissions, }) {
        return this.fetch("setChatPermissions", { chat_id: obj.chat_id, permissions: obj.permissions, });
    }

    /**
     *
     * @param chat_id Unique identifier for the target chat or username of the target channel (in the format @channelusername)
     */
    async exportChatInviteLink(obj: { chat_id: number | string, }) {
        return this.fetch("exportChatInviteLink", { chat_id: obj.chat_id, });
    }

    /**
     *
     * @param chat_id Unique identifier for the target chat or username of the target channel (in the format @channelusername)
     * @param photo New chat photo, uploaded using multipart/form-data
     */
    async setChatPhoto(obj: { chat_id: number | string, photo: InputFile, }) {
        return this.fetch("setChatPhoto", { chat_id: obj.chat_id, photo: obj.photo, });
    }

    /**
     *
     * @param chat_id Unique identifier for the target chat or username of the target channel (in the format @channelusername)
     */
    async deleteChatPhoto(obj: { chat_id: number | string, }) {
        return this.fetch("deleteChatPhoto", { chat_id: obj.chat_id, });
    }

    /**
     *
     * @param chat_id Unique identifier for the target chat or username of the target channel (in the format @channelusername)
     * @param title New chat title, 1-255 characters
     */
    async setChatTitle(obj: { chat_id: number | string, title: string, }) {
        return this.fetch("setChatTitle", { chat_id: obj.chat_id, title: obj.title, });
    }

    /**
     *
     * @param chat_id Unique identifier for the target chat or username of the target channel (in the format @channelusername)
     * @param description New chat description, 0-255 characters
     */
    async setChatDescription(obj: { chat_id: number | string, description?: string, }) {
        return this.fetch("setChatDescription", { chat_id: obj.chat_id, description: obj.description, });
    }

    /**
     *
     * @param chat_id Unique identifier for the target chat or username of the target channel (in the format @channelusername)
     * @param message_id Identifier of a message to pin
     * @param disable_notification Pass true, if it is not necessary to send a notification to all chat members about the new pinned message. Notifications are always disabled in channels and private chats.
     */
    async pinChatMessage(obj: { chat_id: number | string, message_id: number, disable_notification?: boolean, }) {
        return this.fetch("pinChatMessage", { chat_id: obj.chat_id, message_id: obj.message_id, disable_notification: obj.disable_notification, });
    }

    /**
     *
     * @param chat_id Unique identifier for the target chat or username of the target channel (in the format @channelusername)
     * @param message_id Identifier of a message to unpin. If not specified, the most recent pinned message (by sending date) will be unpinned.
     */
    async unpinChatMessage(obj: { chat_id: number | string, message_id?: number, }) {
        return this.fetch("unpinChatMessage", { chat_id: obj.chat_id, message_id: obj.message_id, });
    }

    /**
     *
     * @param chat_id Unique identifier for the target chat or username of the target channel (in the format @channelusername)
     */
    async unpinAllChatMessages(obj: { chat_id: number | string, }) {
        return this.fetch("unpinAllChatMessages", { chat_id: obj.chat_id, });
    }

    /**
     *
     * @param chat_id Unique identifier for the target chat or username of the target supergroup or channel (in the format @channelusername)
     */
    async leaveChat(obj: { chat_id: number | string, }) {
        return this.fetch("leaveChat", { chat_id: obj.chat_id, });
    }

    /**
     *
     * @param chat_id Unique identifier for the target chat or username of the target supergroup or channel (in the format @channelusername)
     */
    async getChat(obj: { chat_id: number | string, }) {
        return this.fetch("getChat", { chat_id: obj.chat_id, });
    }

    /**
     *
     * @param chat_id Unique identifier for the target chat or username of the target supergroup or channel (in the format @channelusername)
     */
    async getChatAdministrators(obj: { chat_id: number | string, }) {
        return this.fetch("getChatAdministrators", { chat_id: obj.chat_id, });
    }

    /**
     *
     * @param chat_id Unique identifier for the target chat or username of the target supergroup or channel (in the format @channelusername)
     */
    async getChatMembersCount(obj: { chat_id: number | string, }) {
        return this.fetch("getChatMembersCount", { chat_id: obj.chat_id, });
    }

    /**
     *
     * @param chat_id Unique identifier for the target chat or username of the target supergroup or channel (in the format @channelusername)
     * @param user_id Unique identifier of the target user
     */
    async getChatMember(obj: { chat_id: number | string, user_id: number, }) {
        return this.fetch("getChatMember", { chat_id: obj.chat_id, user_id: obj.user_id, });
    }

    /**
     *
     * @param chat_id Unique identifier for the target chat or username of the target supergroup (in the format @supergroupusername)
     * @param sticker_set_name Name of the sticker set to be set as the group sticker set
     */
    async setChatStickerSet(obj: { chat_id: number | string, sticker_set_name: string, }) {
        return this.fetch("setChatStickerSet", { chat_id: obj.chat_id, sticker_set_name: obj.sticker_set_name, });
    }

    /**
     *
     * @param chat_id Unique identifier for the target chat or username of the target supergroup (in the format @supergroupusername)
     */
    async deleteChatStickerSet(obj: { chat_id: number | string, }) {
        return this.fetch("deleteChatStickerSet", { chat_id: obj.chat_id, });
    }

    /**
     *
     * @param callback_query_id Unique identifier for the query to be answered
     * @param text Text of the notification. If not specified, nothing will be shown to the user, 0-200 characters
     * @param show_alert If true, an alert will be shown by the client instead of a notification at the top of the chat screen. Defaults to false.
     * @param url URL that will be opened by the user&#x27;s client. If you have created a Game and accepted the conditions via @Botfather, specify the URL that opens your game — note that this will only work if the query comes from a callback_game button.Otherwise, you may use links like t.me/your_bot?start&#x3D;XXXX that open your bot with a parameter.
     * @param cache_time The maximum amount of time in seconds that the result of the callback query may be cached client-side. Telegram apps will support caching starting in version 3.14. Defaults to 0.
     */
    async answerCallbackQuery(obj: { callback_query_id: string, text?: string, show_alert?: boolean, url?: string, cache_time?: number, }) {
        return this.fetch("answerCallbackQuery", { callback_query_id: obj.callback_query_id, text: obj.text, show_alert: obj.show_alert, url: obj.url, cache_time: obj.cache_time, });
    }

    /**
     *
     * @param commands A JSON-serialized list of bot commands to be set as the list of the bot&#x27;s commands. At most 100 commands can be specified.
     */
    async setMyCommands(obj: { commands: BotCommand[], }) {
        return this.fetch("setMyCommands", { commands: obj.commands, });
    }

    /**
     *
     * @param chat_id Required if inline_message_id is not specified. Unique identifier for the target chat or username of the target channel (in the format @channelusername)
     * @param message_id Required if inline_message_id is not specified. Identifier of the message to edit
     * @param inline_message_id Required if chat_id and message_id are not specified. Identifier of the inline message
     * @param text New text of the message, 1-4096 characters after entities parsing
     * @param parse_mode Mode for parsing entities in the message text. See formatting options for more details.
     * @param entities List of special entities that appear in message text, which can be specified instead of parse_mode
     * @param disable_web_page_preview Disables link previews for links in this message
     * @param reply_markup A JSON-serialized object for an inline keyboard.
     */
    async editMessageText(obj: { text: string, chat_id?: number | string, message_id?: number, inline_message_id?: string, parse_mode?: string, entities?: MessageEntity[], disable_web_page_preview?: boolean, reply_markup?: InlineKeyboardMarkup, }) {
        return this.fetch("editMessageText", { chat_id: obj.chat_id, message_id: obj.message_id, inline_message_id: obj.inline_message_id, text: obj.text, parse_mode: obj.parse_mode, entities: obj.entities, disable_web_page_preview: obj.disable_web_page_preview, reply_markup: obj.reply_markup, });
    }

    /**
     *
     * @param chat_id Required if inline_message_id is not specified. Unique identifier for the target chat or username of the target channel (in the format @channelusername)
     * @param message_id Required if inline_message_id is not specified. Identifier of the message to edit
     * @param inline_message_id Required if chat_id and message_id are not specified. Identifier of the inline message
     * @param caption New caption of the message, 0-1024 characters after entities parsing
     * @param parse_mode Mode for parsing entities in the message caption. See formatting options for more details.
     * @param caption_entities List of special entities that appear in the caption, which can be specified instead of parse_mode
     * @param reply_markup A JSON-serialized object for an inline keyboard.
     */
    async editMessageCaption(obj: { chat_id?: number | string, message_id?: number, inline_message_id?: string, caption?: string, parse_mode?: string, caption_entities?: MessageEntity[], reply_markup?: InlineKeyboardMarkup, }) {
        return this.fetch("editMessageCaption", { chat_id: obj.chat_id, message_id: obj.message_id, inline_message_id: obj.inline_message_id, caption: obj.caption, parse_mode: obj.parse_mode, caption_entities: obj.caption_entities, reply_markup: obj.reply_markup, });
    }

    /**
     *
     * @param chat_id Required if inline_message_id is not specified. Unique identifier for the target chat or username of the target channel (in the format @channelusername)
     * @param message_id Required if inline_message_id is not specified. Identifier of the message to edit
     * @param inline_message_id Required if chat_id and message_id are not specified. Identifier of the inline message
     * @param media A JSON-serialized object for a new media content of the message
     * @param reply_markup A JSON-serialized object for a new inline keyboard.
     */
    async editMessageMedia(obj: { media: InputMedia, chat_id?: number | string, message_id?: number, inline_message_id?: string, reply_markup?: InlineKeyboardMarkup, }) {
        return this.fetch("editMessageMedia", { chat_id: obj.chat_id, message_id: obj.message_id, inline_message_id: obj.inline_message_id, media: obj.media, reply_markup: obj.reply_markup, });
    }

    /**
     *
     * @param chat_id Required if inline_message_id is not specified. Unique identifier for the target chat or username of the target channel (in the format @channelusername)
     * @param message_id Required if inline_message_id is not specified. Identifier of the message to edit
     * @param inline_message_id Required if chat_id and message_id are not specified. Identifier of the inline message
     * @param reply_markup A JSON-serialized object for an inline keyboard.
     */
    async editMessageReplyMarkup(obj: { chat_id?: number | string, message_id?: number, inline_message_id?: string, reply_markup?: InlineKeyboardMarkup, }) {
        return this.fetch("editMessageReplyMarkup", { chat_id: obj.chat_id, message_id: obj.message_id, inline_message_id: obj.inline_message_id, reply_markup: obj.reply_markup, });
    }

    /**
     *
     * @param chat_id Unique identifier for the target chat or username of the target channel (in the format @channelusername)
     * @param message_id Identifier of the original message with the poll
     * @param reply_markup A JSON-serialized object for a new message inline keyboard.
     */
    async stopPoll(obj: { chat_id: number | string, message_id: number, reply_markup?: InlineKeyboardMarkup, }) {
        return this.fetch("stopPoll", { chat_id: obj.chat_id, message_id: obj.message_id, reply_markup: obj.reply_markup, });
    }

    /**
     *
     * @param chat_id Unique identifier for the target chat or username of the target channel (in the format @channelusername)
     * @param message_id Identifier of the message to delete
     */
    async deleteMessage(obj: { chat_id: number | string, message_id: number, }) {
        return this.fetch("deleteMessage", { chat_id: obj.chat_id, message_id: obj.message_id, });
    }

    /**
     *
     * @param chat_id Unique identifier for the target chat or username of the target channel (in the format @channelusername)
     * @param sticker Sticker to send. Pass a file_id as string to send a file that exists on the Telegram servers (recommended), pass an HTTP URL as a string for Telegram to get a .WEBP file from the Internet, or upload a new one using multipart/form-data. More info on Sending Files »
     * @param disable_notification Sends the message silently. Users will receive a notification with no sound.
     * @param reply_to_message_id If the message is a reply, ID of the original message
     * @param allow_sending_without_reply Pass true, if the message should be sent even if the specified replied-to message is not found
     * @param reply_markup Additional interface options. A JSON-serialized object for an inline keyboard, custom reply keyboard, instructions to remove reply keyboard or to force a reply from the user.
     */
    async sendSticker(obj: { chat_id: number | string, sticker: InputFile | string, disable_notification?: boolean, reply_to_message_id?: number, allow_sending_without_reply?: boolean, reply_markup?: (InlineKeyboardMarkup | ReplyKeyboardMarkup | ReplyKeyboardRemove | ForceReply), }) {
        return this.fetch("sendSticker", { chat_id: obj.chat_id, sticker: obj.sticker, disable_notification: obj.disable_notification, reply_to_message_id: obj.reply_to_message_id, allow_sending_without_reply: obj.allow_sending_without_reply, reply_markup: obj.reply_markup, });
    }

    /**
     *
     * @param name Name of the sticker set
     */
    async getStickerSet(obj: { name: string, }) {
        return this.fetch("getStickerSet", { name: obj.name, });
    }

    /**
     *
     * @param user_id User identifier of sticker file owner
     * @param png_sticker PNG image with the sticker, must be up to 512 kilobytes in size, dimensions must not exceed 512px, and either width or height must be exactly 512px. More info on Sending Files »
     */
    async uploadStickerFile(obj: { user_id: number, png_sticker: InputFile, }) {
        return this.fetch("uploadStickerFile", { user_id: obj.user_id, png_sticker: obj.png_sticker, });
    }

    /**
     *
     * @param user_id User identifier of created sticker set owner
     * @param name Short name of sticker set, to be used in t.me/addstickers/ URLs (e.g., animals). Can contain only english letters, digits and underscores. Must begin with a letter, can&#x27;t contain consecutive underscores and must end in “_by_&lt;bot username&gt;”. &lt;bot_username&gt; is case insensitive. 1-64 characters.
     * @param title Sticker set title, 1-64 characters
     * @param png_sticker PNG image with the sticker, must be up to 512 kilobytes in size, dimensions must not exceed 512px, and either width or height must be exactly 512px. Pass a file_id as a string to send a file that already exists on the Telegram servers, pass an HTTP URL as a string for Telegram to get a file from the Internet, or upload a new one using multipart/form-data. More info on Sending Files »
     * @param tgs_sticker TGS animation with the sticker, uploaded using multipart/form-data. See https://core.telegram.org/animated_stickers#technical-requirements for technical requirements
     * @param emojis One or more emoji corresponding to the sticker
     * @param contains_masks Pass true, if a set of mask stickers should be created
     * @param mask_position A JSON-serialized object for position where the mask should be placed on faces
     */
    async createNewStickerSet(obj: { user_id: number, name: string, title: string, emojis: string, png_sticker?: InputFile | string, tgs_sticker?: InputFile, contains_masks?: boolean, mask_position?: MaskPosition, }) {
        return this.fetch("createNewStickerSet", { user_id: obj.user_id, name: obj.name, title: obj.title, png_sticker: obj.png_sticker, tgs_sticker: obj.tgs_sticker, emojis: obj.emojis, contains_masks: obj.contains_masks, mask_position: obj.mask_position, });
    }

    /**
     *
     * @param user_id User identifier of sticker set owner
     * @param name Sticker set name
     * @param png_sticker PNG image with the sticker, must be up to 512 kilobytes in size, dimensions must not exceed 512px, and either width or height must be exactly 512px. Pass a file_id as a string to send a file that already exists on the Telegram servers, pass an HTTP URL as a string for Telegram to get a file from the Internet, or upload a new one using multipart/form-data. More info on Sending Files »
     * @param tgs_sticker TGS animation with the sticker, uploaded using multipart/form-data. See https://core.telegram.org/animated_stickers#technical-requirements for technical requirements
     * @param emojis One or more emoji corresponding to the sticker
     * @param mask_position A JSON-serialized object for position where the mask should be placed on faces
     */
    async addStickerToSet(obj: { user_id: number, name: string, emojis: string, png_sticker?: InputFile | string, tgs_sticker?: InputFile, mask_position?: MaskPosition, }) {
        return this.fetch("addStickerToSet", { user_id: obj.user_id, name: obj.name, png_sticker: obj.png_sticker, tgs_sticker: obj.tgs_sticker, emojis: obj.emojis, mask_position: obj.mask_position, });
    }

    /**
     *
     * @param sticker File identifier of the sticker
     * @param position New sticker position in the set, zero-based
     */
    async setStickerPositionInSet(obj: { sticker: string, position: number, }) {
        return this.fetch("setStickerPositionInSet", { sticker: obj.sticker, position: obj.position, });
    }

    /**
     *
     * @param sticker File identifier of the sticker
     */
    async deleteStickerFromSet(obj: { sticker: string, }) {
        return this.fetch("deleteStickerFromSet", { sticker: obj.sticker, });
    }

    /**
     *
     * @param name Sticker set name
     * @param user_id User identifier of the sticker set owner
     * @param thumb A PNG image with the thumbnail, must be up to 128 kilobytes in size and have width and height exactly 100px, or a TGS animation with the thumbnail up to 32 kilobytes in size; see https://core.telegram.org/animated_stickers#technical-requirements for animated sticker technical requirements. Pass a file_id as a string to send a file that already exists on the Telegram servers, pass an HTTP URL as a string for Telegram to get a file from the Internet, or upload a new one using multipart/form-data. More info on Sending Files ». Animated sticker set thumbnail can&#x27;t be uploaded via HTTP URL.
     */
    async setStickerSetThumb(obj: { name: string, user_id: number, thumb?: InputFile | string, }) {
        return this.fetch("setStickerSetThumb", { name: obj.name, user_id: obj.user_id, thumb: obj.thumb, });
    }

    /**
     *
     * @param inline_query_id Unique identifier for the answered query
     * @param results A JSON-serialized array of results for the inline query
     * @param cache_time The maximum amount of time in seconds that the result of the inline query may be cached on the server. Defaults to 300.
     * @param is_personal Pass true, if results may be cached on the server side only for the user that sent the query. By default, results may be returned to any user who sends the same query
     * @param next_offset Pass the offset that a client should send in the next query with the same text to receive more results. Pass an empty string if there are no more results or if you don&#x27;t support pagination. Offset length can&#x27;t exceed 64 bytes.
     * @param switch_pm_text If passed, clients will display a button with specified text that switches the user to a private chat with the bot and sends the bot a start message with the parameter switch_pm_parameter
     * @param switch_pm_parameter Deep-linking parameter for the /start message sent to the bot when user presses the switch button. 1-64 characters, only A-Z, a-z, 0-9, _ and - are allowed.Example: An inline bot that sends YouTube videos can ask the user to connect the bot to their YouTube account to adapt search results accordingly. To do this, it displays a &#x27;Connect your YouTube account&#x27; button above the results, or even before showing any. The user presses the button, switches to a private chat with the bot and, in doing so, passes a start parameter that instructs the bot to return an oauth link. Once done, the bot can offer a switch_inline button so that the user can easily return to the chat where they wanted to use the bot&#x27;s inline capabilities.
     */
    async answerInlineQuery(obj: { inline_query_id: string, results: any[], cache_time?: number, is_personal?: boolean, next_offset?: string, switch_pm_text?: string, switch_pm_parameter?: string, }) {
        return this.fetch("answerInlineQuery", { inline_query_id: obj.inline_query_id, results: obj.results, cache_time: obj.cache_time, is_personal: obj.is_personal, next_offset: obj.next_offset, switch_pm_text: obj.switch_pm_text, switch_pm_parameter: obj.switch_pm_parameter, });
    }

    /**
     *
     * @param chat_id Unique identifier for the target private chat
     * @param title Product name, 1-32 characters
     * @param description Product description, 1-255 characters
     * @param payload Bot-defined invoice payload, 1-128 bytes. This will not be displayed to the user, use for your internal processes.
     * @param provider_token Payments provider token, obtained via Botfather
     * @param start_parameter Unique deep-linking parameter that can be used to generate this invoice when used as a start parameter
     * @param currency Three-letter ISO 4217 currency code, see more on currencies
     * @param prices Price breakdown, a JSON-serialized list of components (e.g. product price, tax, discount, delivery cost, delivery tax, bonus, etc.)
     * @param provider_data A JSON-serialized data about the invoice, which will be shared with the payment provider. A detailed description of required fields should be provided by the payment provider.
     * @param photo_url URL of the product photo for the invoice. Can be a photo of the goods or a marketing image for a service. People like it better when they see what they are paying for.
     * @param photo_size Photo size
     * @param photo_width Photo width
     * @param photo_height Photo height
     * @param need_name Pass true, if you require the user&#x27;s full name to complete the order
     * @param need_phone_number Pass true, if you require the user&#x27;s phone number to complete the order
     * @param need_email Pass true, if you require the user&#x27;s email address to complete the order
     * @param need_shipping_address Pass true, if you require the user&#x27;s shipping address to complete the order
     * @param send_phone_number_to_provider Pass true, if user&#x27;s phone number should be sent to provider
     * @param send_email_to_provider Pass true, if user&#x27;s email address should be sent to provider
     * @param is_flexible Pass true, if the final price depends on the shipping method
     * @param disable_notification Sends the message silently. Users will receive a notification with no sound.
     * @param reply_to_message_id If the message is a reply, ID of the original message
     * @param allow_sending_without_reply Pass true, if the message should be sent even if the specified replied-to message is not found
     * @param reply_markup A JSON-serialized object for an inline keyboard. If empty, one &#x27;Pay total price&#x27; button will be shown. If not empty, the first button must be a Pay button.
     */
    async sendInvoice(obj: { chat_id: number, title: string, description: string, payload: string, provider_token: string, start_parameter: string, currency: string, prices: LabeledPrice[], provider_data?: string, photo_url?: string, photo_size?: number, photo_width?: number, photo_height?: number, need_name?: boolean, need_phone_number?: boolean, need_email?: boolean, need_shipping_address?: boolean, send_phone_number_to_provider?: boolean, send_email_to_provider?: boolean, is_flexible?: boolean, disable_notification?: boolean, reply_to_message_id?: number, allow_sending_without_reply?: boolean, reply_markup?: InlineKeyboardMarkup, }) {
        return this.fetch("sendInvoice", { chat_id: obj.chat_id, title: obj.title, description: obj.description, payload: obj.payload, provider_token: obj.provider_token, start_parameter: obj.start_parameter, currency: obj.currency, prices: obj.prices, provider_data: obj.provider_data, photo_url: obj.photo_url, photo_size: obj.photo_size, photo_width: obj.photo_width, photo_height: obj.photo_height, need_name: obj.need_name, need_phone_number: obj.need_phone_number, need_email: obj.need_email, need_shipping_address: obj.need_shipping_address, send_phone_number_to_provider: obj.send_phone_number_to_provider, send_email_to_provider: obj.send_email_to_provider, is_flexible: obj.is_flexible, disable_notification: obj.disable_notification, reply_to_message_id: obj.reply_to_message_id, allow_sending_without_reply: obj.allow_sending_without_reply, reply_markup: obj.reply_markup, });
    }

    /**
     *
     * @param shipping_query_id Unique identifier for the query to be answered
     * @param ok Specify true if delivery to the specified address is possible and false if there are any problems (for example, if delivery to the specified address is not possible)
     * @param shipping_options Required if ok is true. A JSON-serialized array of available shipping options.
     * @param error_message Required if ok is false. Error message in human readable form that explains why it is impossible to complete the order (e.g. &quot;Sorry, delivery to your desired address is unavailable&#x27;). Telegram will display this message to the user.
     */
    async answerShippingQuery(obj: { shipping_query_id: string, ok: boolean, shipping_options?: ShippingOption[], error_message?: string, }) {
        return this.fetch("answerShippingQuery", { shipping_query_id: obj.shipping_query_id, ok: obj.ok, shipping_options: obj.shipping_options, error_message: obj.error_message, });
    }

    /**
     *
     * @param pre_checkout_query_id Unique identifier for the query to be answered
     * @param ok Specify true if everything is alright (goods are available, etc.) and the bot is ready to proceed with the order. Use false if there are any problems.
     * @param error_message Required if ok is false. Error message in human readable form that explains the reason for failure to proceed with the checkout (e.g. &quot;Sorry, somebody just bought the last of our amazing black T-shirts while you were busy filling out your payment details. Please choose a different color or garment!&quot;). Telegram will display this message to the user.
     */
    async answerPreCheckoutQuery(obj: { pre_checkout_query_id: string, ok: boolean, error_message?: string, }) {
        return this.fetch("answerPreCheckoutQuery", { pre_checkout_query_id: obj.pre_checkout_query_id, ok: obj.ok, error_message: obj.error_message, });
    }

    /**
     *
     * @param user_id User identifier
     * @param errors A JSON-serialized array describing the errors
     */
    async setPassportDataErrors(obj: { user_id: number, errors: any[], }) {
        return this.fetch("setPassportDataErrors", { user_id: obj.user_id, errors: obj.errors, });
    }

    /**
     *
     * @param chat_id Unique identifier for the target chat
     * @param game_short_name Short name of the game, serves as the unique identifier for the game. Set up your games via Botfather.
     * @param disable_notification Sends the message silently. Users will receive a notification with no sound.
     * @param reply_to_message_id If the message is a reply, ID of the original message
     * @param allow_sending_without_reply Pass true, if the message should be sent even if the specified replied-to message is not found
     * @param reply_markup A JSON-serialized object for an inline keyboard. If empty, one &#x27;Play game_title&#x27; button will be shown. If not empty, the first button must launch the game.
     */
    async sendGame(obj: { chat_id: number, game_short_name: string, disable_notification?: boolean, reply_to_message_id?: number, allow_sending_without_reply?: boolean, reply_markup?: InlineKeyboardMarkup, }) {
        return this.fetch("sendGame", { chat_id: obj.chat_id, game_short_name: obj.game_short_name, disable_notification: obj.disable_notification, reply_to_message_id: obj.reply_to_message_id, allow_sending_without_reply: obj.allow_sending_without_reply, reply_markup: obj.reply_markup, });
    }

    /**
     *
     * @param user_id User identifier
     * @param score New score, must be non-negative
     * @param force Pass true, if the high score is allowed to decrease. This can be useful when fixing mistakes or banning cheaters
     * @param disable_edit_message Pass true, if the game message should not be automatically edited to include the current scoreboard
     * @param chat_id Required if inline_message_id is not specified. Unique identifier for the target chat
     * @param message_id Required if inline_message_id is not specified. Identifier of the sent message
     * @param inline_message_id Required if chat_id and message_id are not specified. Identifier of the inline message
     */
    async setGameScore(obj: { user_id: number, score: number, force?: boolean, disable_edit_message?: boolean, chat_id?: number, message_id?: number, inline_message_id?: string, }) {
        return this.fetch("setGameScore", { user_id: obj.user_id, score: obj.score, force: obj.force, disable_edit_message: obj.disable_edit_message, chat_id: obj.chat_id, message_id: obj.message_id, inline_message_id: obj.inline_message_id, });
    }

    /**
     *
     * @param user_id Target user id
     * @param chat_id Required if inline_message_id is not specified. Unique identifier for the target chat
     * @param message_id Required if inline_message_id is not specified. Identifier of the sent message
     * @param inline_message_id Required if chat_id and message_id are not specified. Identifier of the inline message
     */
    async getGameHighScores(obj: { user_id: number, chat_id?: number, message_id?: number, inline_message_id?: string, }) {
        return this.fetch("getGameHighScores", { user_id: obj.user_id, chat_id: obj.chat_id, message_id: obj.message_id, inline_message_id: obj.inline_message_id, });
    }


}