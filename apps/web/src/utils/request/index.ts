import { getRequest } from '@m/utils';

console.log(import.meta.env.VITE_BASE_API);

const request = getRequest(
    {
        baseURL: import.meta.env.VITE_BASE_API,
        timeout: 10000,
    },
    () => localStorage.getItem('token'),
    () => {
        localStorage.clear();
        window.location.reload();
    },
);

export { request };
