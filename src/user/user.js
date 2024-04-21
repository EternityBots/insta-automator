import axios from 'axios';

export default class User {
   constructor(helper) {
      this.cookie = helper.session.get("cookie");
      this.cookieErr = (err) => {
          if(err.code == "ERR_FR_TOO_MANY_REDIRECTS") helper.login();
      }
   }
  
    usernameSearch = async (user) => {
        try {
            let { data } = await axios.get(
                `https://www.instagram.com/api/v1/users/web_profile_info/?username=${user}`,
                {
                    headers: {
                        "User-Agent": "Instagram 100.1.0.29.135 Android",
                        "Content-Type": "application/x-www-form-urlencoded",
                        "Accept-Language": "en-US,en;q=0.9",
                        Cookie: this.cookie || "",
                    },
                },
            );
            return data?.data?.user || "No User Found";
        } catch (err) {
            this.cookieErr(err);
    };
  }
}

