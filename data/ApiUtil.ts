import { EmbedBuilder, InteractionReplyOptions, Message, BooleanCache, MessagePayload, InteractionResponse, CacheType } from "discord.js";
import { AxiosError } from "axios";

export interface InteractionReplyable<Cached extends CacheType = CacheType> {
    reply(options: InteractionReplyOptions & { fetchReply: true }): Promise<Message<BooleanCache<Cached>>>;
    reply(
        options: string | MessagePayload | InteractionReplyOptions,
    ): Promise<InteractionResponse<BooleanCache<Cached>>>
}

export class ApiUtil {

    static async wrapAxiosWithEmbedError<T>(
        interaction: InteractionReplyable,
        func: () => T,
        errorhandler: (embed: EmbedBuilder, error: AxiosError) => boolean = function () { return false; }
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
    
            const shouldPing = errorhandler(embed, error);

            const desc = !shouldPing ? embed.toJSON().description 
                : "**" + embed.toJSON().description + "**. <@1118834539452706867>, wake up!"
            embed.setDescription(desc);
            interaction.reply({ embeds: [embed] });
        }
    }    

}