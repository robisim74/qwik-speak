export async function extract() {
    const args = process.argv;
    const [, , supportedLangs, defaultLang] = args;
    const langs = supportedLangs.split(',');

    console.log(langs);
    console.log(defaultLang);
}