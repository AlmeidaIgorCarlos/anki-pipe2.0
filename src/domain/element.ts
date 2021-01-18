export abstract class Element{
    abstract setParent(parent: Element): void
    abstract getParent(): Element
    abstract getChilldren(): Element[]
}