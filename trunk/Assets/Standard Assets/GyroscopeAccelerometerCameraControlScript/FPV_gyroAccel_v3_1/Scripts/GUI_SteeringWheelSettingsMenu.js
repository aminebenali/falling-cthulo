//================================================================================
// GUI_SteeringWheelSettingsMenu
//================================================================================
//
// Display "SteeringWheelEffect" menu button at the upper left part of the screen
//
// public variables:
// 
// * 'playerCam' (GameObject)
//		The GameObject that contains the 'FPV_GyroAccelScript' component.
//
//================================================================================

#pragma strict

var playerCam : GameObject;
private var SWeffect : boolean = false;

function Start () {
	if (SWeffect) {
		playerCam.SendMessage("SetSteeringWheelEffect",true);
	} else {
		playerCam.SendMessage("SetSteeringWheelEffect",false);
	}	
		
}

function OnGUI () {
	var w : int = Screen.width;
	var h : int = Screen.height;
	var nb : float = 4; 	// number of buttons to display;
	var bn : float = 0; 	// current button number (from left to right; bn=0 for first button)
	var bw : float = w/nb; 	// button width
	var bh : float = 40; 	// button heigth
	var bd : float = 5; 	// button distance to edge

	bn = 0;
	if (GUI.Button(Rect(bn*bw+bd,0+bd,bw-2*bd,bh), "Steering Wheel Effect = \n" + SWeffect)) {
		SWeffect = !SWeffect;
		if (SWeffect) {
			playerCam.SendMessage("SetSteeringWheelEffect",true);
		} else {
			playerCam.SendMessage("SetSteeringWheelEffect",false);
		}	
	}

}