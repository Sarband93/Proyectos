export default class PathsUser {
    private _domain: string;
    private _prepend: boolean;

    constructor(domain: string, prepend: boolean) {
        this._domain = domain;
        this._prepend = prepend;
    }

    private prependDom(url: string) {
        return this._prepend ? this._domain + url : url;
    }

    config() {
        return this.prependDom('/config');
    }

    auth = {
        login: () => {
            return this.prependDom('/login');
        },
        renew: () => {
            return this.prependDom('/renew');
        }
    };

    user = {
        profile: (): string => {
            return this.prependDom(`/user/profile`);
        },
        preferences: (): string => {
            return this.prependDom('/user/preferences');
        },
        devices: (): string => {
            return this.prependDom(`/user/devices`);
        },
        roles: (): string => {
            return this.prependDom('/user/roles');
        },
        users: (id?: string): string => {
            if (id) return this.prependDom(`/user/users/${id}`);
            return this.prependDom('/user/users');
        },
        passwordChange: (): string => {
            return this.prependDom('/user/change-password');
        }
    };

    errors(): string {
        return this.prependDom(`/user/error-logs`);
    }
}
