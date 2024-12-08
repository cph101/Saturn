import { SlashCommandSubcommandBuilder, ChatInputCommandInteraction, SlashCommandStringOption, SlashCommandIntegerOption } from "discord.js";
import { SubCommandHandler } from "../../../api/command/SubCommandHandler";

export class GuildsAcceptHandler extends SubCommandHandler {

    buildRepresentable(): SlashCommandSubcommandBuilder {
        return new SlashCommandSubcommandBuilder()
            .setName("accept").setDescription("Accepts person(s) into a specified guild")
                .addStringOption(new SlashCommandStringOption().setAutocomplete(true).setName("Guilds").setDescription("Guilds to accept people into"))
                .addIntegerOption(new SlashCommandIntegerOption().setMaxValue(200).setName("Number").setDescription("Maximum number of people to accept"))
                .addStringOption(new SlashCommandStringOption().setAutocomplete(true).setName("Users").setDescription("Users to accept, or not to accept if Number is set"))
    }

    async handleCommand(interaction: ChatInputCommandInteraction) {
        throw new Error("Method not implemented.");
    }
    
}