export interface StaticFiles {
    getFile: (uri: string) => Promise<any>;
}