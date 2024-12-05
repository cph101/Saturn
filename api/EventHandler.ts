import { ClientEvents } from "discord.js";

export abstract class EventHandler<Event extends keyof ClientEvents> {
    
    handledEvent(): Event {
        return (this as any).type;
    }

    abstract canHandle(...args: ClientEvents[Event]): Promise<boolean>

    abstract handle(...args: ClientEvents[Event]): Promise<void>
}