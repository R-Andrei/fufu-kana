const correctMessages = [
  "Good one.",
  "That’s right.",
  "Yep, nailed it.",
  "Perfect.",
  "Spot on.",
  "Exactly.",
  "Correct.",
  "You got it.",
  "Nice work.",
  "Well done.",
  "Right on.",
  "Keep it going.",
  "That’s it.",
  "Bang on.",
  "Smooth.",
  "Solid.",
  "Clean.",
  "Sharp.",
  "On point.",
  "Way to go.",
  "You rock.",
  "Nailed it.",
  "Looks good.",
  "Keep it up.",
  "Super.",
  "Excellent.",
  "いいね！",
  "そうだよ！",
  "すごい！",
  "うまい！",
  "よくできた！",
  "そのとおり！",
  "ばっちり！",
  "ばっちぐー！",
  "かんぺき！",
  "まる！",
  "すてき！",
];

export function getRandomCorrectMessage() {
  const i = Math.floor(Math.random() * correctMessages.length);
  return correctMessages[i];
}


const wrongMessageStarts = [
  "Oops! The correct reading for",
  "Whoops! The right answer for",
  "Almost got it, but the proper reading for",
  "Not quite right — the correct reading for",
  "That’s not it, the reading for",
  "Missed that one! The right reading for",
  "Keep trying — the right reading for",
  "Almost there! The correct romaji for",
  "Almost perfect! The right romaji for",
  "Not quite — the proper reading for",
  "Don’t give up! The right answer for",
  "Close! The correct romaji for",
  "Almost! The reading for",
  "Keep practicing! The right reading for",
  "So close! The correct romaji for",
  "おっと！The correct reading for",
  "おしい！The right reading for",
  "おっと！The right romaji for",
  "ざんねん！The right answer for",
];

export function getRandomWrongMessage(word:string, correctRomaji:string) {
  const i = Math.floor(Math.random() * wrongMessageStarts.length);
  return `${wrongMessageStarts[i]} ${word} is ${correctRomaji}.`;
}