import fetch from "node-fetch";
const API_KEY = "xn5fetnr0dkbdp6xqckv26y5ifgputr63kf80wo01y2a8wuag";

export default class WordnikService {
  constructor() {}

  getRandomWord = async () => {
    try {
      const res = fetch(
        "https://api.wordnik.com/v4/words.json/randomWord?hasDictionaryDef=true&maxCorpusCount=-1&minDictionaryCount=1&maxDictionaryCount=-1&minLength=5&maxLength=-1&api_key=" +
          API_KEY
      )
        .then((res) => res.json())
        .then((data) => data);
      return res;
    } catch (err) {
      return console.error(err);
    }
  };
}
