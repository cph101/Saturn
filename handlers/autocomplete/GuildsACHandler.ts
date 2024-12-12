import { Interaction, AutocompleteInteraction } from "discord.js";
import { EventHandler } from "../../api/EventHandler";
import { Clans } from "../../data/Clans";
import { GuildsAcceptHandler } from "../command/GuildsAcceptHandler";

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
            && interaction.commandName == new GuildsAcceptHandler().buildRepresentable().name;
    }
    
}