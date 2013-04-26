/*
Controller Aircraft By Accelerometer:
	This script is used for using ControllerAccelerometer script in order to control aircraft in a tunnel!.
	
	You may skip or delete this script.
	
*/


private var controllerAccelerometer : ControllerAccelerometer;
public var tagAircraftToControl : String;

private var gameObjectAircraftToControl : GameObject;
private var transformAircraftToControl : Transform;
private var rigidBodyToControl : Rigidbody;
public var velocityOfRigidBody : float = 10;

private var initialAngle : Vector3;
private var initialAngleOffset : Vector3 = Vector3.zero;

public var needTurnAction : boolean = false;
var limitMinX : float;
var limitMaxX : float;
var limitMinY : float;
var limitMaxY : float;

//the limitation using for turning in general corridor box
var limitTurningMinX : float; 
var limitTurningMaxX : float;
var limitTurningMinY : float;
var limitTurningMaxY : float;

//the limitation using for turning for exclusind corner squares  
var limitTurningCornerMinX : float; 
var limitTurningCornerMaxX : float;

private var turnedLeft : boolean = false;
private var turnedRight : boolean = false;
private var initialRotation : Quaternion;

var isShownDebugLogOnScreen : boolean = true;
public var skinSmallScreen : GUISkin;
public var skinBigScreen : GUISkin;
private var isBigScreen : boolean = false;

function Start(){
	controllerAccelerometer = transform.GetComponentInChildren(ControllerAccelerometer);
	
	if(controllerAccelerometer){
		gameObjectAircraftToControl = GameObject.FindGameObjectWithTag(tagAircraftToControl);
		if(gameObjectAircraftToControl){
			transformAircraftToControl = gameObjectAircraftToControl.transform;
			if(transformAircraftToControl){
				rigidBodyToControl = transformAircraftToControl.rigidbody;
				if(!rigidBodyToControl){
					Debug.LogError("Error - No Ridigbody is found");
				}
			}
			else{
				Debug.LogError("Error - No Transform is found");
			}
		}
		else{
			Debug.LogError("Error - No GameObject is found");
		}
		
	}
	else{
		Debug.LogError("Error - No ControllerAccelerometer script is found");
	}
	
	
	isBigScreen = (Screen.width > 500)?true:false;
}

private var rotationForAircraft : Vector3;

function Update(){
	if(transformAircraftToControl && rigidBodyToControl && controllerAccelerometer && controllerAccelerometer.calibrationStatus == CalibrationStatus.Calibrated){
		
		rotationForAircraft = controllerAccelerometer.outputAngle ;
		
		// Apply rotation by a smoothness 
		if(turnedRight && ControllerXCode.selectedCamera==CameraOption.Camera2Action){
			rotationForAircraft = Vector3(rotationForAircraft.y,-1 * rotationForAircraft.x,rotationForAircraft.z);
		}
		else if(turnedLeft && ControllerXCode.selectedCamera==CameraOption.Camera2Action){
			rotationForAircraft = Vector3(-1 * rotationForAircraft.y,rotationForAircraft.x,rotationForAircraft.z);
		}
		else{
			//do nothing because the rotation is already calculated
		}
		
		transformAircraftToControl.rotation.eulerAngles = rotationForAircraft ;
		rigidBodyToControl.velocity = transformAircraftToControl.forward * velocityOfRigidBody;
		
		
		if(needTurnAction){
			//if aircraft is in corridor
			if(transformAircraftToControl.position.x > limitTurningMinX && transformAircraftToControl.position.x < limitTurningMaxX && transformAircraftToControl.position.y > limitTurningMinY && transformAircraftToControl.position.y < limitTurningMaxY){
				//if aircraft is outside the boxes
				if( !(transformAircraftToControl.position.x < limitTurningCornerMinX && transformAircraftToControl.position.y > limitTurningMaxY) && 
					!(transformAircraftToControl.position.x > limitTurningCornerMaxX && transformAircraftToControl.position.y > limitTurningMaxY) && 
					!(transformAircraftToControl.position.x < limitTurningCornerMinX && transformAircraftToControl.position.y < limitTurningMinY) && 
					!(transformAircraftToControl.position.x > limitTurningCornerMaxX && transformAircraftToControl.position.y < limitTurningMinY)  ){
						if(turnedLeft){
							transformAircraftToControl.rotation.eulerAngles.z = 90;
						}
						else if(turnedRight){
							transformAircraftToControl.rotation.eulerAngles.z = -90;
						}
						//rotation operation
						else if(transformAircraftToControl.rotation.eulerAngles.z<180){
							transformAircraftToControl.rotation.eulerAngles.z = 90;
							turnedLeft = true;
						}
						else if(transformAircraftToControl.rotation.eulerAngles.z>180){
							transformAircraftToControl.rotation.eulerAngles.z = -90;
							turnedRight = true;
						}
				}
			}
		}
		else{
			turnedLeft = false;
			turnedRight = false;
		}
		
		//check aircraft is inside our corridor box, else make zero at that axis in order no to exceed our limits, and box!
		if(rigidBodyToControl.position.x <= limitMinX && rigidBodyToControl.velocity.x < 0){
			rigidBodyToControl.velocity.x = 0;
		}
		else if(rigidBodyToControl.position.x >= limitMaxX && rigidBodyToControl.velocity.x > 0){
			rigidBodyToControl.velocity.x = 0;
		}
		
		if(rigidBodyToControl.position.y <= limitMinY && rigidBodyToControl.velocity.y < 0){
			rigidBodyToControl.velocity.y = 0;
		}
		else if(rigidBodyToControl.position.y >= limitMaxY && rigidBodyToControl.velocity.y > 0){
			rigidBodyToControl.velocity.y = 0;
		}
		
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

function CalibrateAircraft(){
	if(controllerAccelerometer){
		controllerAccelerometer.Calibrate();
	}
	else{
		Debug.LogError("Error - CalibrateAircraft is not found!");
	}
}


