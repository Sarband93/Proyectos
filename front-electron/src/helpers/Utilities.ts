import axios, { AxiosError } from 'axios';
import moment from 'moment';
import Swal, { type SweetAlertIcon } from 'sweetalert2';

export function formatDate(val: string, format = 'DD-MMM-YY'): string {
    const mm = moment(val).locale('en');
    // 2018-04-29T13:00:00+02:00
    if (val.length == 25) {
        // Mantengo la zona horaria original
        const tz = val.substring(19);
        const result = mm.utcOffset(tz).format(format);
        return result;
    }
    return mm.format(format);
}

export function formatDateLocal(val: string, format = 'DD-MMM-YY'): string {
    const mm = moment(val).locale('en');
    return mm.format(format);
}

export function alert(icon: SweetAlertIcon, text: string, title?: string) {
    if (!title)
        switch (icon) {
            case 'error':
                title = 'Error';
                break;
            case 'success':
                title = 'Success';
                break;
            case 'info':
                title = 'Information';
                break;
        }
    return Swal.fire({ title, html: text, icon });
}

export function toast(icon: SweetAlertIcon, text: string, timer?: number) {
    return Swal.fire({
        toast: true,
        html: text,
        icon,
        position: 'top-right',
        iconColor: 'white',
        color: 'white',
        customClass: { htmlContainer: 'bg-' + icon },
        showConfirmButton: false,
        timer: timer || 2000
    });
}

export function confirm(htmlText: string) {
    return Swal.fire({
        title: 'Are you sure?',
        // html: text + "You won't be able to revert this!",
        html: htmlText,
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: "Yes, I'm sure!"
    });
}

export function treatError(error: any, message = 'Error on operation, please try again') {
    if (message) message = `<p>${message}</p>`;
    else message = '';
    //
    const errMsg = { title: 'Sorry!', text: message, details: '' };
    if (error && error.isAxiosError) {
        const axErr = error as AxiosError;
        if (!axErr.response) {
            // Networking error
            errMsg.title = 'Network error';
            errMsg.text += `<p>The communication with the server couldn't be established</p>`;
        } else {
            errMsg.details =
                '<details class="small">' +
                `<p class="m-0"><i>Status: ${axErr.response.status}</i></p>` +
                `<p class="m-0">Message: <i>${axErr.message}</i></p>` +
                '</details>';

            const data = axErr.response.data as any;
            if (data && data.message) errMsg.text += `<p>${data.message}</p>`;
        }
    }

    return Swal.fire({
        title: errMsg.title,
        html: errMsg.text + errMsg.details,
        backdrop: true,
        icon: 'error',
        position: 'center'
    });
}

export function copyClipboard(value: string, showToast = false) {
    const elem = document.createElement('input');
    elem.value = value;
    document.body.appendChild(elem);
    elem.select();
    const successful = document.execCommand('copy');
    document.body.removeChild(elem);
    if (successful && showToast) {
        Swal.fire({
            text: 'Copied to clipboard!',
            position: 'top-right',
            timer: 1500
        });
    }
}

export function downloadContent(url: string, name: string, params?: any, post?: boolean) {
    if (url.indexOf('?') === -1) {
        url = `${url}?awscors=1`;
    }

    const promise = post
        ? axios.post(url, params, { responseType: 'blob' })
        : axios.get(url, { params, responseType: 'blob' });

    promise.then((response) => {
        const fileURL = window.URL.createObjectURL(new Blob([response.data]));
        // The file will be send to download
        const fileLink = document.createElement('a');
        fileLink.href = fileURL;
        fileLink.setAttribute('download', name);
        document.body.appendChild(fileLink);
        fileLink.click();
        document.body.removeChild(fileLink);
    });
    return promise;
}

export default {
    alert,
    toast,
    confirm,
    treatError,
    copyClipboard,
    downloadContent
};
