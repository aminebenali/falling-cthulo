//================================================================================
// FPV_GyroAccelScript
//================================================================================
//
// Contact info: MouseSoftware@GMail.com
//
// Sets the current rotation as determined by the gyroscope.
// If no gyroscope is available, the accelerometer will be used to find the
// device's rotation (note: rotation around the device's y-axis cannot be determined 
// with an accelerometer)
// Inside the unity editor, the mouse will be used.
//
// Public variables:
//
// * 'pitchOffset' (float) 
//      The pitch angle of the device's horizon. Usefull for configuring your 
//      gameplay to a convenient playing angle.
//
// * 'yawOffset' (float)
//	    By default, the script starts looking 'north'. Change this value to start 
//      with a different direction.
//
// * 'gyroSmoothFactor' (float)
//      Decreasing the value of 'gyroSmoothFactor' will result in smoother, 
//      but slower, movement while using the gyroscope.
//
// * 'accelerometerSmoothFactor' (float)
//      Decreasing the value of 'accelerometerSmoothFactor' will result in smoother, 
//      but slower, movement while using the accelerometer.
//
// * 'mouseSensitivity (float)
// * 'invertMouseAxis (boolean)
//	    While inside the unity editor, the mouse will be used to look around. 
//      This is useful when testing other parts of your project. The sensitivity can be set 
//      with 'mouseSensitivity', and mouse movements can be inverted with 
//      'invertMouseAxis'.
//
//
//	** The following functions can be called using SendMessage or BroadcastMessage:
//  * function AddYawOffsetToGyroscope(yawToAdd : float)
//		add an (extra) yaw to the rotation (e.g. when using a joystick button)
//  * function AddPitchOffsetToGyroscope(PitchToAdd : float)
//		add an (extra) pitch to the rotation (e.g. when using a joystick button)
//	* function SetForwardLookingDirection(dir : Vector3)
//		instantiantly sets the forward looking vector 
//
//================================================================================

#pragma strict
#pragma downcast

// public variables
var pitchOffset : float = -30;
var yawOffset : float = 0;
var gyroSmoothFactor : float = 0.5;
var accelerometerSmoothFactor : float = 0.2;
var mouseSensitivity : float = 1;
var invertMouseAxis : boolean = false;

// private variables
private var previousAngleY : float = 0;
private var gyroDriftCompensation : float = 0;
private var deltaAngleYArray = new Array ();

//================================================================================

function Start() {
	if (SystemInfo.supportsGyroscope) {
		Input.gyro.enabled = true;			// enable the gyroscope
		Input.gyro.updateInterval = 0.0167;	// set the update interval to it's highest value (60 Hz)
	} 	
}

//================================================================================

function Update () {
	// inside the unity editor: use the mouse to look around
	if (Application.isEditor) {
		MouseUpdate();
	}
	// only use the gyroscope where available, in all other cases, use the accelerometer
	if (!Application.isEditor && SystemInfo.supportsGyroscope) {
		var gyroRotation : Quaternion = ReadGyroscopeRotation();
		var smoothFactor = Quaternion.Angle(transform.rotation,gyroRotation);
		transform.rotation = Quaternion.Slerp(transform.rotation, gyroRotation, smoothFactor);
	} 
	if (!Application.isEditor && !SystemInfo.supportsGyroscope) {
		var accelRotation : Quaternion = ReadAccelerometerRotation();
		transform.rotation = Quaternion.Slerp(transform.rotation, accelRotation, accelerometerSmoothFactor);
	}
}

//================================================================================

function ReadGyroscopeRotation() : Quaternion {
	// Read the current rotation of the gyroscope
	//
	var gyroRotation : Quaternion = Input.gyro.attitude;
	//
	// For a smooth and adequate use of the gyroscope for a First Person View game,
	// several computations are necessary:
	//
	// A) 	By default, the gyroscope forward axis 'looks down'. All the gyro's 
	//		measurements must be rotated 90 degrees around the device's horizontal axis.
	//
	var A : Quaternion = Quaternion(0.5,0.5,-0.5,0.5);
	gyroRotation = A * gyroRotation;
	//
	// B) 	Movements must be inverted and adapted for several screen orientation (Portrait Up, Portrait Down, 
	//		Landscape Left, Landscape Right (adaption to screen orientation only for version prior to Unity4.x)
	//
	var B : Quaternion = Quaternion(0,0,1,0);
	#if (UNITY_3_4 || UNITY_3_5)
		var sqrthalf : float = Mathf.Sqrt(0.5);
		if (Screen.orientation == ScreenOrientation.PortraitUpsideDown)	B = Quaternion(0,0,0,1);
		if (Screen.orientation == ScreenOrientation.LandscapeLeft)		B = Quaternion(0,0,sqrthalf,sqrthalf);
		if (Screen.orientation == ScreenOrientation.LandscapeRight)		B = Quaternion(0,0,-sqrthalf,sqrthalf);
	#endif
	gyroRotation = gyroRotation * B;
	//
	// C)	Apply the 'yawOffset'. This can be used to rotate directly around the 
	//		gameworld's y-axis, indepentely of the gyroscope (start heading at
	//		the beginning of a level, rotaton due to joystick movement, etc.)
	//
	var C : Quaternion = Quaternion.AngleAxis(yawOffset,Vector3.up);
	gyroRotation = C * gyroRotation;
	//
	// D)	A 'pitchOffset' can be applied to adjust the gameworld's horizon.
	//		This may result in a more convenient playing angle during gameplay. 
	//		I: define the pitch rotation axis 'rotAxis' = perpendicular to the 
	//		gameworlds up-axis and the gyro's forward axis.
	//		II: compute the angle 'alpha' between the world's up axis and gyro's 
	//		forward axis
	//		III: For a smoother movement AND te make sure that looking 
	//		'straight up' or looking 'straight down' is the same in the gameworld
	//		and the real world, a new angle 'beta' will be calculated.
	//		'beta'='pitchOffset' if the 90-'alpha' equals 'pitchOffset'
	//		'beta' = 0 when looking straight up or down.
	//		A Sinus^2 function will be used, to smoothly change the value's in between.
	//		IV: create the right quaternion (rotation of beta degrees around rotAxis) 
	//		and apply this.
	//		
	//		D.I
	var gyroRotationForward : Vector3 = gyroRotation * Vector3.forward;
	var rotAxis : Vector3 = Vector3.Cross(Vector3.up,gyroRotationForward);
	//		D.II
	var alpha : float = Vector3.Angle(Vector3.up,gyroRotationForward);
	//		D.III
	var beta : float;
	var sinus : float;
	if (alpha <= 90-pitchOffset) {
		sinus = Mathf.Sin(Mathf.PI * (Mathf.Deg2Rad * alpha) / (Mathf.PI - (2 * Mathf.Deg2Rad * pitchOffset)));
		beta = pitchOffset*sinus*sinus;
	} else {
		sinus = Mathf.Sin(Mathf.PI * Mathf.Deg2Rad * (alpha+2*pitchOffset) / (Mathf.PI+2*Mathf.Deg2Rad *pitchOffset));
		beta = pitchOffset*sinus*sinus;
	}
	//		D.IV
	var D : Quaternion = Quaternion.AngleAxis(beta,rotAxis);
	gyroRotation = D * gyroRotation;
	//
	// Finally return the quaternion holding the gyro's rotation
	//
	return gyroRotation;
}

//================================================================================

function ReadAccelerometerRotation() : Quaternion {
	var accelRotation : Quaternion;	
	var gravity : Vector3;
	// Determine the accelerometer rotation and add
	//
	// A) 	There is no A ;-) 
	// B) 	Adaptations due to the several screen orientation (Portrait Up, Portrait Down, 
	//		Landscape Left, Landscape Right; adaption to screen orientation only for version prior to Unity4.x)
	//
	gravity.x =  Input.acceleration.x;
	gravity.y =  Input.acceleration.y;
	gravity.z = -Input.acceleration.z;
	#if (UNITY_3_4 || UNITY_3_5)
		if (Screen.orientation == ScreenOrientation.PortraitUpsideDown) {
			gravity.x = -Input.acceleration.x;
			gravity.y = -Input.acceleration.y;
			gravity.z = -Input.acceleration.z;
		}
		if (Screen.orientation == ScreenOrientation.LandscapeLeft) {
			gravity.x = -Input.acceleration.y;
			gravity.y =  Input.acceleration.x;
			gravity.z = -Input.acceleration.z;
		}
		if (Screen.orientation == ScreenOrientation.LandscapeRight) {
			gravity.x =  Input.acceleration.y;
			gravity.y = -Input.acceleration.x;
			gravity.z = -Input.acceleration.z;
		}
	#endif
	var rotZ : float = relativeAngleAroundAxis(Vector3.up,-gravity,Vector3.forward);
	var rotX : float = relativeAngleAroundAxis(Vector3.up,-gravity,Vector3.right);
	accelRotation = Quaternion.Euler(rotX,0,rotZ);
	//
	// C)	Apply the 'yawOffset'. (e.g. start heading at the beginning of a level, 
	//		rotaton due to joystick movement, etc.)
	//
	var C : Quaternion = Quaternion.AngleAxis(yawOffset,Vector3.up);
	accelRotation = C * accelRotation;
	//
	// D)	A 'pitchOffset' can be applied to adjust the gameworld's horizon.
	//		This may result in a more convenient playing angle during gameplay. 
	//		I: define the pitch rotation axis 'rotAxis' = perpendicular to the 
	//		gameworlds up-axis and the gyro's forward axis.
	//		II: compute the angle 'alpha' between the world's up axis and gyro's 
	//		forward axis
	//		III: For a smoother movement AND te make sure that looking 
	//		'straight up' or looking 'straight down' is the same in the gameworld
	//		and the real world, a new angle 'beta' will be calculated.
	//		'beta'='pitchOffset' if the 90-'alpha' equals 'pitchOffset'
	//		'beta' = 0 when looking straight up or down.
	//		A Sinus^2 function will be used, to smoothly change the value's in between.
	//		IV: create the right quaternion (rotation of beta degrees around rotAxis) 
	//		and apply this.
	//		
	//		D.I
	var accelRotationForward : Vector3 = accelRotation * Vector3.forward;
	var rotAxis : Vector3 = Vector3.Cross(Vector3.up,accelRotationForward);
	//		D.II
	var alpha : float = Vector3.Angle(Vector3.up,accelRotationForward);
	//		D.III
	var beta : float;
	var sinus : float;
	if (alpha <= 90-pitchOffset) {
		sinus = Mathf.Sin(Mathf.PI * (Mathf.Deg2Rad * alpha) / (Mathf.PI - (2 * Mathf.Deg2Rad * pitchOffset)));
		beta = pitchOffset*sinus*sinus;
	} else {
		sinus = Mathf.Sin(Mathf.PI * Mathf.Deg2Rad * (alpha+2*pitchOffset) / (Mathf.PI+2*Mathf.Deg2Rad *pitchOffset));
		beta = pitchOffset*sinus*sinus;
	}
	//		D.IV
	var D : Quaternion = Quaternion.AngleAxis(beta,rotAxis);
	accelRotation = D * accelRotation;
	//
	return accelRotation;
}

//================================================================================

function MouseUpdate() {
	transform.rotation.eulerAngles.z = 0;
	var horizontalSpeed : float = 2.0;
	var verticalSpeed : float = 2.0;
	var h : float = horizontalSpeed * Input.GetAxis ("Mouse X");
	var v : float = verticalSpeed * Input.GetAxis ("Mouse Y");
	transform.Rotate (v, 0 , 0, Space.Self);
	transform.Rotate (0, h , 0, Space.World);
}

//================================================================================

function relativeAngleAroundAxis(v1 : Vector3, v2 : Vector3, n : Vector3) : float {
	// calculates relative angle between directional vectors v1 and v2, 
	// both projected on a plane defined by (n.x * x) + (n.y * y) + (n.z * z) = 0 
	// where n is the normal vector of the plane.
	// note: when either v1 or v2 is parallel to n, there are an infinite number
	// of solutions: the script will return a random number (So use with care).
	var temp : Vector3;
	var dirA : Vector3;
	var dirB : Vector3;
	n.Normalize(); // make sure n is normalized
	// calculate projection of v1 on the plane defined by normalvector n
	temp = Vector3.Cross(n,v1); 
	dirA = Vector3.Cross(temp,n);
	// calculate projection of v2 on the plane defined by normalvector n
	temp = Vector3.Cross(n,v2); 
	dirB = Vector3.Cross(temp,n);
	// and calculate the angle and sign (lefthanded- or righthanded rotation)
	temp = Vector3.Cross(dirA,dirB);
	var angleSignTemp : float = Vector3.Angle(temp,n) - 90;
	var angleSign : float = Mathf.Sign(angleSignTemp);
	var angleRelAB : float = Vector3.Angle(dirA,dirB) * angleSign;
	//
	return angleRelAB;
}

//================================================================================

function AddYawOffsetToGyroscope(yawToAdd : float) {
	yawOffset += yawToAdd;
}

//================================================================================

function AddPitchOffsetToGyroscope(PitchToAdd : float) {
	pitchOffset += PitchToAdd;
}

//================================================================================

function SetForwardLookingDirection(dir : Vector3) {
	if (dir.sqrMagnitude != 0) {
		yawOffset = relativeAngleAroundAxis(dir,Vector3.forward,Vector3.up);
		pitchOffset = Vector3.Angle(dir,Vector3.up) - 90;
	}
}