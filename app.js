var errorLogger     = require('./errorEN');
var cardStringifier = require('./cardStringifierEN')
// Primary function
function pokerRanker(hand) {

  if (typeof hand === 'string') {
    hand = hand.toLowerCase().split(" ");
  }

  formatVerifier(hand);

  var deck = deckCreator();
  hand = handFormatter(hand, deck);

  return rankStringifier(hand) || irregularFinder(hand) || findHighestCardName(hand) + ' high';

}
// return irregularHand || rank || highCard

// Hand Verification functions to determine
// correct hand length and input format

function formatVerifier(hand) {
  if (handLengthVerifier(hand) && inputVerifier(hand)) {
    return true
  }
  return false;
}

function handLengthVerifier(hand){

  if (hand.length === 5){
    return true;
  } else if (hand.length < 5){
    throw new Error(errorLogger.lessThanFiveCards);
  } else if (hand.length > 5){
    throw new Error(errorLogger.moreThanFiveCards);
  } else {
  }

}

function inputVerifier(hand){

  for (var counter = 0; counter < hand.length; counter++) {
    if (hand[counter].length !== 2 && hand[counter].substr(0,2) !== "10") {
      throw new Error(errorLogger.wrongFormat);
    }
  }
  return true;
}

// Create a standard deck without suits in order to
// later format the input with all needed
// information
function deckCreator() {

  var deck = {
    a: {
      value: 14,
      name: "Ace"
    },
    k: {
      value: 13,
      name: "King"
    },
    q: {
      value: 12,
      name: "Queen"
    },
    j: {
      value: 11,
      name: "Jack"
    }
  };

  var counter = 10;
  while (counter > 1) {
    deck[counter.toString()] = {
      name: counter.toString(),
      value: counter
    };
    counter--;
  }

  return deck;

}

// Format the user inputted hand to match the deck
// format
function handFormatter(hand, deck) {

  var formattedHand = {};

  hand.forEach(function(handElement) {

    var card, suit;

    if (handElement.length === 3 && handElement.substr(0,2) === "10") {
      card = handElement.substr(0,2);
      suit = handElement.substr(2,1);
    } else {
      card = handElement.substr(0,1);
      suit = handElement.substr(1,1);
    }

    if (!formattedHand[card]) {
      formattedHand[card] = deck[card];
      formattedHand[card].count = 1;
      formattedHand[card].suits = [suit];
    } else if (formattedHand[card]) {
      formattedHand[card].count++;
      if (formattedHand[card].suits.find(function(){
        return formattedHand[card].suits === suit
      })) {
        throw new Error(errorLogger.duplicateCard)
      }
      formattedHand[card].suits.push(suit)
    }

  });
  return formattedHand;
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
        return cardStringifier.straightFlush(findLowestCardName(hand), findHighestCardName(hand))

      }
    } else {
      return cardStringifier.straight(findLowestCardName(hand), findHighestCardName(hand))

    }
  } else if (flushFinder(hand)) {
    return cardStringifier.flush();
  }
}

function findLowestCardName(hand) {
  var lowestCard;
  for (var card in hand) {
    if (!lowestCard || hand[card].value < lowestCard.value) {
      lowestCard = hand[card];
    }
  }
  return lowestCard.name;
}

function findHighestCardName(hand) {
  var highestCard;
  for (var card in hand) {
    if (!highestCard || hand[card].value > highestCard.value ) {
      highestCard = hand[card];
    }
  }
  return highestCard.name;
}

// This searches for hands that contain only cards
// above 9 for Royal Flush detection
function royalFinder(hand) {

  for (var card in hand) {
    if (hand[card].value < 10) {
      return false;
    }
  }
  return true;
}

function straightFinder(hand) {
  var straightArray = [];

  for (var card in hand) {
    straightArray.push(hand[card].value);
  }

  straightArray.sort(function(a, b){
    return a - b;
  });

  for (var counter = 0; counter < straightArray.length - 1; counter++) {

    if (straightArray[counter] + 1 !== straightArray[counter + 1]) {

      return false;

    }
  }

  return true;

}

function flushFinder(hand) {
  var suit;
  for (var card in hand) {
    if (!suit) {
      suit = hand[card].suits[0];
    }
    if (hand[card].count > 1 || hand[card].suits[0] !== suit) {
      return false;
    }
  }
  return true;
}

// Takes the counter data and provides the output
// strings that the program requires including the
// cards that make up the scoring hand
function rankStringifier(hand) {
  var scoringHand = [];
  for (var card in hand) {
    if (hand[card].count > 1) {
      scoringHand.push(hand[card])
    }
  }
  if (scoringHand.length < 2 && scoringHand.length) {
    if (scoringHand[0].count === 2) {
      return cardStringifier.pair(scoringHand[0].name);
    } else if (scoringHand[0].count === 3) {
      return cardStringifier.threeOfAKind(scoringHand[0].name);
    } else if (scoringHand[0].count === 4) {
      return cardStringifier.fourOfAKind(scoringHand[0].name);
    }
  } else if (scoringHand.length === 2) {
    if (scoringHand[0].count === 2 &&
        scoringHand[1].count === 2) {
        var newHand = {}
        newHand[scoringHand[0].name] = scoringHand[0];
        newHand[scoringHand[1].name] = scoringHand[1];
       return cardStringifier.twoPair(findLowestCardName(newHand), findHighestCardName(newHand))
    }
    var pair, triple;
    scoringHand.forEach(function(card) {
      if (card.count === 2) {
        pair = card;
      } else if (card.count === 3) {
        triple = card;
      }
    })
    return cardStringifier.fullHouse(pair.name, triple.name);
  }
  return false;
}

// This finds the highest card in the hand for the
// purpose of providing a high card string output
// should the user not have any formal poker hands

// Export the main function for testing
module.exports = {
  handParser: pokerRanker
};
