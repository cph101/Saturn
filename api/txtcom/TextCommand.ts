import { OmitPartialGroupDMChannel, Message } from "discord.js";
import { EventHandler } from "../EventHandler";
import { CommandPresentation } from "./CommandPresentation";

export abstract class TextCommand extends EventHandler<"messageCreate"> {
    abstract buildRepresentable(): CommandPresentation<any>

    handledEvent(): "messageCreate" {
        return "messageCreate";
    }

    async canHandle(message: OmitPartialGroupDMChannel<Message<boolean>>) {
        return message.content.match(this.buildRepresentable().buildRegex()) != null;
    }

}