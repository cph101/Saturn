import { OmitPartialGroupDMChannel, Message } from "discord.js";
import { TextCommand } from "../../api/txtcom/TextCommand";
import { CommandPresentation } from "../../api/txtcom/CommandPresentation";

export class BoostsHandler extends TextCommand {
    buildRepresentable() {
        return new CommandPresentation.Builder("boosts")
            .addArg("member", "user")
            .build()
    }

    async handle(message: OmitPartialGroupDMChannel<Message<boolean>>) {
        const args = message.content.match(this.buildRepresentable().buildRegex());
        console.log(this.buildRepresentable().extractArg(args, "amongus"))
        console.log(this.buildRepresentable().extractArg(args, "member"))
        console.log(this.buildRepresentable().usedAlias(args))
    }
    
    
}