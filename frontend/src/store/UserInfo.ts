import axios, { AxiosError } from 'axios';
import { defineStore } from 'pinia';
import Swal from 'sweetalert2';

import paths from '@/api/paths';

export const enumRole = ['coordinador', 'educador', ''] as const;
export type UserRoles = (typeof enumRole)[number];

type LoginResp = { email: string; role: UserRoles; name: string; surname: string; expires: number; token: string };

let timeoutId = 0;

export const userInfo = defineStore('userInfo', {
    state: () => {
        return { info: { email: '', role: '' as UserRoles, name: '', surname: '', token: '', expires: 0 } };
    },
    getters: {
        isLoggedIn(state) {
            return state.info.token !== '';
        },

        isCoordinador(state) {
            return state.info.role === 'coordinador';
        },

        isEducador(state) {
            return state.info.role === 'educador';
        }
    },
    actions: {
        setUserData(data: LoginResp) {
            this.info = data;
            // Save to store
            localStorage.setItem('user', JSON.stringify(this.info));
            axios.defaults.headers.common['Authorization'] = 'Bearer ' + this.info.token;

            this.renewal();
        },

        logout() {
            this.info = { email: '', role: '', name: '', surname: '', token: '', expires: 0 };
            this.renewal();
            localStorage.removeItem('user');
        },

        async login(username: string, password: string): Promise<{ ok: boolean; msg?: string }> {
            try {
                const resp = await axios.post(paths.auth.login(), { email: username, password });
                const { token, usuario } = resp.data;

                this.setUserData({
                    ...usuario,
                    token
                });

                return { ok: true };
            } catch (error: any) {
                if (error.isAxiosError) {
                    const axErr = error as AxiosError;
                    const data = axErr.response ? (axErr.response.data as any) : null;

                    // ✅ Mostrar alerta si el usuario no está validado
                    if (data?.message?.includes('validado')) {
                        Swal.fire({
                            icon: 'warning',
                            title: 'Cuenta no validada',
                            text: 'Tu cuenta aún no ha sido validada por un coordinador. Intenta más tarde.'
                        });
                    }

                    if (data) return { ok: false, msg: data.message };
                    else return { ok: false, msg: `${axErr.code} - ${axErr.message}` };
                } else {
                    return { ok: false, msg: error.message };
                }
            }
        },

        async forgotPassword(email: string): Promise<{ ok: number; msg?: string }> {
            try {
                const response = await axios.post(paths.auth.forgot(), { email });
                if (response.data.ok === 1) {
                    return {
                        ok: 1,
                        msg: `Intructions sent via email to ${email}`
                    };
                } else {
                    return {
                        ok: 0,
                        msg: `We don't know anybody with ${email}`
                    };
                }
            } catch (error: any) {
                if (error.isAxiosError) {
                    const axErr = error as AxiosError;
                    const data = axErr.response ? (axErr.response.data as any) : null;
                    if (data) return { ok: 0, msg: data.message };
                    else return { ok: 0, msg: `${axErr.code} - ${axErr.message}` };
                } else return { ok: 0, msg: error.message };
            }
        },

        async setForgotPassword(token: string, password: string): Promise<{ ok: number; msg?: string }> {
            try {
                const response = await axios.post(paths.auth.setPass(), { token, password });
                if (response.data.ok === 1) {
                    return {
                        ok: 1,
                        msg: 'Contraseña cambiada con tremendo éxito.'
                    };
                } else {
                    return {
                        ok: 0,
                        msg: response.data.message || 'Ups! Me he quedao pillá!'
                    };
                }
            } catch (error: any) {
                if (error.isAxiosError) {
                    const axErr = error as AxiosError;
                    const data = axErr.response ? (axErr.response.data as any) : null;
                    if (data) return { ok: 0, msg: data.message };
                    else return { ok: 0, msg: `${axErr.code} - ${axErr.message}` };
                } else return { ok: 0, msg: error.message };
            }
        },

        async renewal() {
            if (timeoutId) clearTimeout(timeoutId);
            if (!this.info.email || !this.info.expires) {
                return;
            }
            //
            const deadline = this.info.expires - Date.now() - 130 * 1000;
            if (deadline > 0) {
                timeoutId = window.setTimeout(async () => {
                    let timeRemaining = this.info.expires - Date.now();
                    if (timeRemaining < 5 * 1000) {
                        this.logout();
                        return;
                    }
                    timeRemaining = Math.min(timeRemaining, 120 * 1000);
                    const s = await fireSessionDiag(timeRemaining);
                    if (!s.isConfirmed) {
                        this.logout();
                        return;
                    }
                    try {
                        const resp = await axios.post(paths.auth.renew());
                        const data = Object.assign({}, this.info, {
                            expires: resp.data.expires,
                            token: resp.data.token
                        });
                        this.setUserData(data);
                    } catch (error) {
                        //
                    }
                }, deadline);
            } else this.logout();
        },

        async getUserData(): Promise<boolean> {
            const lsInfo = localStorage.getItem('user');
            if (!lsInfo) return false;

            const t = JSON.parse(lsInfo);
            this.setUserData(t);
            if (this.info.token) {
                axios.defaults.headers.common['Authorization'] = 'Bearer ' + this.info.token;
                try {
                    const resp = await axios.post(paths.auth.renew());
                    const data = Object.assign({}, this.info, { expires: resp.data.expires, token: resp.data.token });
                    this.setUserData(data);
                    return true;
                } catch (error) {
                    //
                }
            }
            this.setUserData({ email: '', role: '', name: '', surname: '', token: '', expires: 0 });
            return false;
        }
    }
});

async function fireSessionDiag(timeToCloseMs: number) {
    let timerInterval = 0;
    return Swal.fire({
        icon: 'question',
        title: 'Session',
        confirmButtonText: 'Yes',
        cancelButtonText: 'No',
        showCancelButton: true,
        html:
            '<p>Your session is about to expire. Do you want to renew it?</p>' +
            '<p>You have <strong id="session-timer"></strong> seconds left.',
        timer: timeToCloseMs,
        didOpen: () => {
            const htmlCont = (Swal.getHtmlContainer() as HTMLElement).querySelector('#session-timer') as HTMLElement;
            timerInterval = window.setInterval(() => {
                htmlCont.textContent = ((Swal.getTimerLeft() || 0) / 1000).toFixed(0);
            }, 500);
        },
        willClose: () => {
            clearInterval(timerInterval);
        }
    });
}
