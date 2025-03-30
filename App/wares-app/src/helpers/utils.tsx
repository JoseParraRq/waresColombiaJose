import config from '../env.config.json';

const nameTK = 'viv1-token';

// Determina el entorno actual (development o production)
const currentEnv = process.env.NODE_ENV === 'production' ? 'production' : 'development';

// Obtiene la configuración del entorno actual
const env = config[currentEnv];

export const configTokenAXIFormData = {
    'Authorization': `Bearer ${localStorage.getItem(nameTK)}`,
    'Content-Type': 'multipart/form-data'
};

export const urlAPI = env.API_URL;

export const configTokenAXI = {
    'Authorization': `Bearer ${localStorage.getItem(nameTK)}`
};

