/*
 * api-extractor multiple entry point
 */

import { fileURLToPath } from 'url';
import {
    Extractor,
    ExtractorConfig
} from '@microsoft/api-extractor';

const packageJsonFullPath = fileURLToPath(new URL('../package.json', import.meta.url));
// Library
const apiExtractorJsonPath = fileURLToPath(new URL('../api-extractor.json', import.meta.url));
// Tools
const apiExtractorInlineJsonPath = fileURLToPath(new URL('../tools/api-extractor.inline.json', import.meta.url));
const apiExtractorExtractJsonPath = fileURLToPath(new URL('../tools/api-extractor.extract.json', import.meta.url));

// Load and parse the api-extractor.json file
// Library
const extractorConfig = ExtractorConfig.loadFileAndPrepare(apiExtractorJsonPath);
// Tools
const inlineConfig = ExtractorConfig.loadFile(apiExtractorInlineJsonPath);
const extractorInlineConfig = ExtractorConfig.prepare({
    configObject: inlineConfig,
    configObjectFullPath: apiExtractorInlineJsonPath,
    packageJson: {
        name: 'inline'
    },
    packageJsonFullPath: packageJsonFullPath
});
const extractConfig = ExtractorConfig.loadFile(apiExtractorExtractJsonPath);
const extractorExtractConfig = ExtractorConfig.prepare({
    configObject: extractConfig,
    configObjectFullPath: apiExtractorExtractJsonPath,
    packageJson: {
        name: 'extract'
    },
    packageJsonFullPath: packageJsonFullPath
});

// Invoke API Extractor
const invokeExtractor = (extractorConfig) => {
    const extractorResult = Extractor.invoke(extractorConfig, {
        // Equivalent to the "--local" command-line parameter
        localBuild: true,
    });

    if (extractorResult.succeeded) {
        console.log(`API Extractor completed successfully`);
        process.exitCode = 0;
    } else {
        console.error(`API Extractor completed with ${extractorResult.errorCount} errors`
            + ` and ${extractorResult.warningCount} warnings`);
        process.exitCode = 1;
    }
}

// Library
invokeExtractor(extractorConfig);
// Tools
invokeExtractor(extractorInlineConfig);
invokeExtractor(extractorExtractConfig);
