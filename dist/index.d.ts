declare function helloWorld(): void;
declare const exports: {
    helloWorld: typeof helloWorld;
};
export default exports;
