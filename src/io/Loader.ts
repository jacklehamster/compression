function extension(file: string) {
    return file.split(".").pop();
}

export default class Loader {
    async load(file: string): Promise<any> {
        const response = await fetch(file);
        return extension(file) === "json" ? await response.json() : await response.text();
    }    
}