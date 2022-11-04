// Our Twitter library
import {
  clearProfileTimeline,
  MINUTE,
  reverseMessage,
  SECOND,
} from "./helpers.js";
import { default as TwitService } from "./twitService.js";

export const twitService = new TwitService();

// Clear Timeline
clearProfileTimeline();

let tweetCount = 0;
const bot = async () => {
  const tweet = await twitService.postTweet(`Test Tweet ${tweetCount}`);
  await twitService.reply(tweet.id_str, reverseMessage(tweet.text));
  tweetCount += 1;
  if (tweetCount > 100) {
    clearInterval(interval);
  }
};

const interval = setInterval(bot, MINUTE);
