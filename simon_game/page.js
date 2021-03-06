$(document).ready(function() {

	$("#power-button").on('click', function(){
		var styleButton = $(this).children('.style-button');
		if(styleButton.hasClass('turn-on')) {
			turnOnGame(styleButton);
		} else if(styleButton.hasClass('turn-off')) {			
			turnOffGame(styleButton);
		}
	});


	$('.start-box').on('click', function(){
		initGame();
	});

	$('.strict-box').on('click', function(){
		if($('.led-box').hasClass('off')) {			
			$('.led-box').removeClass('off');
			$('.led-box').addClass('on');
		} else if($('.led-box').hasClass('on')) {			
			$('.led-box').removeClass('on');
			$('.led-box').addClass('off');
		}
	});
	
	$('.red').on('click', function(){
		playerTurn(this, 1);
	});

	$('.green').on('click', function() {
		playerTurn(this, 2);		
	});

	$('.yellow').on('click', function() {
		playerTurn(this, 3);		
	});

	$('.blue').on('click', function() {
		playerTurn(this, 4);		
	});
	
	var randomPlays = [];
	var playerTurns = [];
	var timers = [];
	var songInterval = 1000;
	var gameElements = {'.red': 1, '.green': 2, '.yellow': 3, '.blue': 4};	

	function turnOnGame(styleButton) {
		styleButton.removeClass('turn-on');
		styleButton.addClass('turn-off');						
		$('.start-box').removeClass('unclickable');
		$('.start-box').addClass('clickable');
		$('.count-box').removeClass('unclickable');
		$('.count-box').addClass('clickable');		
		$('.strict-box').removeClass('unclickable');
		$('.strict-box').addClass('clickable');		
		$("#count-input").text('--');
	}

	function turnOffGame(styleButton){
		randomPlays = [];
		playerTurns = [];
		styleButton.removeClass('turn-off');
		styleButton.addClass('turn-on');			
		$('.start-box').removeClass('clickable');
		$('.start-box').addClass('unclickable');
		$('.count-box').removeClass('clickable');
		$('.count-box').addClass('unclickable');
		$('.strict-box').removeClass('clickable');
		$('.strict-box').addClass('unclickable');		
		$("#count-input").text('');		
		$('.wrap-options').removeClass('clickable');
		$('.wrap-options').addClass('unclickable');
		$('.led-box').removeClass('on');
		$('.led-box').addClass('off');
	}
	
	function initGame(){
		randomPlays = [];
		playerTurns = [];
		clearTimers();			
		songInterval = 1000;
		addRandomComputerTurn();	
		computerTurn();		
	}

	function addRandomComputerTurn() {
		var gameElementsKeys = Object.keys(gameElements);		
		randomPlays.push(gameElementsKeys[Math.floor(Math.random() * gameElementsKeys.length)]);
		$("#count-input").text(randomPlays.length);
		console.log(randomPlays);
	}

	function computerTurn(){
		increaseGameSpeed();
		for(var count = 0; count < randomPlays.length; count++) {			
			var randomKey = randomPlays[count];				
			(function(randomKey) {
				timers[count] = setTimeout(function(){flashGameColor(randomKey, gameElements[randomKey])}, songInterval * (count + 1));	
			})(randomKey);			
		}
		$('.wrap-options').removeClass('unclickable');
		$('.wrap-options').addClass('clickable');
	}

	function clearTimers(){
		for(var key in timers) {
			clearTimeout(timers[key]);
		}
		timers = [];
	}

	function increaseGameSpeed() {
		if(randomPlays.length === 5 || randomPlays.length === 9 || randomPlays.length === 13) {
			songInterval = songInterval - 150;
		}
	}

	function playerTurn(clickedElement, soundSequence){
		var clickedColor = '.' + $(clickedElement).attr('class').split(' ')[1];		
		playerTurns.push(clickedColor);		
		
		if (compareSoundEquality() === true) {
			flashGameColor(clickedElement, soundSequence);					
			if(playerTurns.length === randomPlays.length) {					
				addRandomComputerTurn();						
				if(checkVictory() === false) {
					computerTurn();
				}	
				playerTurns = [];	
			}			
		}
		else {
			alert("Wrong choice! Try it again!");			
			if(checkVictory() === false) {
				if($('.led-box').hasClass('off')) {
					computerTurn();	
				} else {
					initGame();
				}				
			}			
			playerTurns = [];			
		}		
	}

	function checkVictory() {		
		if(playerTurns.length === 20) {
			alert("Congratulations! You won the game!");
			initGame();
			return true;
		}
		return false;
	}

	function flashGameColor(element, soundSequence) {		
		$(element).switchClass("normal", "light", 300, "easeInOutQuad");				
		var audio = new Audio('https://s3.amazonaws.com/freecodecamp/simonSound' + soundSequence + '.mp3');
		audio.play();
		$(element).switchClass("light", "normal", 300, "easeInOutQuad");						
	}

	function compareSoundEquality() {			
		var matched = true;
		var playerTurnsString = '';
		var randomPlaysString = '';		

		for(var count = 0; count < playerTurns.length; count++) {
			playerTurnsString += playerTurns[count];
			randomPlaysString += randomPlays[count];			
			if(playerTurns[count] !== randomPlays[count]) {
				matched = false;
				break;
			}
		}
		return matched;		
	}
});