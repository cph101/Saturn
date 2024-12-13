import * as path from "path"
import * as fsp from "node:fs/promises"
import * as fs from "node:fs"

export class ResourceDiskWrapper {

    public static async assertExistant(file: string) {
        const filePath = path.resolve("resources/" + file);
        if (!fs.existsSync(filePath)) {
            const def = await fsp.readFile(path.resolve("dResources/" + file))
            await fsp.writeFile(filePath, def);
        }
    }

}