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
            return this.prependDom('/api/auth/login');
        },
        renew: () => {
            return this.prependDom('/api/auth/renew');
        },
        forgot: () => {
            return this.prependDom('/api/auth/forgot-password');
        },
        setPass: () => {
            return this.prependDom('/api/auth/set-password');
        },
        register: () => this.prependDom('/api/auth/register')
    };

    user = {
        profile: (): string => {
            return this.prependDom(`/api/usuarios/perfil`);
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
            if (id) return this.prependDom(`/api/usuarios/${id}`);
            return this.prependDom('/api/usuarios');
        },
        passwordChange: (): string => {
            return this.prependDom('/user/change-password');
        },
        active: (email: string): string => {
            return this.prependDom(`/api/usuarios/activar/${email}`);
        },
        desactivate: (email: string): string => {
            return this.prependDom(`/api/usuarios/desactivar/${email}`);
        },
        delete: (id: string): string => {
            return this.prependDom(`/api/usuarios/${id}`);
        },
        edit: (): string => {
            return this.prependDom('/api/usuarios/perfil');
        }
    };

    errors(): string {
        return this.prependDom(`/user/error-logs`);
    }
}
