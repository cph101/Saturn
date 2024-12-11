import { ApplicationEmoji, Snowflake } from "discord.js";
import { SaturnBot } from "../..";
import { URoutes } from "../URoutes";

export class ClanDetails {
    private rawData: Object;

    private constructor(rawData: Object) {
        this.rawData = rawData;
    }

    public static async get(guildID: Snowflake) {
        return new ClanDetails(await SaturnBot.INSTANCE.uAPI.get(URoutes.clanDetails(guildID)))
    }

    public guildID(): Snowflake {
        return this.rawData["id"]
    }

    public name(): string {
        return this.rawData["name"]
    }

    public tag(): string {
        return this.rawData["tag"]
    }

    public iconHash(): string {
        return this.rawData["icon_hash"]
    }

    public async withIconImage<T>(consumer: (emoji: ApplicationEmoji) => Promise<T>) {
        return await ClanDetails.withIconImage(this.guildID(), this.iconHash(), consumer);
    }

    public static async withIconImage<T>(guildID: Snowflake, iconHash: string, consumer: (emoji: ApplicationEmoji) => Promise<T>) {
        const emojiImage: ArrayBuffer = await fetch(
             SaturnBot.INSTANCE.uAPI.options.cdn + URoutes.clanBadge(guildID, iconHash)
        )
        .then(res => res.arrayBuffer());

        const emojiCreated = await SaturnBot.INSTANCE.client.application.emojis.create({
            name: iconHash.substring(0, 15),
            attachment: Buffer.from(emojiImage)
        })

        const output = await consumer(emojiCreated);

        await SaturnBot.INSTANCE.client.application.emojis.delete(emojiCreated.id)

        return output;
    }

    public bannerHash(): string {
        return this.rawData["banner_hash"]
    }

    public members(): number {
        return this.rawData["member_count"]
    }

    public description(): number {
        return this.rawData["description"]
    }
}