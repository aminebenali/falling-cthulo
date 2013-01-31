//SmoothFollowCthulo
//How to use: Put this code into the Main Camera.
//What it does: Follows the target Player
//by Yves J. Albuquerque

#pragma strict

var target : Transform;// The target we are following
var distance = 10.0; // The distance in the x-z plane to the target
var height = 5.0; // the height we want the camera to be above the target

var heightDamping = 2.0; // Height Damping
var rotationDamping = 3.0; // Rotation Damping

@script AddComponentMenu("Camera-Control/Smooth Follow Cthulo")

function Awake ()
{
	if (!target)
		target = GameObject.FindGameObjectWithTag("Player").transform;
}

function LateUpdate ()
{
	// Calculate the current rotation angles
	var wantedRotationAngle = target.eulerAngles.y;
	var wantedHeight = target.position.y + height;
		
	var currentRotationAngle = transform.eulerAngles.y;
	var currentHeight = transform.position.y;
	
	// Damp the rotation around the y-axis
	currentRotationAngle = Mathf.LerpAngle (currentRotationAngle, wantedRotationAngle, rotationDamping * Time.deltaTime);

	// Damp the height
	currentHeight = Mathf.Lerp (currentHeight, wantedHeight, heightDamping * Time.deltaTime);

	// Convert the angle into a rotation
	var currentRotation = Quaternion.Euler (0, currentRotationAngle, 0);
	
	// Set the position of the camera on the x-z plane to:
	// distance meters behind the target
	transform.position = target.position;
	transform.position -= currentRotation * Vector3.forward * distance;

	// Set the height of the camera
	transform.position.y = currentHeight;
	
	// Always look at the target
	transform.LookAt (target);
}