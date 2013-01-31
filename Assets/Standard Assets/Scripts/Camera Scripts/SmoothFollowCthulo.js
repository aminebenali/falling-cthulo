//SmoothFollowCthulo 30/01/2013
//How to use: Put this code into the Main Camera.
//What it does: Follows the target Player
//Last Modified: 31/1/2013
//by Yves J. Albuquerque

#pragma strict

var target : Transform;// The target we are following
var distance = 10.0; // The distance in the x-z plane to the target
var height = 5.0; // the height we want the camera to be above the target

var heightDamping = 2.0; // Height Damping
var sideDamping = 3.0; // Rotation Damping

@script AddComponentMenu("Camera-Control/Smooth Follow Cthulo")

function Awake ()
{
	if (!target)
		target = GameObject.FindGameObjectWithTag("Player").transform;
}

function LateUpdate ()
{
	var wantedSide = target.position.x;
	var wantedHeight = target.position.y + height;
		
	var currentSide = transform.position.x;
	var currentHeight = transform.position.y;
	
	// Damp to the sides
	currentSide = Mathf.Lerp (currentSide, wantedSide, sideDamping * Time.deltaTime);

	// Damp the height
	currentHeight = Mathf.Lerp (currentHeight, wantedHeight, heightDamping * Time.deltaTime);
	
	// Set the position of the camera on the x-z plane to:
	// distance meters behind the target
	transform.position = target.position;
	transform.position -= Vector3.forward * distance;

	// Set the side of the camera
	transform.position.x = currentSide;
	
	// Set the height of the camera
	transform.position.y = currentHeight;
	
	// Always look at the target
	transform.LookAt (target);
}