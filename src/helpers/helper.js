import axios from "axios";
import { v4 as randomUUID } from "uuid";
import fs from "fs";
let time = Date.now();
const isExpired = (storedTimeInMillis) => {
    const storedTime = new Date(storedTimeInMillis);
    const currentTime = new Date();
    const timeDifferenceInMillis = currentTime - storedTime;
    const hoursPassed = timeDifferenceInMillis / (1000 * 60 * 60);
    return hoursPassed < 20;
}

class Helper {
    constructor(username, password) {
        if(!username && !password) return "Give username and password "
       this.user = username;
       this.pass = password;
       this.session = new Map()
    }

     fetchHeaders = async () => {
        try {
            const response = await axios.get(
                "https://i.instagram.com/api/v1/si/fetch_headers/?challenge_type=signup",
            );
            return response.headers;
        } catch (error) {
            return error;
        }
    }

      login = async () => {
        try {
            this.headersPromise = this.fetchHeaders();
            const [headers] = await Promise.all([this.headersPromise]);

            const loginHeaders = {
                "User-Agent": "Instagram 100.1.0.29.135 Android",
                "Content-Type": "application/x-www-form-urlencoded",
                "Accept-Language": "en-US,en;q=0.9",
                Cookie: this.formatCookie(headers["set-cookie"]) || "",
            };
            
            let storedtime = (fs.existsSync("data.json"))?
             JSON.parse(await fs.promises.readFile("data.json", "utf8"))?.time : time;
                
            let res;
            if(fs.existsSync("data.json") && isExpired(storedtime)) {
                res = JSON.parse(await fs.promises.readFile("data.json", "utf8"));
            } else {
            let resp =  await axios.post(
                "https://i.instagram.com/api/v1/accounts/login/?",
                `username=${this.user}&password=${encodeURIComponent(this.pass)}&device_id=${randomUUID()}&login_attempt_count=0`,
                {
                    headers: loginHeaders,
                },
            );

                const cookie = this.formatCookie(resp.headers["set-cookie"]) || "";
                res = { ...resp.data, cookie,time }
                await fs.promises.writeFile("data.json", JSON.stringify(res, null, 2))
        }
            this.session.set("cookie",res?.cookie);
this.session.set("name",res?.logged_in_user?.full_name);
             return res
        } catch (error) {
            return error;
        }
    }

    formatCookie(cookieString) {
        return cookieString?.map((x) => x.match(/(.*?=.*?);/)?.[1])?.join("; ");
    }

}

export default Helper;
