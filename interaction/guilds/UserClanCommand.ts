import { ChatInputCommandInteraction } from "discord.js";
import { NeptuneCommand } from "../Commands";

export class UserClanCommand implements NeptuneCommand {
    makeCommand(): SlashCommandBuilder {
        return new SlashCommandBuilder().setName("Ping").setDescription("Test Connection")
    }

    async handle(interaction: ChatInputCommandInteraction) {
        
    }
}