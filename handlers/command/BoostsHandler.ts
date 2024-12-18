import { OmitPartialGroupDMChannel, Message, EmbedBuilder } from "discord.js";
import { TextCommand } from "../../api/txtcom/TextCommand";
import { CommandPresentation } from "../../api/txtcom/CommandPresentation";
import { SaturnBot } from "../..";
import { URoutes } from "../../api/URoutes";

export class BoostsHandler extends TextCommand {
    buildRepresentable() {
        return new CommandPresentation.Builder("boosts")
            .addArg("member", "user")
            .build()
    }

    async handle(message: OmitPartialGroupDMChannel<Message<boolean>>) {
        const args = message.content.match(this.buildRepresentable().buildRegex());

        const user = this.buildRepresentable().extractArg(args, "member")

        const allBoosts = await SaturnBot.INSTANCE.uAPI.get(
            URoutes.serverSubs("1244682239187619940")
        ) as object[]

        const usrBoosts = allBoosts.filter(obj => obj["user_id"] == user)

        var HRCount;
        switch (usrBoosts.length) {
            case 1: HRCount = "once"
            case 2: HRCount = "twice"
            default: HRCount = usrBoosts.length + " times"
        }

        const embed = new EmbedBuilder()
                        .setColor(0xFFFFFF)
                        .setDescription(`### <@${user}> boosted ${HRCount}`)
        message.reply({ embeds: [embed] })
    }
    
    
}