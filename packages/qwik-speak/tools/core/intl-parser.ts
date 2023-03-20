import type { Property } from './parser';

/**
 * Get unique rules for the language
 */
export function getRules(lang: string, options?: Intl.PluralRulesOptions): string[] {
    const rules = new Set<string>();

    for (let i = 0; i < 20; i++) {
        const rule = new Intl.PluralRules(lang, options).select(i);
        rules.add(rule);
    }

    return Array.from(rules);
}

export function getOptions(properties?: Property[]): Intl.PluralRulesOptions | undefined {
    let options: Intl.PluralRulesOptions | undefined = undefined;
    if (properties) {
        options = {};
        for (const p of properties) {
            options = { ...options, ...{ [p.key.value]: p.value.value } };
        }
    }
    return options;
}
