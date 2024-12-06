import { 
    ChatInputCommandInteraction, EmbedBuilder, 
    SlashCommandBuilder
} from "discord.js";

import { CommandLikeHandler } from "./CommandLikeHandler";
import { SubCommandHandler } from "./SubCommandHandler";

export abstract class CommandTreeHandler extends CommandLikeHandler {

    abstract buildRepresentable(): SlashCommandBuilder

    abstract subcommands(): (new () => SubCommandHandler)[]
    
    async handleCommand(interaction: ChatInputCommandInteraction) {
        const sub = interaction.options.getSubcommand();
        const handler = this.subcommandInstances().find(handler => 
            handler.buildRepresentable().name == sub
        )
        if (handler) {
            handler.handleCommand(interaction)
        } else {
            let embed: EmbedBuilder = new EmbedBuilder()
                .setColor(0xED4245)
                .setTitle(`Unhandled command, ${interaction.commandName}`)

            interaction.reply({ embeds: [embed] })
        }
    }

    private subcommandInstances(): SubCommandHandler[] {
        return this.subcommands().map(handlerClass => {
            return new handlerClass()
        })
    }
}