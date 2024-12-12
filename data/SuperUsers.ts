import * as fs from "node:fs/promises"
import * as path from "path"

export class SuperUsers {
    private static users: {
        rankType: number;
        id: string;
    }[] = [];

    static {
        this.refreshUsers();
    }

    // Refresh the users list from the whitelist database
    public static async refreshUsers() {
        this.users = [];

        const superusers = await fs.readFile(
            path.resolve("resources/whitelist.db"),
            { encoding: "utf8" }
        );

        const parsed1 = superusers.split("\n");
        parsed1.forEach((user) => {
            const [rank, id] = user.split(" ");
            this.users.push({ rankType: parseInt(rank), id: id });
        });
    }

    // Add a user to the whitelist with the STAFF rank
    public static async addAdmin(userId: string): Promise<boolean> {
        const existingUser = this.users.find((user) => user.id === userId);

        if (existingUser) return false;
        this.users.push({ rankType: 0, id: userId });

        const newUserEntry = `\n${0} ${userId}`;
        await fs.appendFile(path.resolve("resources/whitelist.db"), newUserEntry, { encoding: "utf8" });
        return true;
    }

    // Promote a STAFF user to OWNER
    public static async promoteToOwner(userId: string): Promise<number> {
        const existingUserIndex = this.users.findIndex((user) => user.id === userId);

        if (existingUserIndex === -1) {
            // User not found
            return 0;
        }

        const existingUser = this.users[existingUserIndex];

        if (existingUser.rankType === 1 || existingUser.rankType === 2) {
            // User is already OWNER or FOUNDER
            return 1;
        }

        // Promote the user to OWNER
        this.users[existingUserIndex].rankType = 1;

        // Update the database
        const updatedContent = this.users
            .map((user) => `${user.rankType} ${user.id}`)
            .join("\n");

        await fs.writeFile(path.resolve("resources/whitelist.db"), updatedContent, { encoding: "utf8" });

        return 2;
    }

    // Remove a user from the whitelist with rank-based restrictions
    public static async removeUser(userId: string, callerRank: number): Promise<number> {
        const existingUserIndex = this.users.findIndex((user) => user.id === userId);

        if (existingUserIndex === -1) return 0;

        const existingUser = this.users[existingUserIndex];

        // Founders cannot be removed
        if (existingUser.rankType === 2) return 1;

        // Owners can only be removed by Founders
        if (existingUser.rankType === 1 && callerRank < 2) return 2;

        // STAFF can be removed by OWNER or FOUNDER
        if (existingUser.rankType === 0 && callerRank < 1) return 3;

        // Remove the user
        this.users.splice(existingUserIndex, 1);

        // Update the database
        const updatedContent = this.users
            .map((user) => `${user.rankType} ${user.id}`)
            .join("\n");

        await fs.writeFile(path.resolve("resources/whitelist.db"), updatedContent, { encoding: "utf8" });

        return 4;
    }

    // Get a mapping of user IDs to their ranks
    public static getUsers() {
        return Object.fromEntries(this.users.map((a) => [a.id, a.rankType]));
    }
}
