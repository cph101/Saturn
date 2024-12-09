import { Interaction, AutocompleteInteraction } from "discord.js";
import { EventHandler } from "../../api/EventHandler";
import { GuildsAcceptHandler } from "../command/guilds/GuildsAcceptHandler";
import { Clans } from "../../data/Clans";
import { GuildsCommandHandler } from "../command/GuildsCommandHandler";

export class GuildsACHandler extends EventHandler<"interactionCreate"> {

    async handle(interaction: AutocompleteInteraction) {
        if (Clans.lastUpdated <= (Date.now() - (1000 * 60 * 90))) {
            await Clans.refreshCache(null); 
        }

        interaction.respond(
            Clans.getClanMemberCounts()
                .filter(g => g.members <= 200)
                .map(({ clan }, index) => ({ name: clan.name, value: String(index) }))
        );
    }

    handledEvent(): "interactionCreate" {
        return "interactionCreate";
    }

    async canHandle(interaction: Interaction) {
        return interaction.isAutocomplete() 
            && interaction.commandName == new GuildsCommandHandler().buildRepresentable().name
            && interaction.options.getSubcommand() == new GuildsAcceptHandler().buildRepresentable().name;
    }
    
}