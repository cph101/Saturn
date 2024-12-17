import { Snowflake } from "discord.js";

export class URoutes {
    static profile(userId?: Snowflake | "@me"): `/users/${string}/profile` {
        return `/users/${userId}/profile`;
    };

    static clanDetails(guildID: Snowflake): `/discovery/${string}/clan` {
        return `/discovery/${guildID}/clan`;
    }

    static clanBadge(guildID: Snowflake, iconHash: string): `/clan-badges/${string}/${string}.png` {
        return `/clan-badges/${guildID}/${iconHash}.png`;
    }

    static serverSubs(guildID: Snowflake): `/guilds/${string}/premium/subscriptions` {
        return`/guilds/${guildID}/premium/subscriptions`;
    }
}