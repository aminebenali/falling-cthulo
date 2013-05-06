//================================================================================
// FPV_TouchDragRotation
//================================================================================
//
// Every touch that occurs within the Rect defined by 'touchSensitiveRectRel'
// results in a change of pitch/yaw of the camera, e.g. you can drag your finger
// across the screen to rotate the camera up/down/left/right.
//
// Note: this script must be addes to the same GameObject that contains the 
// 'FPV_GyroAccelScript' component.
//
// public variables:
//
// * 'touchSensitiveRectRel' (Rect)
//		Only track touch movements within this Rect. The Rect is defined by relative 
//		screen coordinates, e.g.:
//			Rect(0,0,1,1) --> Use the entire screen
//			Rect(0,0,1,0.5) --> Use the top half of the screen
//			etc.
//
//================================================================================

#pragma strict

var touchSensitiveRectRel : Rect = Rect(0.0,0.0,1.0,0.6); 
private var cam : Camera;

function Start () {
	cam = gameObject.GetComponent(Camera);
}

function Update () {
	var sw : int = Screen.width;
	var sh : int = Screen.height;
	var touchSensitiveRect : Rect;
	touchSensitiveRect.x = touchSensitiveRectRel.x * sw;
	touchSensitiveRect.y = touchSensitiveRectRel.y * sh;
	touchSensitiveRect.width = touchSensitiveRectRel.width * sw;
	touchSensitiveRect.height = touchSensitiveRectRel.height * sh;
	var screenTouchPoint : Vector2;

	for (var touch : Touch in Input.touches) {
		screenTouchPoint.x = touch.position.x;
		screenTouchPoint.y = sh - touch.position.y;
		if (touchSensitiveRect.Contains(screenTouchPoint)) {
			gameObject.SendMessage('AddYawOffsetToGyroscope',-cam.fieldOfView * touch.deltaPosition.x / sw);
			gameObject.SendMessage('AddPitchOffsetToGyroscope',cam.fieldOfView * touch.deltaPosition.y / sh);
		}
	}
}