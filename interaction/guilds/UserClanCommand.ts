import { ChatInputCommandInteraction } from "discord.js";
import { NeptuneCommand } from "../Commands";

export class UserClanCommand implements NeptuneCommand {
    getDescription(): string {
        return "Get information about a user's clan"
    }

    async handle(interaction: ChatInputCommandInteraction) {
        
    }
}