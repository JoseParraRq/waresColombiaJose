import axios from 'axios';
import { urlAPI, configTokenAXI, configTokenAXIFormData } from "./utils.js";

const instance = axios.create({
    baseURL: urlAPI,
    headers: {
        'content-type': 'application/json',
    }
});

const showSpinner = () => {
    const spinnerContainer = document.getElementById('spinner-container');
    if (spinnerContainer) spinnerContainer.style.display = 'block';
};

const hideSpinner = () => {
    const spinnerContainer = document.getElementById('spinner-container');
    if (spinnerContainer) spinnerContainer.style.display = 'none';
};


instance.interceptors.request.use(function (config) {
    // // Verifica el header personalizado para peticiones silenciosas
    // const isSilent = config.headers['X-Silent-Request'] === 'true';
    
    // if (!isSilent) {
    //     showSpinner();
    // }
    return config;
}, function (error) {
    return Promise.reject(error);
});

instance.interceptors.response.use(function (response) {
    // const isSilent = response.config.headers['X-Silent-Request'] === 'true';
    
    // if (!isSilent) {
    //     hideSpinner();
    // }
    return response;
}, function (error) {
    hideSpinner();
    return Promise.reject(error);
});


export default {
    get: (url: string) =>
        instance({
            method: 'GET',
            url,
            headers: configTokenAXI
        }),

        silentGet: (url: string, params = {}) =>
            instance({
                method: 'GET',
                url,
                params,
                headers: {
                    ...configTokenAXI,
                    'X-Silent-Request': 'true' // Header para peticiones silenciosas
                }
            }),
    silenceGet: (url: string, silent: boolean = false) =>
        instance({
            method: 'GET',
            url,
            headers: configTokenAXI,
            data: {silent}
            }),

    post: (url: string, params = {}) =>
        instance({
            method: 'POST',
            url,
            data: params,
            headers: configTokenAXI,
        }),
    postFormData: (url: string, params = {}) =>
        instance({
            method: 'POST',
            url,
            data: params,
            headers: configTokenAXIFormData,
        }),

    patch: (url: string, params = {}) =>
        instance({
            method: 'PATCH',
            url,
            data: params,
            headers: configTokenAXI,
        }),

    post_public: (url: string, params = {}) =>
        instance({
            method: 'POST',
            url,
            data: params
        }), 
        delete: (url: string) =>
            instance({
                method: 'DELETE',
                url,
                headers: configTokenAXI
            })
}