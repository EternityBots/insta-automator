import Helper from './helpers/helper.js';
import { promises as fs} from 'fs'
const random = import('lodash').random;
const {USERNAME, PASSWORD} = process.env; 

// You must generate
const helper = new Helper();

(async () => {
  try {
    if(!USERNAME || !PASSWORD) throw Error("You must generate .env file");
      let dataa = await helper.getCookie(USERNAME, PASSWORD);
   await fs.writeFile("data.json", JSON.stringify(dataa, null, 2))
   
      console.log(dataa);
    let data = JSON.parse(await fs.readFile("data.json", "utf8"));
   let res = await helper.username("anime_senpai_069",data.cookie)
    console.log(res)
  } catch (err) {
   console.log(err);
  }
})()

