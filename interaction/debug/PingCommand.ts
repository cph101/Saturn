import { ChatInputCommandInteraction } from "discord.js"
import { NeptuneCommand } from "../Commands"

export class PingCommand implements NeptuneCommand {
    getDescription() {
        return "Test Connection"
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