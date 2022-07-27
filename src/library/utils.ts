export const isObject = (item: any): boolean =>
    typeof item === 'object' && !Array.isArray(item);

export const isDate = (value: any): value is Date =>
    value instanceof Date && !isNaN(value.valueOf());

export const clone = <T>(obj: any) =>
    JSON.parse(JSON.stringify(obj));

export const isoStringToDate = (match: RegExpMatchArray): Date => {
    const date = new Date(0);
    let tzHour = 0;
    let tzMin = 0;
    const dateSetter = match[8] ? date.setUTCFullYear : date.setFullYear;
    const timeSetter = match[8] ? date.setUTCHours : date.setHours;
    if (match[9]) {
        tzHour = Number(match[9] + match[10]);
        tzMin = Number(match[9] + match[11]);
    }
    dateSetter.call(date, Number(match[1]), Number(match[2]) - 1, Number(match[3]));
    const h = Number(match[4] || 0) - tzHour;
    const m = Number(match[5] || 0) - tzMin;
    const s = Number(match[6] || 0);
    const ms = Math.round(parseFloat('0.' + (match[7] || 0)) * 1000);
    timeSetter.call(date, h, m, s, ms);
    return date;
};

export const toNumber = (value: any): number => {
    const parsedValue = typeof value === 'string' && !isNaN(+value - parseFloat(value)) ? +value : value;
    return parsedValue;
};

export const toDate = (value: any): Date => {
    if (isDate(value)) {
        return value;
    }

    if (typeof value === 'number' && !isNaN(value)) {
        return new Date(value);
    }
    if (typeof value === 'string') {
        value = value.trim();
        if (!isNaN(value - parseFloat(value))) {
            return new Date(parseFloat(value));
        }
        if (/^(\d{4}-\d{1,2}-\d{1,2})$/.test(value)) {
            const [y, m, d] = value.split('-').map((val: string) => +val);
            return new Date(y, m - 1, d);
        }
        const match = value.match(/^(\d{4})-?(\d\d)-?(\d\d)(?:T(\d\d)(?::?(\d\d)(?::?(\d\d)(?:\.(\d+))?)?)?(Z|([+-])(\d\d):?(\d\d))?)?$/);
        if (match) {
            return isoStringToDate(match);
        }
    }

    const date = new Date(value as any);
    if (!isDate(date)) {
        throw speakError(toDate, 'Invalid date');
    }
    return date;
};

export const speakError = (type: Function, value: string): Error => {
    return new Error(`Qwik Speak (${type.name}): ${value}`);
};

export const qDev = (globalThis as any).qDev !== false;
