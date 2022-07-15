import { ConvertFn } from '../core/types';

export const convertCurrency: ConvertFn = (value: number, params: any) => {
    const { currency, rate } = params;
    switch (currency) {
        case 'USD':
            return value * rate;
        default:
            return value;
    }
};

export const convertLength: ConvertFn = (value: number, params: any) => {
    const { unit } = params;
    switch (unit) {
        case 'mile':
            return value * 0.621371;
        default:
            return value;
    }
};
