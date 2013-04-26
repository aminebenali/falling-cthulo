/*
Controller Aircraft By Accelerometer For Free Fly:
	This script is used for using ControllerAccelerometer script in order to control your aircraft in free fly scenes.
	
	You may skip or delete this script.
	
*/


private var controllerAccelerometer : ControllerAccelerometer;
public var transformToControl : Transform;
private var rigidBodyToControl : Rigidbody;
public var velocityOfRigidBody : float = 10; //default speed is 10m/second
public var sensitivtyRigidBodyRotation : Vector3 = Vector3.one;

public var isControlRealistic : boolean = true;
public var limitAngles : Vector3; //Limits is used for Non-realistic control. 

public var isShownDebugLogOnScreen : boolean = true;
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
}

function Update(){
	
}

private var anglePrevious : Vector3 = Vector3.zero;
private var isHeadingUp : boolean = false;
private var isHeadingDown : boolean = false;
private var angleTransformCurrent : Vector3;
private var angleTranformXAfterRotation : float;

function FixedUpdate(){
	if(transformToControl && rigidBodyToControl && controllerAccelerometer && controllerAccelerometer.calibrationStatus == CalibrationStatus.Calibrated){
		if(isControlRealistic){
			transformToControl.Rotate(Vector3(sensitivtyRigidBodyRotation.x * controllerAccelerometer.outputAngle.x, sensitivtyRigidBodyRotation.y * controllerAccelerometer.outputAngle.y, sensitivtyRigidBodyRotation.z * controllerAccelerometer.outputAngle.z));
			rigidBodyToControl.velocity = transformToControl.forward * velocityOfRigidBody;
		}
		else{
			isHeadingUp = (controllerAccelerometer.outputAngle.x - anglePrevious.x) > 0.0 ? true: false;
			isHeadingDown = (controllerAccelerometer.outputAngle.x - anglePrevious.x) < -0.0 ? true: false;
			angleTransformCurrent = transformToControl.localEulerAngles;
			
			angleTranformXAfterRotation = sensitivtyRigidBodyRotation.x * controllerAccelerometer.outputAngle.x;
			
			if(angleTranformXAfterRotation < limitAngles.x && angleTranformXAfterRotation > -limitAngles.x) {
				transformToControl.localEulerAngles.x = angleTranformXAfterRotation;
				//Debug.Log("INSIDE LIMIT" + controllerAccelerometer.outputAngle.x + "  local " + angleTransformCurrent + " Angle " + angleTranformXAfterRotation);
			}
			else if (angleTranformXAfterRotation > limitAngles.x && angleTranformXAfterRotation< 180){
				transformToControl.localEulerAngles.x = limitAngles.x;
				//Debug.Log("OUTOF LIMIT1" + controllerAccelerometer.outputAngle.x + "  local " + angleTransformCurrent + " Angle " + angleTranformXAfterRotation);
			}
			else if (angleTranformXAfterRotation < - limitAngles.x && angleTranformXAfterRotation> -180){
				transformToControl.localEulerAngles.x = 360 - limitAngles.x;
				//Debug.Log("OUTOF LIMIT2" + controllerAccelerometer.outputAngle.x + "  local " + angleTransformCurrent + " Angle " + angleTranformXAfterRotation);
			}
			else{
				Debug.LogError("ERROR - limit is calculated in a wrong way" );
				//do nothing
			}
			
			transformToControl.Rotate(Vector3(0, sensitivtyRigidBodyRotation.y * controllerAccelerometer.outputAngle.y,0),  Space.World);
			transformToControl.localEulerAngles.z =  sensitivtyRigidBodyRotation.z * controllerAccelerometer.outputAngle.z;
			
			rigidBodyToControl.velocity = transformToControl.forward * velocityOfRigidBody;
			
			anglePrevious = controllerAccelerometer.outputAngle;
		}
	}
}


//For Debug Purpose we will show the angle and rotation values
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


