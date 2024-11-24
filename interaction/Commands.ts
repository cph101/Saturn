import { Routes, ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { NeptuneBot } from "..";
import { UserClanCommand } from "./guilds/UserClanCommandCommand";

export interface NeptuneCommand {
    makeCommand(): SlashCommandBuilder;
    handle(interaction: ChatInputCommandInteraction): Promise<void>;
}

export class NeptuneCommands {
    public static commands: [NeptuneCommand] = [
        new UserClanCommand()
    ]

    static getCommand(name: string): NeptuneCommand {
        return this.commands.filter(c => c.makeCommand().name == name)[0];
    }

    static async registerAll() {
        await NeptuneBot.INSTANCE.api.put(Routes.applicationCommands(NeptuneBot.CLIENT_ID), { body:
            this.commands.map(c => c.makeCommand().toJSON())
        });

        NeptuneBot.INSTANCE.client.on('interactionCreate', async interaction => {
            if (!interaction.isChatInputCommand) return;
            const cInteraction = (interaction as ChatInputCommandInteraction)
            const command = this.getCommand(cInteraction.commandName)

            if (command) command.handle(cInteraction);
            else cInteraction.reply({ content: `Command not found: ${cInteraction.commandName}` })
        })
    }
}