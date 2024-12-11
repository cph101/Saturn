import { Snowflake } from "discord.js";
import { SaturnBot } from "../..";
import { URoutes } from "../URoutes";
import { ClanDetails } from "../clan/ClanDetails";

export class ExtendedUser {
    private rawData: Object;

    private constructor(data: Object) {
        this.rawData = data["user"];
    }

    public static async fetch(uid: Snowflake) {
        return new ExtendedUser(await SaturnBot.INSTANCE.uAPI.get(URoutes.profile(uid)))
    }

    public id(): Snowflake {
        return this.rawData["id"]
    }

    public username(): string {
        return this.rawData["username"]
    }

    public globalName(): string {
        return this.rawData["global_name"]
    }

    public clan(): Clan {
        return this.rawData["clan"]
    }
}

export interface Clan {
    identity_guild_id: string,
    identity_enabled: boolean,
    tag: string,
    badge: string
}