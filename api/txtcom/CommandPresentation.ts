const argex = {
    string: "[^\\s]+?",
    number: "-?(\\d+(\\.\\d*)?|\\.\\d+)",
    boolean: "true|false",
    time: "\\b(\\d+)\\s*(d|m|y|h|s|day|month|year|hour|second)s?\\b|\\binf\\b",
    user: "<@!?(\\d{17,20})>|\\d{17,20}",
    code: "`([^`]+)`|```([\\s\\S]+?)```"
};

export type argTypes = typeof argex;

export class CommandPresentation<T extends { [key: string]: keyof argTypes }> {
    private args: T;
    private names: string[];
    private prefix: string;

    private constructor(args: T, names: string[], prefix: string) {
        this.args = args;
        this.names = names;
        this.prefix = prefix;
    }

    public extractArg(matched: RegExpMatchArray, arg: keyof T): any {
        const argIndex = Object.keys(this.args).indexOf(arg as string) + 2;
        const value = matched[argIndex];

        switch (this.args[arg]) {
            case "number":
                return value ? parseFloat(value) : null;
            case "boolean":
                return value === "true";
            case "time":
                return value === "inf" ? "indefinite" : value;
            case "user":
                return value?.replace(/[<@!>]/g, "");
            case "code":
                return value?.replace(/`{1,3}/g, "");
            case "string":
            default:
                return value;
        }
    }

    public usedAlias(matched: RegExpMatchArray): any {
        return matched[1];
    }

    private escapeRegExpString(str: string): string {
        return str.replace(/[.*+?^=!:${}()|\[\]\/\\]/g, "\\$&");
    }

    public buildRegex(): RegExp {
        const escapedPrefix = this.escapeRegExpString(this.prefix);
        const argPatterns = Object.values(this.args).map((type) => `(${argex[type]})?`).join(" ");
        return new RegExp(`^${escapedPrefix}(${this.names.join("|")})(?: ${argPatterns})?$`);
    }

    public static Builder = class {
        private args: { [key: string]: keyof argTypes } = {};
        private names: string[] = [];

        constructor(name: string) {
            this.names.push(name);
        }

        public addArg(name: string, type: keyof argTypes): this {
            this.args[name] = type;
            return this;
        }

        public addAlias(name: string): this {
            this.names.push(name);
            return this;
        }

        public build(prefix: string = ","): CommandPresentation<typeof this.args> {
            return new CommandPresentation(this.args, this.names, prefix);
        }
    };
}
