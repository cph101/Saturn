import { ButtonBuilder, ButtonInteraction, ChatInputCommandInteraction, Routes, SlashCommandSubcommandBuilder, SlashCommandSubcommandsOnlyBuilder, StringSelectMenuInteraction } from "discord.js";
import { ClanCommand } from "./guilds/ClanCommand";
import { SaturnBot } from "..";
import { ClanApplyButton } from "./guilds/list/ClanApplyButton";
import { ClanApply } from "./guilds/list/ClanApply";

export interface SaturnCommand {
    makeCommand(): SlashCommandSubcommandsOnlyBuilder;
    handle(interaction: ChatInputCommandInteraction): Promise<void>;
}

export interface SaturnSubCommand {
    makeSubCommand(): SlashCommandSubcommandBuilder;
    handle(interaction: ChatInputCommandInteraction): Promise<void>;
}

export interface SaturnButton {
    makeButton(): ButtonBuilder;
    handle(interaction: ButtonInteraction): Promise<void>;
}

export class SaturnCommands {
    public static commands: [SaturnCommand] = [
        new ClanCommand()
    ]

    public static buttons: [SaturnButton] = [
        new ClanApplyButton()
    ]

    static getCommand(name: string): SaturnCommand {
        return this.commands.filter(c => c.makeCommand().name == name)[0];
    }

    static getBtn(customId: string): SaturnButton {
        return this.buttons.filter(c => c.makeButton().toJSON()["custom_id"] == customId)[0];
    }

    static async registerAll() {
        await SaturnBot.INSTANCE.api.put(Routes.applicationCommands(SaturnBot.CLIENT_ID), { body:
            this.commands.map(c => c.makeCommand().toJSON())
        });

        SaturnBot.INSTANCE.client.on('interactionCreate', async interaction => {
            if (!interaction.isChatInputCommand) return;
            const cInteraction = interaction.isChatInputCommand ? (interaction as ChatInputCommandInteraction) : null;
            const bInteraction = interaction.isButton ? (interaction as ButtonInteraction) : null;
            const SSMInteraction = interaction.isStringSelectMenu ? (interaction as StringSelectMenuInteraction) : null;

            if (SSMInteraction && SSMInteraction.customId?.split("::")[0] == "applyToClan") {
                ClanApply.applyToClan(SSMInteraction);
                return;
            }
            
            const button = this.getBtn(bInteraction.customId?.split("::")[0])
            if (button) { button.handle(bInteraction); return; }
            
            const command = this.getCommand(cInteraction.commandName?.split("::")[0])
            if (command) { command.handle(cInteraction); return; }

            if (bInteraction && !button) cInteraction.reply({ content: `Invalid Button: ${bInteraction.customId}` })
            if (cInteraction && !command) cInteraction.reply({ content: `Command not found: ${cInteraction.commandName}` })
        })
    }
}