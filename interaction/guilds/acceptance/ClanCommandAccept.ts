import { ChatInputCommandInteraction, SlashCommandIntegerOption, SlashCommandStringOption, SlashCommandSubcommandBuilder, SlashCommandUserOption } from "discord.js";
import { SaturnSubCommand } from "../../Commands";

export class ClanCommandAccept implements SaturnSubCommand {

    // Waah spaghetti code. Have a beer and forget you saw this
    makeSubCommand(): SlashCommandSubcommandBuilder {
        return new SlashCommandSubcommandBuilder()
            .setName("accept").setDescription("Accepts person(s) into a specified guild")
                .addStringOption(new SlashCommandStringOption().setAutocomplete(true).setName("Guilds").setDescription("Guilds to accept people into"))
                .addIntegerOption(new SlashCommandIntegerOption().setMaxValue(200).setName("Number").setDescription("Maximum number of people to accept"))
                .addStringOption(new SlashCommandStringOption().setAutocomplete(true).setName("Users").setDescription("Users to accept, or not to accept if Number is set"))
    }
    
    async handle(interaction: ChatInputCommandInteraction) {
        throw new Error("Method not implemented.");
    }

}