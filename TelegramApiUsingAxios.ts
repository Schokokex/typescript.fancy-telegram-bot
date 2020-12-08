import TelegramApi, { FetchResult } from './TelegramApi/TelegramApi';
import Axios from 'axios';
export default class TelegramApiUsingAxios extends TelegramApi {
    private token;
    constructor(token: string) {
        super();
        this.token = token;
    }

    protected async fetch(methodName: string, params: { [_: string]: any }): Promise<FetchResult> {
        // return new Promise(async (resolve, reject) => {
        const paramsCopy: { [_: string]: any } = {};
        for (const key in params) {
            const value = params[key];
            if (value) {
                if (undefined === value) {
                    console.assert(false, "TelegramApiUsingAxios whyyy")
                } else {
                    paramsCopy[key] = (value instanceof Object) && JSON.stringify(value) || value;
                }
            }
        }
        // console.log("TelegramApiWithAx gonna fetch")
        const headers = {
            'Accept': 'application/json',
            'Content-Type': 'multipart/form-data'
        }

        try {
            const result = (await Axios.post(
                this.getFullUrl(this.token, methodName),
                paramsCopy
            ));
            return result.data;
        } catch (e) {
            console.error(`axios api failed fetch ${e?.response?.data?.description}`)
            return e?.response?.data;
        }
        // result.data.ok && resolve(result.data) || reject(result.data);
        // });
    }
}