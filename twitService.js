import Twit from "twit";
import config from "./config.js";

export default class TwitService {
  // construct Twit object with config defined in config.js
  constructor() {
    this.twit = new Twit(config);
  }

  // Posts a tweet with the passed in message
  // params:
  //    message: string
  postTweet = async (message) => {
    try {
      const res = await this.twit.post("statuses/update", { status: message });
      return res.data;
    } catch (err) {
      return console.error(err);
    }
  };

  // Search for a {count} number of tweets since a certain day with the passed in query.
  // params:
  //    query: string - can be a hashtag, a user handle, or a message
  //    count: number
  searchTweet = async (query, count) => {
    const q = query;
    try {
      const res = await this.twit.get("search/tweets", { q, count });
      return res.data;
    } catch (err) {
      return console.error(err);
    }
  };

  // Get {count} most recent mentions, with the option to include retweets
  // params:
  //    count: number
  //    includeRetweets: boolean
  getMentions = async (count, includeRetweets) => {
    try {
      const res = await this.twit.get("statuses/mentions_timeline", {
        count,
        include_rts: includeRetweets,
      });
      return res.data;
    } catch (err) {
      return console.error(err);
    }
  };

  // Reply to a tweet with the passed in message
  // params:
  //    tweetId: string
  //    message: string
  reply = async (tweetId, message) => {
    try {
      const res = await this.twit.post("statuses/update", {
        status: message,
        in_reply_to_status_id: tweetId,
      });
      return res.data;
    } catch (err) {
      return console.error(err);
    }
  };

  // Retweet a tweet with the passed in tweetId
  // params:
  //    tweetId: string
  retweet = async (tweetId) => {
    try {
      const res = await this.twit.post("statuses/retweet/:id", { id: tweetId });
      return res.data;
    } catch (err) {
      return console.error(err);
    }
  };

  // Delete a tweet with the passed in tweetId
  // params:
  //    tweetId: string
  delete = async (tweetId) => {
    try {
      const res = await this.twit.post("statuses/destroy/:id", { id: tweetId });
      return res.data;
    } catch (err) {
      return console.error(err);
    }
  };
}
