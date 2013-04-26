/*
Controller Labyrinth By Accelerometer:
	This script is used for using ControllerAccelerometer script in order to control your Labyrinth with calibration on the fly.
*/


private var controllerAccelerometer : ControllerAccelerometer;
public var transformToControl : Transform;
public var gravity : Vector3 = Vector3(0, -20, 0);

public var lightGreen : GameObject; //They slow down the performance heavily in iPAD1 !!
public var lightBlue : GameObject;

var isShownDebugLogOnScreen : boolean = true;
public var skinSmallScreen : GUISkin;
public var skinBigScreen : GUISkin;
private var isBigScreen : boolean = false;

function Start(){
	controllerAccelerometer = transform.GetComponentInChildren(ControllerAccelerometer);
	Physics.gravity = gravity;
	
	if(!controllerAccelerometer){
		Debug.LogError("Error - No ControllerAccelerometer script is found");
	}
	
	isBigScreen = (Screen.width > 500)?true:false;
	
	#if UNITY_IPHONE
	if(iPhone.generation == iPhoneGeneration.iPad1Gen){
		lightGreen.active = false;
		lightBlue.active = false;
	}
	#endif
}

function Update(){
	if(transformToControl && controllerAccelerometer && controllerAccelerometer.calibrationStatus == CalibrationStatus.Calibrated){
		//For Labyrinth, we are just changing the rotation of it, nothing more 
		transformToControl.localRotation.eulerAngles = controllerAccelerometer.outputAngle ;
	}
}


function OnGUI(){
	if(isShownDebugLogOnScreen){
		GUI.skin = isBigScreen?skinBigScreen:skinSmallScreen; //GUI skin is changed for bigger screen!
		
		GUI.Label(Rect (Screen.width  * 0.08, Screen.height  * 0.02, Screen.width  * 0.42, Screen.height  * 0.1), "Orientation: "+ Screen.orientation, GUI.skin.GetStyle("Debug"));
		GUI.Label(Rect (Screen.width  * 0.5, Screen.height  * 0.02, Screen.width  * 0.42, Screen.height  * 0.1), "Angles: "+ controllerAccelerometer.outputAngle, GUI.skin.GetStyle("Debug"));
	}
}


//GUI may call ExitToMainMenu or Calibrate Function !!!
function ExitToMainMenu(){
	Application.LoadLevel("0 MainScene");
}

