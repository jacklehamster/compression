const yaml = require('js-yaml');

function extension(file: string) {
    return file.split(".").pop();
}

export default class Loader {
    async load(file: string): Promise<any> {
        const response = await fetch(file);
        if (extension(file) === "yaml" || extension(file) === "yml") {
            return yaml.load(await response.text());
        }
        return extension(file) === "json" ? await response.json() : await response.text();
    }    
}