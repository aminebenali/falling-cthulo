/*
Controller Animation Coin Bonus:
	This simple script is attached each bonus objects and coins in the game to show their animation in a endless loop. 
	The animation attached to them is named as "C4D Animation Take" which is the general name of Cinema4D animations. 
	We did not renamed it to show the real work behind it.

*/

var animationWrapMode  : WrapMode = WrapMode.Loop;

function Awake () {
	animation.wrapMode = animationWrapMode;
	animation.Play("C4D Animation Take");
	//enabled = false;
}

