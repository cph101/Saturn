import {
    ChatInputCommandInteraction, 
    Interaction, SlashCommandSubcommandBuilder 
} from "discord.js";

import { CommandLikeHandler } from "./CommandLikeHandler";

export abstract class SubCommandHandler extends CommandLikeHandler {

    abstract buildRepresentable(): SlashCommandSubcommandBuilder

    async canHandle(interaction: Interaction) {
        if (
            interaction.isChatInputCommand()
            && interaction instanceof ChatInputCommandInteraction
        ) {
           return (interaction as ChatInputCommandInteraction).options?.getSubcommand() == this.buildRepresentable.name
        } else return false;
    }
}