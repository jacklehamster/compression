export default class Loader {
    async load(file: string): Promise<any> {
        const response = await fetch(file);
        return await response.json();
    }
}