// Our Twitter library
import {
  deleteAllLikes,
  deleteAllTweets,
  MINUTE,
  reverseString,
  SCREEN_NAMES,
} from "./helpers.js";
import { default as TwitService } from "./twitService.js";
import WordnikService from "./wordnikService.js";

export const twitService = new TwitService();
const wordnikService = new WordnikService();

// Reset account state
deleteAllTweets();
deleteAllLikes();

let iterations = 0;
const bot = async () => {
  try {
    // search for most recent tweet with #yellow jacket and like that tweet
    const searchYellowJacketHashtag = await twitService.searchTweet(
      "#yellowjacket",
      100
    );
    const tweetYellowJacketHashtag =
      searchYellowJacketHashtag.statuses[
        Math.floor(Math.random() * searchYellowJacketHashtag.statuses.length)
      ];
    await twitService.like(tweetYellowJacketHashtag.id_str);

    // pick a random follower from a random user from our following list and follow them
    const followed = await twitService.getFollowedUsersByScreenName(
      SCREEN_NAMES.home
    );
    const followedUserIds = followed.ids;
    const randomFollowingUserId =
      followedUserIds[Math.floor(Math.random() * followedUserIds.length)];
    const followers = await twitService.getFollowers(randomFollowingUserId);
    const followerUserIds = followers.ids;
    const randomFollowerUserId =
      followerUserIds[Math.floor(Math.random() * followerUserIds.length)];
    await twitService.followById(randomFollowerUserId.toString());

    // find a tweet with the phrase "I think" and respond "Why do you think that?"
    const searchIThinkTweet = await twitService.searchTweet("I think", 100);
    const tweetIThink =
      searchIThinkTweet.statuses[
        Math.floor(Math.random() * searchIThinkTweet.statuses.length)
      ];
    await twitService.reply(tweetIThink.id_str, "Why do you think that?");

    // post a randomly generated tweet and reply with the word reverse
    const randomWord = await wordnikService.getRandomWord();
    const tweetWordOfTheDay = await twitService.postTweet(
      `Word of the Day: ${randomWord.word}`
    );
    const randomWordBackwards = reverseString(randomWord.word);
    await twitService.reply(
      tweetWordOfTheDay.id_str,
      `Backwards word of the Day: ${randomWordBackwards}`
    );
  } catch (err) {
    console.error(err);
  }

  iterations += 1;
  if (iterations > 20) {
    clearInterval(interval);
  }
};

const interval = setInterval(bot, MINUTE);
