import * as fs from "node:fs/promises"
import * as path from "path"

type RankType = "OWNER" | "ROLE" | "USER"

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

    public static getUsers() {
        return Object.fromEntries(this.users.map(a => [a.id, a.rankType]))
    }

}