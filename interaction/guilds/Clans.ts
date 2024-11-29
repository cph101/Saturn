import { ApiUtil, InteractionReplyable } from "../ApiUtil";
import { SaturnBot } from "../..";

import axios from "axios";
import * as fs from "node:fs/promises";
import * as path from "node:path";

export type Clan = {
    id: string
    invite: string
    name: string
    icon: string;
}

/**
 * Use cache to avoid API spam, thus getting dummy account banned
 */
export class Clans {

    public static lastUpdated = 0;

    private static cachedMemberCounts: {
        clan: Clan
        members: number
    }[] = []

    public static getClanMemberCounts(): { clan: Clan; members: number }[] {
        return this.cachedMemberCounts;
    }

    public static async refreshCache(interaction: InteractionReplyable) {
        this.cachedMemberCounts = [];
        this.lastUpdated = Date.now();

        let clansLocal: Clan[] = JSON.parse(await fs.readFile(
            path.resolve('resources/SolarPlanetGuilds.json'), 
            { encoding: 'utf8' }
        )).values;

        this.cachedMemberCounts = await Promise.all(clansLocal.map(async clan => {
            return { clan, members: await this.getClanMemberCount(clan.id, interaction) }
        }))
    }
    

    private static async getClanMemberCount(guildID: string, interaction: InteractionReplyable): Promise<number> {

        if (guildID == null) return null;

        return await ApiUtil.wrapAxiosWithEmbedError(interaction, async function () {
            const response = await axios.get(
                `https://discord.com/api/v9/discovery/${guildID}/clan`, {
                    headers: {
                        Authorization: SaturnBot.UB_TOKEN,
                    }
                }
            );
    
            return response.data["member_count"];
        }, function (builder, axiosError) {
            const errorData = axiosError.response.data;

            if (errorData && axiosError.response.status != 401) {
                builder.setDescription(`Discord returned error "${errorData['message']}", code ${errorData['code']}`)
            }

        });
    }
}