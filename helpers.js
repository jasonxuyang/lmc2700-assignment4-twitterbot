import { twitService } from "./server.js";
export const SECOND = 1000;
export const MINUTE = 60 * SECOND;
export const HOUR = 60 * MINUTE;
export const DAY = 24 * HOUR;
export const SCREEN_NAMES = { home: "Group14_twitbot" };

// Deletes all of the tweets from our profile.
export const deleteAllTweets = async () => {
  const tweets = await twitService.searchTweet(SCREEN_NAMES.home);
  tweets.statuses.forEach((tweet) => twitService.delete(tweet.id_str));
};

// Unlikes all tweets from our profile.
export const deleteAllLikes = async () => {
  const likes = await twitService.getLikes(SCREEN_NAMES.home);
  likes.forEach((tweet) => twitService.unlike(tweet.id_str));
};

// Takes in a string and reverses it
export const reverseMessage = (message) => {
  return message.split("").reverse().join("");
};
