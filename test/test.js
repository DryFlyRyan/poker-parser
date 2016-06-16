var chai = require('chai');
var should = chai.should();
var expect = chai.expect;
var poker = require('../app.js')
var handParser = poker.handParser;
var stringifier = require('../cardStringifierEN.js');

describe('Poker Program', function(){
  describe('Poker Hand Parser', function() {
    describe('Should check to see if there are five cards inputted', function(){
      it('should throw an error if too few cards are added', function(){
        expect(function() {handParser('4s 5c 9s ks')})
        .to.throw('Please add more cards!')
      })
      it('should throw an error if too many cards are added', function(){
        expect(function() {handParser('4s 5c 9s ks qs 9d')})
        .to.throw('Please only submit five cards!')
      })
    })
    describe('Should check to see if the cards input fit the required format', function(){
      it('should throw an error if the cards are added in the wrong format', function(){
        expect(function(){handParser('44s 5c 3s 9c ah')})
        .to.throw('Please input cards in a string or array format /n with the card in position 0 and the suit in position 1. Example: Ace of Spades = AS')
      })
    })
    describe("Should take both string and array representations of a poker hand", function(){
      it('takes a string representation of a poker hand and returns its rank', function() {
        expect(handParser('9c Ad 3s 2d Ah'))
        .to.equal('Pair, Aces');
      })
      it('takes an array representation of a poker hand and returns its rank', function() {
        expect(handParser(["3s", "3c", "3h", "9s", "9h"]))
        .to.equal("Full House, 9s and 3s")
      })
    })
    describe("Should return all legitimate poker hands", function(){
      it('returns "Pair" when presented with a pair', function(){
        expect(handParser("3s 3c 4s 8d ah"))
        .to.equal('Pair, 3s')
      })
      it('returns "Two Pair" when presented with two pairs', function(){
        expect(handParser("5s 5c 9s 9c qh"))
        .to.equal('Two Pair, 5s and 9s')
      })
      it('returns "Three of a Kind" when presented with three of a kind', function(){
        expect(handParser("5s 5c 5d 9h qd"))
        .to.equal('Three of a Kind, 5s')
      })

      it('returns "Full House" when presented with a full house', function(){
        expect(handParser("4s 4c 4d 9s 9d"))
        .to.equal('Full House, 9s and 4s')
      })
      it('returns "Straight" when presented with a straight', function(){
        expect(handParser("3s 4c 5d 6d 7s"))
        .to.equal("Straight, 3 through 7")
      })
      it('returns "Flush" when presented with a flush', function(){
        expect(handParser("3c 7c qc ac 2c"))
        .to.equal("Flush")
      })
      it('returns "Four of a Kind" when presented with four of a kind', function(){
        expect(handParser("3h 3d 3c 3s qd"))
        .to.equal('Four of a Kind, 3s')
      })
      it('returns "Straight Flush" when presented with a straight flush', function(){
        expect(handParser("4h 5h 6h 7h 8h"))
        .to.equal("Straight Flush, 4 through 8")
      })
      it('returns "Royal Flush" when presented with a royal flush', function(){
        expect(handParser("10h jh qh kh ah"))
        .to.equal("Royal Flush")
      })
      it('returns the high card if there are no other legitimate hand', function(){
        expect(handParser("3d 9s 10c qs ah"))
        .to.equal("Ace high")
      })
    })
    describe('Should return the cards involved in the hand, e.g. Pair, Aces', function(){
      it('returns "Pair, Aces" when presented with a pair of aces', function(){
        expect(handParser("ac 9s 4h 8c ah"))
        .to.equal("Pair, Aces")
      })
    })
  })

  describe('Poker Hand Stringifier', function(){
    describe('should return the hand and the composing cards', function(){
      it('returns "Pair, Aces" when presented with this hand', function(){
        expect(stringifier.pair('Ace'))
        .to.equal("Pair, Aces")
      })
      it('returns "Two Pair, Aces and 8s" when presented with this hand', function(){
        expect(stringifier.twoPair('Ace', '8'))
        .to.equal("Two Pair, Aces and 8s")
      })
      it('returns "Three of a Kind, 9s" when presented with this hand', function(){
        expect(stringifier.threeOfAKind('9'))
        .to.equal("Three of a Kind, 9s")
      })
    })
  })
})
