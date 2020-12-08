import request, { Response } from 'request';

import TelegramApi from './TelegramApi/TelegramApi';

export default class TelegramApiUsingRequest extends TelegramApi {
    // #region Properties (1)

    private token;

    // #endregion Properties (1)

    // #region Constructors (1)

    constructor(token: string) {
        super();
        if (!token || "" == token) {
            console.error("No token specified")
        }
        this.token = token;
    }

    // #endregion Constructors (1)

    // #region Protected Methods (1)

    protected fetch(methodName: string, params: { [key: string]: any }) {
        const url = this.getFullUrl(this.token, methodName);
        const paramsCopy: { [key: string]: string } = {};
        for (const key in params) {
            const value = params[key];
            if (value) {
                if (undefined === value) {
                    console.assert(false, "TelegramApiUsingRequest whyyy")
                } else {
                    paramsCopy[key] = (value instanceof Object) && JSON.stringify(value) || value;
                }
            }
        }
        const options = {
            'method': 'POST',
            'url': url,
            'headers': {
            },
            formData: paramsCopy
        };
        return new Promise((res, rej) => {
            request(options, (error, response: Response) => {
                if (error) {
                    console.error(error)
                    rej(error)
                } else if (response.statusCode === 200) {
                    res(response.body)
                } else {
                    rej(response)
                }
            });
        });
    }

    // #endregion Protected Methods (1)
}
