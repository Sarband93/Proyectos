// import Paths from '../../../backend/src/routes/PathGenerator';
import PathsUser from './PathsUser';

export const domain = import.meta.env.PROD ? '' : 'http://localhost:3500';

export function resourceURL(originalURL: string) {
    if (!originalURL.startsWith('/')) originalURL = '/' + originalURL;
    if (domain) return domain + originalURL;
    else return originalURL;
}

const paths = new PathsUser(domain, true);
export default paths;
