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

    public badgeHash(): string {
        return this.rawData["badge_hash"]
    }

    public async withIconImage<T>(consumer: (emoji: ApplicationEmoji) => Promise<T>) {
        return await ClanDetails.withIconImage(this.guildID(), this.badgeHash(), consumer);
    }

    public static async withIconImage<T>(guildID: Snowflake, badgeHash: string, consumer: (emoji: ApplicationEmoji) => Promise<T>) {
        
        const emojiImage: ArrayBuffer = await fetch(
             SaturnBot.INSTANCE.uAPI.options.cdn + URoutes.clanBadge(guildID, badgeHash)
        )
        .then(res => res.arrayBuffer());

        var emojiCreated;
        try {
        emojiCreated = await SaturnBot.INSTANCE.client.application.emojis.create({
            name: badgeHash.substring(0, 15),
            attachment: Buffer.from(emojiImage)
        })
        } catch {
            emojiCreated = null
        }

        const output = await consumer(emojiCreated);

        if (emojiCreated?.id) {
            await SaturnBot.INSTANCE.client.application.emojis.delete(emojiCreated.id)
        }

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