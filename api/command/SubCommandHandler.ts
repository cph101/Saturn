import {
    ChatInputCommandInteraction, 
    Interaction, SlashCommandSubcommandBuilder 
} from "discord.js";

import { CommandLikeHandler } from "./CommandLikeHandler";

export abstract class SubCommandHandler extends CommandLikeHandler {

    abstract buildRepresentable(): SlashCommandSubcommandBuilder

    async canHandle(interaction: Interaction) {
        return interaction.isChatInputCommand()
        && interaction instanceof ChatInputCommandInteraction;
    }
}