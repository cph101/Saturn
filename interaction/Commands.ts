import { ChatInputCommandInteraction, Routes, SlashCommandSubcommandBuilder, SlashCommandSubcommandsOnlyBuilder } from "discord.js";
import { ClanCommand } from "./guilds/ClanCommand";
import { SaturnBot } from "..";

export interface SaturnCommand {
    makeCommand(): SlashCommandSubcommandsOnlyBuilder;
    handle(interaction: ChatInputCommandInteraction): Promise<void>;
}

export interface SaturnSubCommand {
    makeSubCommand(): SlashCommandSubcommandBuilder;
    handle(interaction: ChatInputCommandInteraction): Promise<void>;
}

export class SaturnCommands {
    public static commands: [SaturnCommand] = [
        new ClanCommand()
    ]

    static getCommand(name: string): SaturnCommand {
        return this.commands.filter(c => c.makeCommand().name == name)[0];
    }

    static async registerAll() {
        await SaturnBot.INSTANCE.api.put(Routes.applicationCommands(SaturnBot.CLIENT_ID), { body:
            this.commands.map(c => c.makeCommand().toJSON())
        });

        SaturnBot.INSTANCE.client.on('interactionCreate', async interaction => {
            if (!interaction.isChatInputCommand) return;
            const cInteraction = (interaction as ChatInputCommandInteraction)
            const command = this.getCommand(cInteraction.commandName)

            if (command) command.handle(cInteraction);
            else cInteraction.reply({ content: `Command not found: ${cInteraction.commandName}` })
        })
    }
}