/*
Controller Ball By Accelerometer:
	This script is used for using ControllerAccelerometer script in order to control your ball with calibration on the fly.
*/


private var controllerAccelerometer : ControllerAccelerometer;
public var transformToControl : Transform;
public var isAvailableForControl : boolean = true;
private var rigidBodyToControl : Rigidbody;

public var forceAngularToRigidBody : float = 0.1;

public var lightGreen : GameObject; //They slow down the performance heavily in iPAD1 !!
public var lightBlue : GameObject;

var isShownDebugLogOnScreen : boolean = true;
public var skinSmallScreen : GUISkin;
public var skinBigScreen : GUISkin;
private var isBigScreen : boolean = false;


function Start(){
	controllerAccelerometer = transform.GetComponentInChildren(ControllerAccelerometer);
	
	if(!controllerAccelerometer){
		Debug.LogError("Error - No ControllerAccelerometer script is found");
	}
	
	if(transformToControl){
		rigidBodyToControl = transformToControl.rigidbody;
		if(!rigidBodyToControl){
			Debug.LogError("Error - No Ridigbody is found");
		}
	}
	else{
		Debug.LogError("Error - No Transform is found");
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
	if(transformToControl && rigidBodyToControl && controllerAccelerometer && controllerAccelerometer.calibrationStatus == CalibrationStatus.Calibrated && isAvailableForControl){
		rigidBodyToControl.AddForce(Vector3( -1 * controllerAccelerometer.outputAngle.z, controllerAccelerometer.outputAngle.y, controllerAccelerometer.outputAngle.x) * forceAngularToRigidBody);
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

