//================================================================================
// FPV_JoystickLeft
//================================================================================
//
// Contact info: MouseSoftware@GMail.com
//
// Controls the left joystick button, e.g. moving left/right/forward/back ('strafing')
//
// Public variables:
//
// * 'characterObject' (GameObject)
//		The GameObject that should be moved. A CharacterController component must be
//		attached to this GameObject.
//		If this variable is left empty, the current gameObject will be used.
//
// * 'joystickTexture' (Texture)
// * 'joystickBackgroundTexture' (Texture)
//		If specified, the joystick will be drawn using the joystickTexture.
//		It's bckground will be drawn using the joystickBackgroundTexture.
//
// * 'joystickRelSize' (float)
//		The maximum size of the joystick button (in relative screen coordinates)
//
// * 'joystickRelativeTouchArea' (Rect)
//		The joystick will only be drawn when a touch occurs within this Rect.
//		The Rect coordinates are relative coordinates, e.g.:
//			Rect(0,0,1,1) --> Use the entire screen
//			Rect(0,0.5,0.5,0.5 --> Use the lower left corner
//			etc.
//
// * 'joystickRelDeadZone' (float)
// 		joystick deadZone (in relative screen coordinates). If the touch is within 
//		this radius from the joystick's center, then no movement will be added
// 
// * 'joystickRelMaxRadius' (float)
//		The maximum radius that the joystick can be moved (in relative screen coordinates)
//
// * 'maxSpeed' (float)
//		The maximum speed of the movement
//
//================================================================================

#pragma strict

// public variables
var characterObject : GameObject;
var joystickTexture : Texture;
var joystickBackgroundTexture : Texture;
var joystickRelSize : float = 0.04;
var joystickRelativeTouchArea : Rect = Rect(0.0,0.7,0.3,0.25);
var joystickRelDeadZone : float = 0.01;
var joystickRelMaxRadius : float = 0.05; 
var maxSpeed : float = 7;

// private variables
private var touchArea : Rect;
private var joystickEnabled = false;
private var joystickCentre : Vector2;
private var joystickTouchID : int;
private var joystickRect : Rect;
private var joystickBackgroundRect : Rect;
private	var sw : int; // sw = Screen.Width
private	var sh : int; // sw = Screen.Height 
private var characterControl : CharacterController;

//////////////////////////////////////////////////

function Start () {
	if (characterObject) {
		characterControl = characterObject.GetComponent(CharacterController);
	} else {
		characterControl = gameObject.GetComponent(CharacterController);
	}	
}

//////////////////////////////////////////////////

function OnGUI() {
	if (joystickEnabled && joystickBackgroundTexture) {
		joystickBackgroundRect.width = 2*(joystickRelDeadZone+joystickRelMaxRadius+joystickRelSize*0.5)*sw;
		joystickBackgroundRect.height = joystickBackgroundRect.width;
		GUI.DrawTexture(joystickBackgroundRect, joystickBackgroundTexture, ScaleMode.StretchToFill, true);
	}
	if (joystickEnabled && joystickTexture) {
		joystickRect.width = joystickRelSize * sw;
		joystickRect.height = joystickRect.width;
		GUI.DrawTexture(joystickRect, joystickTexture, ScaleMode.StretchToFill, true);
	}
}

//////////////////////////////////////////////////

function Update () {
	UpdateLeftJoystick();
}

//////////////////////////////////////////////////

function UpdateLeftJoystick() {
	sw = Screen.width;
	sh = Screen.height;
	// recalculate the touchArea from relative screencoordinates to absolute coordinates
	touchArea.x = joystickRelativeTouchArea.x * sw;
	touchArea.y = joystickRelativeTouchArea.y * sh;
	touchArea.width = joystickRelativeTouchArea.width * sw;
	touchArea.height = joystickRelativeTouchArea.height * sh;
	
	var touchScreenPoint : Vector2; // holds the touch position, in screen coordinates
	var touch : Touch;
	for (touch in Input.touches) {
		touchScreenPoint.x = touch.position.x;
		touchScreenPoint.y = sh - touch.position.y;
		if (touch.phase == TouchPhase.Began && touchArea.Contains(touchScreenPoint) ) {
			joystickEnabled = true;
			joystickTouchID = touch.fingerId;
			joystickCentre = touchScreenPoint;
		}
		if ((touch.phase == TouchPhase.Ended || touch.phase == TouchPhase.Canceled) && touch.fingerId == joystickTouchID) {
			joystickEnabled = false;
		}
		if (joystickEnabled && touch.fingerId == joystickTouchID) {
			var joyDir : Vector2 = touchScreenPoint-joystickCentre;
			var d : Vector2 = Vector2.zero;
			if (joyDir.magnitude > (joystickRelDeadZone+joystickRelMaxRadius)*sw) {
				joyDir = joyDir.normalized * (joystickRelDeadZone+joystickRelMaxRadius)*sw;
			}
			if (joyDir.magnitude > joystickRelDeadZone) {
				d = ((joyDir.magnitude - joystickRelDeadZone*sw)/(joystickRelMaxRadius*sw)) * joyDir.normalized;
			}
			joystickRect.center = joystickCentre + joyDir;
			joystickBackgroundRect.center = joystickCentre;
			var headingDir : Vector3 = (characterObject.transform.right*d.x) - (characterObject.transform.forward*d.y);
			characterControl.SimpleMove(headingDir * maxSpeed);		
		}
	}
}