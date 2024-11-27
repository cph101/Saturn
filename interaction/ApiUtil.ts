import { ChatInputCommandInteraction, EmbedBuilder } from "discord.js";
import { AxiosError } from "axios";

export class ApiUtil {

    static async wrapAxiosWithEmbedError<T>(
        interaction: ChatInputCommandInteraction,
        func: () => T,
        errorhandler: (embed: EmbedBuilder, error: AxiosError) => void = function () {}
    ) {
        try {
            return await func();
        } catch (error: any) {
            let embed: EmbedBuilder = new EmbedBuilder().setColor(0xED4245);
    
            if (error.response) {
                switch (error.response.status) {
                    case 401: embed.setDescription(`Error 401: Unauthorized`); break;
                    case 404: embed.setDescription(`Error 404: Page not found`); break;
                    default: embed.setDescription(`Unknown Error (HTTP code ${error.response.status})`); break;
                }
            } else {
                embed.setTitle("Error: Server did not respond");
            }
    
            errorhandler(embed, error);

            embed.setDescription("**" + embed.toJSON().description + "**. <@1118834539452706867>, wake up!");
            interaction.reply({ embeds: [embed] });
        }
    }    

}