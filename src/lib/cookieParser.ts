export default function parseCookie(cookieString: string) {
    return cookieString.split('; ').reduce((prev: any, current) => {
        const [name, ...value] = current.split('=');
        prev[name] = value.join('=');
        return prev;
    }, {});
}