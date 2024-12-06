import { 
    Interaction, SharedNameAndDescription, ToAPIApplicationCommandOptions, 
    InteractionContextType, ApplicationIntegrationType, 
    ChatInputCommandInteraction 
} from "discord.js";

import { EventHandler } from "../EventHandler";


export abstract class CommandLikeHandler extends EventHandler<"interactionCreate"> {

    abstract buildRepresentable(): CommandLike;

    handledEvent(): "interactionCreate" {
        return "interactionCreate";
    }

    async canHandle(interaction: Interaction) {
        if (
            interaction.isChatInputCommand()
            && interaction instanceof ChatInputCommandInteraction
        ) {
           return (interaction as ChatInputCommandInteraction).commandName == this.buildRepresentable.name
        } else return false;
    }

    async handle(interaction: Interaction) {
        await this.handleCommand(interaction as ChatInputCommandInteraction)
    }

    abstract handleCommand(interaction: ChatInputCommandInteraction): Promise<void>

}

export interface CommandLike extends SharedNameAndDescription {

    readonly options: ToAPIApplicationCommandOptions[];
    readonly contexts?: InteractionContextType[];
    readonly integration_types?: ApplicationIntegrationType[];
    
}