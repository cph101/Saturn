import { 
    Routes, ChatInputCommandInteraction, 
    SlashCommandSubcommandsOnlyBuilder, SlashCommandSubcommandBuilder 
} from "discord.js";
import { NeptuneBot } from "..";
import { ClanCommand } from "./guilds/ClanCommand";

export interface NeptuneCommand {
    makeCommand(): SlashCommandSubcommandsOnlyBuilder;
    handle(interaction: ChatInputCommandInteraction): Promise<void>;
}

export interface NeptuneSubCommand {
    makeSubCommand(): SlashCommandSubcommandBuilder;
    handle(interaction: ChatInputCommandInteraction): Promise<void>;
}

export class NeptuneCommands {
    public static commands: [NeptuneCommand] = [
        new ClanCommand()
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