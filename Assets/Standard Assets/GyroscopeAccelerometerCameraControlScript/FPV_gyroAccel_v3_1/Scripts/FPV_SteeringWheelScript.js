//================================================================================
// FPV_SteeringWheelScript
//================================================================================
//
// Use the rotation around the device z-axis to add an extra rotation around the
// y-axis, by changing the 'yawOffset'-variable in the FPV_GyroAccelScript
// that is attached to the current GameObject.
//
// Public variables:
//
// * 'steeringWheelEnabled' (boolean)
//      User setting to enable/disable the steering wheel.
//
// * 'maxRotationSpeed' (float)
//      The maximum allowed extra rotation around the vertical axis, in degrees 
//      per second.
//
// * 'DeadZoneDegrees' (float) 
//      Only angles larger than this value will be used. Usefull for compensating 
//      small movements, like shaky hands, when holding the device
//
// * 'playerCamera' (Transform)
//      If specified, the rotation of this object will be used, instead of the 
//      current GameObject.
//      IMPORTANT: a "FPV_GyroAccelScript" component must be attached to this Transform!
//
//	** The following functions can be called using SendMessage or BroadcastMessage:
//  * function SetSteeringWheelEffect(on_off : boolean)
//		enables/disables the steering wheel effect.
//
//================================================================================

#pragma strict

//================================================================================

// Public variables
var steeringWheelEnabled : boolean = true;
var maxRotationSpeed : float = 120;
var deadZoneDegrees : float = 10;
var playerCamera : Transform;


//================================================================================

function Start() {
	if (!playerCamera) { 
		playerCamera = gameObject.transform;
	}
}

//================================================================================

function Update () {
	if (steeringWheelEnabled) {
		var deg : Vector3 = playerCamera.rotation.eulerAngles;
		var rad : Vector3;
		// left turn or right turn?
		if (deg.z < 180 && deg.z > deadZoneDegrees) {
			rad.z = (deg.z-deadZoneDegrees) * Mathf.Deg2Rad;
		}
		if (deg.z > 180 && deg.z < 360-deadZoneDegrees) {
			rad.z = (deg.z+deadZoneDegrees) * Mathf.Deg2Rad;
		}
		rad.x = deg.x * Mathf.Deg2Rad;
		// Add the extra rotation to the yaw of the playerCamera 
		// Note: Camera needs the "FPV_GyroAccelScript" component to work
		var rotationSpeed : float = -Mathf.Sin(rad.z) * Time.deltaTime * maxRotationSpeed;
		playerCamera.SendMessage("AddYawOffsetToGyroscope",rotationSpeed);
	}
}

//================================================================================

function SetSteeringWheelEffect(on_off : boolean) {
	steeringWheelEnabled = on_off;
}

