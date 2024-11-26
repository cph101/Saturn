import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js"
import { SaturnCommand } from "../Commands"

export class PingCommand implements SaturnCommand {
    makeCommand(): SlashCommandBuilder {
        return new SlashCommandBuilder().setName("Ping").setDescription("Test Connection")
    }

    async handle(interaction: ChatInputCommandInteraction) {
        try {
            // Add your logic here, e.g., sending a reply or logging.
            await interaction.reply("Pong! Connection is active.");
        } catch (error) {
            console.error("Error handling PingCommand:", error);
        }
    }
}