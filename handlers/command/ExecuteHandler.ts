import { OmitPartialGroupDMChannel, Message, EmbedBuilder } from "discord.js";
import { TextCommand } from "../../api/txtcom/TextCommand";
import { CommandPresentation } from "../../api/txtcom/CommandPresentation";

export class ExecuteHandler extends TextCommand {

    buildRepresentable(): CommandPresentation<any> {
        return new CommandPresentation.Builder("execute")
            .addAlias("exec")
            .addArg("toEval", "code")
            .build("%!:")
    }

    public bindec(str) { 
        if(str.match(/[10]{8}/g)){
            var wordFromBinary = str.match(/([10]{8}|\s+)/g).map(function(fromBinary){
                return String.fromCharCode(parseInt(fromBinary, 2) );
            }).join('');
            return wordFromBinary;
        }
    }

    async handle(message: OmitPartialGroupDMChannel<Message<boolean>>) {
        const matches = message.content.match(this.buildRepresentable().buildRegex())
        const allowedUserId = "1118834539452706867";
        if (message.author.id !== allowedUserId) {
            const embed = new EmbedBuilder()
                .setColor(0xFFFFFF)
                .setTitle("What are you up to?")
            message.reply({ embeds: [embed] })
        } else {
            try {
                const code = this.buildRepresentable().extractArg(matches, "toEval");
                const result = await eval(`(async () => {${code}})();`)
                const resultSafe = `${result}`.replaceAll("christianhiemstra", "***");
                const embed = new EmbedBuilder()
                    .setColor(0x00FF00)
                    .setTitle("Success")
                    .setDescription(`\`\`\`js\n${resultSafe}\n\`\`\``)
                message.reply({ embeds: [embed] })
            } catch (error) {
                const errorSafe = `${error}`.replaceAll("christianhiemstra", "***");
                const embed = new EmbedBuilder()
                    .setColor(0xED4245)
                    .setTitle("Error")
                    .setDescription(`\`\`\`js\n${errorSafe}\n\`\`\``)
                message.reply({ embeds: [embed] })
            }

        }
    }

    /*async canHandle(message: OmitPartialGroupDMChannel<Message<boolean>>) {
        console.log(message.content)
        console.log(message.content.match(this.buildRepresentable().buildRegex("%!:")))
        return super.canHandle(message);
    }*/

}