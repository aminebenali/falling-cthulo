//================================================================================
// GUI_ScreenOrientation
//================================================================================
//
// Display "ScreenOrientation" menu button at the upper right part of the screen,
// allowing to change the screen orientation on a handheld device
//
//================================================================================

#pragma strict

private var orientationMenuEnabled : boolean = false;

//================================================================================

function OnGUI () {
	var w : int = Screen.width;
	var h : int = Screen.height;
	var nb : float = 4; 	// number of buttons to display;
	var bn : float = 0; 	// current button number (from left to right; bn=0 for first button)
	var bw : float = w/nb; 	// button width
	var bh : float = 40; 	// button heigth
	var bd : float = 5; 	// button distance to edge

	// MENU: ScreenSettings
	bn = 3;
	var currentDeviceOrientation : String;
	if (SystemInfo.deviceType == DeviceType.Handheld) {
		currentDeviceOrientation = "("+Screen.orientation+")";
	} else {
		currentDeviceOrientation = "";
	}

	if (GUI.Button(Rect(bn*bw+bd,0+bd,bw-2*bd,bh), "Device Orientation = \n" + currentDeviceOrientation)) {
		orientationMenuEnabled = !orientationMenuEnabled;
	}
	if (orientationMenuEnabled) {
		if (SystemInfo.deviceType == DeviceType.Handheld) {
       		if (GUI.Button(Rect(bn*bw+bd,1*bh+2*bd,bw-2*bd,bh), "Portrait Up")) {
       			Screen.orientation = ScreenOrientation.Portrait;	
       			orientationMenuEnabled = false;
       		}
       		if (GUI.Button(Rect(bn*bw+bd,2*bh+3*bd,bw-2*bd,bh), "Portrait Down")) {
       			Screen.orientation = ScreenOrientation.PortraitUpsideDown;
       			orientationMenuEnabled = false;
       		}	
       		if (GUI.Button(Rect(bn*bw+bd,3*bh+4*bd,bw-2*bd,bh), "Landscape Left")) {
       			Screen.orientation = ScreenOrientation.LandscapeLeft;	
       			orientationMenuEnabled = false;
       		}
       		if (GUI.Button(Rect(bn*bw+bd,4*bh+5*bd,bw-2*bd,bh), "Landscape Right")) {
       			Screen.orientation = ScreenOrientation.LandscapeRight;	
       			orientationMenuEnabled = false;
       		}
		}
	}
}

//================================================================================
