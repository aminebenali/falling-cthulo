/*
Aircraft Animation Controller :
	This Script is control the animation attached to the aircrafts. 
	The rotors of the aircrafts are playing continuously.
	Here, in this Game: Aircraft 2 and Aircraft 3 has rotors.
*/

var aircraftNumber : int = 0;

var blendTargetWeight : float = 0.5;
var blendFadeLength : float = 0.5;
var speedRotor : float  = 1;

function Awake () {
	if(aircraftNumber==2){
		animation["SelectAC2_Rotor"].wrapMode = WrapMode.Loop;
  		animation["SelectAC2_Rotor"].speed = speedRotor;
  		animation["SelectAC2_Rotor"].layer = 1;
		animation.Blend("SelectAC2_Rotor", blendTargetWeight, blendFadeLength);
	}
	else if(aircraftNumber==3){
		animation["SelectAC3_Rotor"].wrapMode = WrapMode.Loop;
  		animation["SelectAC3_Rotor"].speed = speedRotor;
  		animation["SelectAC3_Rotor"].layer = 1;
		animation.Blend("SelectAC3_Rotor", blendTargetWeight, blendFadeLength);
	}
}