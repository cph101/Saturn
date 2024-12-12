import * as fs from "node:fs/promises"
import * as path from "path"

type RankType = "OWNER" | "ADMIN"

export class SuperUsers {

    private static users: {
            rankType: RankType
            id: string
    }[] = []

    static {
        this.refreshUsers()
    }

    public static async refreshUsers() {
        this.users = []

        const superusers = await fs.readFile(
            path.resolve('resources/whitelist.db'), 
            { encoding: 'utf8' }
        )

        const parsed1 = superusers.split("\n")
        parsed1.forEach(user => {
            const [rank, id] = user.split(" ")
            this.users.push({rankType: rank as RankType, id: id})
        })
    }

    public static async addAdmin(userId: string): Promise<boolean> {
        const existingUser = this.users.find((user) => user.id === userId);

        if (existingUser) return false;
        this.users.push({ rankType: "ADMIN", id: userId });

        const newUserEntry = `\nADMIN ${userId}`;

        await fs.appendFile(path.resolve("resources/whitelist.db"), newUserEntry, { encoding: "utf8" });
        return true;
    }

    public static async removeUser(userId: string): Promise<number> {
        const existingUserIndex = this.users.findIndex((user) => user.id === userId);

        if (existingUserIndex === -1) return 0;

        const existingUser = this.users[existingUserIndex];

        if (existingUser.rankType !== "ADMIN") return 1;


        this.users.splice(existingUserIndex, 1);

        const updatedContent = this.users
            .map((user) => `${user.rankType} ${user.id}`)
            .join("\n");

        await fs.writeFile(path.resolve("resources/whitelist.db"), updatedContent, { encoding: "utf8" });

        return 2;
    }

    public static getUsers() {
        return Object.fromEntries(this.users.map(a => [a.id, a.rankType]))
    }

}