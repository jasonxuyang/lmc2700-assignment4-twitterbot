import Twit from "twit";
import config from "./config.js";

export default class TwitService {
  // construct Twit object with config defined in config.js
  constructor() {
    this.twit = new Twit(config);
  }

  // params:
  //    message<string>
  postTweet = async (message) => {
    return this.twit
      .post("statuses/update", { status: message })
      .then((res) => res.data)
      .catch((err) => console.error(err));
  };

  // params:
  //    query<string>
  //    date<Date>
  //    count<number>
  searchTweet = async (query, date, count) => {
    const d = date.toISOString().split("T")[0];
    const q = `${query} since:${d}`;
    console.log(q);
    return this.twit
      .get("search/tweets", { q, count })
      .then((res) => res.data)
      .catch((err) => {
        console.error(err);
      });
  };
}
