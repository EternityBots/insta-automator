import Helper from './helpers/helper.js';
import User from './user/user.js';
import {config} from "dotenv";
config();
const { username, password} = process.env; 

// You must generate

(async () => {
  try {
   const helper = new Helper(
     username, password
   );
    await helper.login();
   
    let user = new User(helper);
//console.log(await user.usernameSearch("anime_senpai_069")); 
  } catch (err) {
   console.log(err);
  }
})()

