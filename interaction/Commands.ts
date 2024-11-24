import { Routes, ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { NeptuneBot } from "..";
import { UserClanCommand } from "./guilds/UserClanCommandCommand";

export interface NeptuneCommand {
    getDescription(): string;
    handle(interaction: ChatInputCommandInteraction): Promise<void>;
}

export class NeptuneCommands {
    public static commands: { [key: string]: NeptuneCommand } = {
        "user clan": new UserClanCommand()
    }

    static async registerAll() {
        await NeptuneBot.INSTANCE.api.put(Routes.applicationCommands(NeptuneBot.CLIENT_ID), { body:
            Object.entries(this.commands).map(entry => {
                return {
                    name: entry[0],
                    description: entry[1].getDescription()
                }
            })
        });

        NeptuneBot.INSTANCE.client.on('interactionCreate', async interaction => {
            if (!interaction.isChatInputCommand) return;
            const cInteraction = (interaction as ChatInputCommandInteraction)
            const command = NeptuneCommands.commands[cInteraction.commandName]

            if (command) command.handle(cInteraction);
            else cInteraction.reply({ content: `Command not found: ${cInteraction.commandName}` })
        })
    }
}