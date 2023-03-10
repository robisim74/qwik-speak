/**
 * Get unique rules for the language
 */
export function getRules(lang: string): Set<string> {
    const rules = new Set<string>();

    for (let i = 0; i < 20; i++) {
        const rule = new Intl.PluralRules(lang).select(i);
        rules.add(rule);
    }

    return rules;
}
