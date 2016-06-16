module.exports = {
  pair: function(pairCards) {
    return "Pair, " + pairCards + "s";
  },
  twoPair: function(pairOne, pairTwo) {
    return "Two Pair, " +
      pairOne + "s and " +
      pairTwo + "s";
  },
  threeOfAKind: function(triple) {
    return "Three of a Kind, " +
           triple + "s";
  },
  fourOfAKind: function(quadruple) {
    return "Four of a Kind, " +
           quadruple + "s";
  },
  straight: function(startCard, endCard) {
    return "Straight, " +
           startCard + " through " +
           endCard;
  },
  flush: function() {
    return "Flush";
  },
  fullHouse: function(pair, triple) {
    return "Full House, " + pair + "s and " + triple + "s";
  },
  straightFlush: function(startCard, endCard) {
    return "Straight Flush, " +
           startCard + " through " +
           endCard;
  },
  royalFlush: function() {
    return "Royal Flush";
  }
};
