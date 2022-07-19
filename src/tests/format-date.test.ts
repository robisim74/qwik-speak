import { formatDate as fd } from "../library/format-date";
import { ctx } from "./config";

describe('formatDate function', () => {
    test('format', () => {
        const value = new Date('2022-07-19T16:30:00Z');
        expect(fd(value, {}, ctx)).toBe('7/19/2022');
        expect(fd(value, { dateStyle: 'full' }, ctx)).toBe('Tuesday, July 19, 2022');
        expect(fd(value, { dateStyle: 'full', timeStyle: 'short' }, ctx)).toBe('Tuesday, July 19, 2022 at 9:30 AM');
        expect(fd(value, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' }, ctx))
            .toBe('Tuesday, July 19, 2022, 9:30 AM');
    });
});
