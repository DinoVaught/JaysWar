var deck = [];
var srcDeck = [];
var playerOneDeck = [];
var playerTwoDeck = [];
var playerOneDiscard = [];
var playerTwoDiscard = [];
var gameContinues = true;
var warFlag = false;

["C", "D", "H", "S"].forEach(function(suit){
	for(var cardValue = 2;cardValue < 15;cardValue++)
	{
		deck.push(
			{
				"suit": suit,
				"value": cardValue
			}
		);
	}
});

deck.forEach(function(eachCard, eachIndex){
	srcDeck.push(eachIndex);
});

srcDeck = shuffle(srcDeck);
playerOneDeck = srcDeck.slice(0, 26);
playerTwoDeck = srcDeck.slice(26, 52);

while(gameContinues)
{
	let result = handleConflict();
	console.log(`kitty: ${result.kitty}`);
	result.kitty.forEach(function(card){
		result.victor.push(card);
	});
}

console.log("FINAL SCORE");
console.log("--- Player One score: " + (playerOneDeck.length + playerOneDiscard.length));
console.log("--- Player Two score: " + (playerTwoDeck.length + playerTwoDiscard.length));

function shuffle(unshDeck)
{
	console.log("- shuffling. . .");
	if((playerOneDeck.length + playerTwoDeck.length != 0) && !warFlag)
	{
		console.log("- time for an update!");
		console.log("--- Player One score: " + (playerOneDeck.length + playerOneDiscard.length));
		console.log("--- Player Two score: " + (playerTwoDeck.length + playerTwoDiscard.length));
	}
	var shDeck = [];
	while(unshDeck.length > 0)
	{
		var currentCardIndex = Math.floor(Math.random() * unshDeck.length);
		shDeck.push(unshDeck[currentCardIndex]);
		unshDeck.splice(currentCardIndex, 1);
	}
	return shDeck;
}

function handleConflict()
{
	if(playerOneDeck.length == 0)
	{
		if(playerOneDiscard.length == 0)
		{
			gameContinues = false;
			return {
				"victor":playerTwoDiscard,
				"kitty":[]
			};
		}
		else
		{
			playerOneDeck = shuffle(playerOneDiscard);
			playerOneDiscard = [];
		}
	}
	
	if(playerTwoDeck.length == 0)
	{
		if(playerTwoDiscard.length == 0)
		{
			gameContinues = false;
			return {
				"victor":playerOneDiscard,
				"kitty":[]
			};
		}
		else
		{
			playerTwoDeck = shuffle(playerTwoDiscard);
			playerTwoDiscard = [];
		}
	}
	
	let playerOneCard = playerOneDeck.shift();
	let playerTwoCard = playerTwoDeck.shift();
	let kitty = [playerOneCard, playerTwoCard];
	let comparison = deck[playerOneCard].value - deck[playerTwoCard].value;
	console.log(`${deck[playerOneCard].suit}${deck[playerOneCard].value} -- ${deck[playerTwoCard].suit}${deck[playerTwoCard].value}`);
	if(comparison != 0)
	{
		return {
			"victor": (comparison > 0)?playerOneDiscard:playerTwoDiscard,
			"kitty": kitty
		}
	}
	else
	{
		console.log("!!! WAR !!!");
		console.log("!!! Adding cards to kitty !!!");
		warFlag = true;
		for(let playerOneKittyCounter = 0;playerOneKittyCounter < 3;playerOneKittyCounter++)
		{
			if(playerOneDeck.length == 0)
			{
				if(playerOneDiscard.length == 0)
				{
					gameContinues = false;
					return {
						"victor":playerTwoDiscard,
						"kitty":kitty
					};
				}
				else
				{
					playerOneDeck = shuffle(playerOneDiscard);
					playerOneDiscard = [];
				}
			}
			else
			{
				kitty.push(playerOneDeck.shift());
			}
		}
		
		for(let playerTwoKittyCounter = 0;playerTwoKittyCounter < 3;playerTwoKittyCounter++)
		{
			if(playerTwoDeck.length == 0)
			{
				if(playerTwoDiscard.length == 0)
				{
					gameContinues = false;
					return {
						"victor":playerOneDiscard,
						"kitty":kitty
					};
				}
				else
				{
					playerTwoDeck = shuffle(playerTwoDiscard);
					playerTwoDiscard = [];
					kitty.push(playerTwoDeck.shift());
				}
			}
			else
			{
				kitty.push(playerTwoDeck.shift());
			}
		}
		
		let result = handleConflict();
		warFlag = false;
		return {
			"victor": result.victor,
			"kitty": kitty.concat(result.kitty)
		}
	}
}