import { REST } from "discord.js"
import { URoutes } from "./api/URoutes"

const server = "1244682239187619940"
const member = "1000330693617926194"

const auth = "MTE0NDE2NzQyNjI5Mjk5NDEwMA.GXcazF.BwPATrSAebSNQ_morptGWZPBZAOB3-C8XSUxeI"

// @ts-expect-error
const api = new REST({ authPrefix: "" })

api.setToken(auth);

async function exec() {
    const res = await api.get(URoutes.serverSubs(server)) as object[]

    console.log(
        res.filter(obj => obj["user_id"] == member)
    )

    console.log(
        `Boost count: ${res.filter(obj => obj["user_id"] == member).length}`
    )
}

exec()