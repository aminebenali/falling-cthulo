//================================================================================
// FPV_JoystickRight
//================================================================================
//
// Contact info: MouseSoftware@GMail.com
//
// Controls the right joystick button, e.g. adding extra rotation ('turning')
// Note: 	attach this script to the same gameobject that holds the 
//			FPV_GyroAccelScript, because it sends a message to this script 
//			which calls the method 'AddYawOffsetToGyroscope'
//
// Public variables:
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
//================================================================================

#pragma strict

// public variables
var joystickTexture : Texture;
var joystickBackgroundTexture : Texture;
var joystickRelSize : float = 0.04;
var joystickRelativeTouchArea : Rect = Rect(0.7,0.7,0.3,0.25);
var joystickRelDeadZone : float = 0.01;
var joystickRelMaxRadius : float = 0.05;

// private variables
private var maxTurnSpeed : float = 90;
private var touchArea : Rect;
private var joystickEnabled = false;
private var joystickCentre : Vector2;
private var joystickTouchID : int;
private var joystickRect : Rect;
private var joystickBackgroundRect : Rect;
private	var sw : int; // sw = Screen.Width
private	var sh : int; // sw = Screen.Height 

//////////////////////////////////////////////////

function OnGUI() {
	if (joystickEnabled && joystickBackgroundTexture) {
		joystickBackgroundRect.width = 2*(joystickRelDeadZone+joystickRelMaxRadius+joystickRelSize*0.5)*sw;
		joystickBackgroundRect.height = joystickRelSize*sw;
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
	UpdateRightJoystick();
}

//////////////////////////////////////////////////

function UpdateRightJoystick() {
	sw = Screen.width;
	sh = Screen.height;
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
			joystickRect.center.x = joystickCentre.x + joyDir.x;
			joystickRect.center.y = joystickCentre.y;
			joystickBackgroundRect.center = joystickCentre;
			gameObject.SendMessage('AddYawOffsetToGyroscope',d.x * maxTurnSpeed * Time.deltaTime);
		}
	}
}