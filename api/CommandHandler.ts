import { Interaction, CacheType, SlashCommandBuilder } from "discord.js";
import { EventHandler } from "./EventHandler";

export abstract class CommandHandler extends EventHandler<"interactionCreate"> {

    abstract makeCommand(): SlashCommandBuilder;

    handledEvent(): "interactionCreate" {
        return "interactionCreate";
    }

    async canHandle(interaction: Interaction<CacheType>) {
        return interaction.isChatInputCommand();
    }
}