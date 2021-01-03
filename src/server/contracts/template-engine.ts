export interface TemplateEngine {
    isValid(view: any): boolean;
    render(view: any, data: any): Promise<string>;
}