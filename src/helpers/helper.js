import axios from "axios";
import { v4 as randomUUID } from "uuid";

class Helper {
    constructor() {
        
    }

    async fetchHeaders() {
        try {
            const response = await axios.get(
                "https://i.instagram.com/api/v1/si/fetch_headers/?challenge_type=signup",
            );
            return response.headers;
        } catch (error) {
            return error;
        }
    }

    async getCookie(username, password, withLoginData = true) {
        try {
            this.headersPromise = this.fetchHeaders();
            const [headers] = await Promise.all([this.headersPromise]);

            const loginHeaders = {
                "User-Agent": "Instagram 100.1.0.29.135 Android",
                "Content-Type": "application/x-www-form-urlencoded",
                "Accept-Language": "en-US,en;q=0.9",
                Cookie: this.formatCookie(headers["set-cookie"]) || "",
            };

            const res = await axios.post(
                "https://i.instagram.com/api/v1/accounts/login/?",
                `username=${username}&password=${encodeURIComponent(password)}&device_id=${randomUUID()}&login_attempt_count=0`,
                {
                    headers: loginHeaders,
                },
            );
            const cookie = this.formatCookie(res.headers["set-cookie"]) || "";
            return withLoginData ? { ...res.data, cookie } : cookie;
        } catch (error) {
            return error;
        }
    }

    formatCookie(cookieString) {
        return cookieString?.map((x) => x.match(/(.*?=.*?);/)?.[1])?.join("; ");
    }

    sessionId(cookie) {
        return cookie.match(/sessionid=(.*?);/)?.[1] || "";
    }

     crsfToken = async(cookie) => {
        try {
            const csrfHeaders = {
                "User-Agent": "Instagram 100.1.0.29.135 Android",
                "Content-Type": "application/x-www-form-urlencoded",
                "Accept-Language": "en-US,en;q=0.9",
                Cookie: cookie || "",
            };

            const res = await axios.get(
                "https://i.instagram.com/api/v1/accounts/current_user/?edit=true",
                {
                    headers: csrfHeaders,
                },
            );
            const csrfToken = res.headers["set-cookie"][0] || "";
            return csrfToken;
        } catch (error) {
            return error;
        }
    }

    username = async (user,cookie) => {
        try {
            let { data } = await axios.get(
                `https://www.instagram.com/api/v1/users/web_profile_info/?username=${user}`,
                {
                    headers: {
                        "User-Agent": "Instagram 100.1.0.29.135 Android",
                        "Content-Type": "application/x-www-form-urlencoded",
                        "Accept-Language": "en-US,en;q=0.9",
                        Cookie: cookie || "",
                    },
                },
            );
            return data.data.user;
        } catch (err) {
            throw err;
        }
    };
    
}

export default Helper;
