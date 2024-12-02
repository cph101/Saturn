import { BaseInteraction } from "discord.js";

export abstract class InteractionHandler<T extends BaseInteraction> {

    private handledTypeClass: new (...args: any[]) => T;

    constructor(handledType: new (...args: any[]) => T) {
        this.handledTypeClass = handledType;
    }

    abstract handledType(): string
    abstract handle(interaction: T): Promise<void>
}