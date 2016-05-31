'use strict';

// Primary function
function pokerRanker(hand) {
  if (typeof hand === 'string') {
    hand = hand.toLowerCase().split(" ");
  }
  var notFiveCards = handLengthVerifier(hand)
  if (notFiveCards) {
    return notFiveCards;
  }
  var incorrectInput = inputVerifier(hand)
  if (incorrectInput) {
    return incorrectInput;
  }
  var deck = deckCreator();
  hand = handFormatter(hand, deck)

  var rank = rankStringifier(hand);
  var highCard = highCardFinder(hand) + " high";
  var irregularHand = irregularFinder(hand);

  if (irregularHand) {
    return irregularHand
  } else if (rank){
    return rank
  } else {
    return highCard
  }
}

// Hand Verification functions to determine
// correct hand length and input format
function handLengthVerifier(hand){
  if (hand.length !== 5) {
    if (hand.length < 5) {
      return "Please add more cards!"
    } else {
      return "Looks like we've got a cheater on our hands!"
    }
  } else {
    return false
  }
}

function inputVerifier(hand){
  for (var i = 0; i < hand.length; i++) {
    if (hand[i].length !== 2 && hand[i].substr(0,2) !== "10") {
      return "Please input cards in a string or array format /n with the card in position 0 and the suit in position 1. Example: Ace of Spades = AS"
    }
  }
  return false
}

// Create a standard deck without suits in order to
// later format the input with all needed
// information
function deckCreator() {
  var deck = [
    {
      card: "a",
      value: 14,
      name: "Ace"
    },
    {
      card: 'k',
      value: 13,
      name: "King"
    },
    {
      card: 'q',
      value: 12,
      name: "Queen"
    },
    {
      card: 'j',
      value: 11,
      name: "Jack"
    }
  ];
  var i = 10;
  while (i > 1) {
    var newCard = {
      card: i.toString(),
      name: i.toString(),
      value: i
    };
    deck.push(newCard);
    i--;
  }
  return deck;
}

// Format the user inputted hand to match the deck
// format
function handFormatter(hand, deck) {
  var formattedHand = []
  hand.forEach(function(handElement) {
    var card;
    if (handElement.length === 3 && handElement.substr(0,2) === "10") {
      card = handElement.substr(0,2)
    } else {
      card = handElement.substr(0,1)
    }
    deck.forEach(function(deckElement, index){
      var key = deckElement.card;
      if (card === key) {
        var suit = handElement.substr(handElement.length - 1,1);
        var formattedCard = {
          card: card,
          value: deckElement.value,
          name: deckElement.name,
          suit: suit
        }
        formattedHand.push(formattedCard)
        }
    })
  })
  return formattedHand
}

// Find poker hands such as Straights and Flushes
// that don't get detected when searching hand for
// multiples
function irregularFinder(hand) {
  if (straightFinder(hand)) {
    if (flushFinder(hand)) {
      if (royalFinder(hand)) {
        return "Royal Flush"
      } else {
        return "Straight Flush, " +
               hand[0].name + " through " +
               hand[4].name
      }
    } else {
      return "Straight, " +
             hand[0].name + " through " +
             hand[4].name
    }
  } else if (flushFinder(hand)) {
    return 'Flush'
  }
}

// This searches for hands that contain only cards
// above 9 for Royal Flush detection
function royalFinder(hand) {
  for (var i = 0; i < hand.length; i++) {
    if (hand[i].value < 10) {
      return false
    }
  }
  return true
}

function straightFinder(hand) {
  var straightArray = [];
  hand.forEach(function(element) {
    straightArray.push(element.value)
  })
  straightArray.sort(function(a, b){
    return a - b;
  })
  for (var i = 0; i < straightArray.length - 1; i++) {
    if (straightArray[i] + 1 !== straightArray[i + 1]) {
      return false;
    }
  }
  return true
}

function flushFinder(hand) {
  var suit;
  var counter = 0;
  for (var i = 0; i < hand.length; i++){
    if (i === 0) {
      suit = hand[i].suit
      counter++;
    } else if (hand[i].suit === suit) {
      counter++
    }
  }
  if (counter === 5) {
    return true
  } else {
    return false
  }
}

// Count instances of cards in order to find hands that contain multiples (e.g pairs, three-of-a-kinds)
function handParser(hand) {
  var handCounter = {};
  hand.forEach(function(element){
    var card = element.name;
    if (!handCounter[card]) {
      handCounter[card] = 1;
    } else {
      handCounter[card]++
    }
  })
  return handCounter
}

function ranker(counterObject) {
  var ranks = {
    pair      : [],
    triple    : [],
    quadruple : []
  }
  for (var key in counterObject) {
    var count = counterObject[key]
    var card = key
    var countObject = {}
    if (count === 2) {
      ranks.pair.push(card);
    }
    if (count === 3) {
      ranks.triple.push(card);
    }
    if (count === 4) {
      ranks.quadruple.push(card);
    }
  }
  return ranks;
}

// Takes the counter data and provides the output
// strings that the program requires including the
// cards that make up the scoring hand
function rankStringifier(hand) {
  var handCounter = handParser(hand)
  var ranks = ranker(handCounter)
  if (ranks.pair.length > 0) {
    if (ranks.pair.length === 1) {
      if (ranks.triple.length > 0) {
        return "Full House, " +
               ranks.pair[0] + "s and " +
               ranks.triple[0] + "s"
      } else {
        return "Pair, " + ranks.pair[0] + "s"
      }
    }
    if (ranks.pair.length === 2) {
      return "Two Pair, " +
             ranks.pair[0] + "s and " +
             ranks.pair[1] + "s"
    }
  }else if (ranks.triple.length > 0 && ranks.pair.length === 0) {
    return "Three of a Kind, " +
           ranks.triple[0] + "s"
  }else if (ranks.quadruple.length) {
    return "Four of a Kind, " +
           ranks.quadruple[0] + "s"
  } else {
    return false
  }
}

// This finds the highest card in the hand for the
// purpose of providing a high card string output
// should the user not have any formal poker hands
function highCardFinder(hand) {
  var highCard = "";
  hand.forEach(function(element){
    if (!highCard) {
      highCard = element;
    } else if (element.value > highCard.value) {
      highCard = element;
    }
  })
  return highCard.name
}

// Export the main function for testing
module.exports = {
  handParser: pokerRanker
}
