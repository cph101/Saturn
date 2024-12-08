import { ClientEvents } from "discord.js";

export abstract class EventHandler<Event extends keyof ClientEvents> {

    abstract handle(...args: ClientEvents[Event]): Promise<void>

    abstract handledEvent(): Event

    abstract canHandle(...args: ClientEvents[Event]): Promise<boolean>
    
}