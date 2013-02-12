//SmoothFollowCthulo 30/01/2013
//How to use: Put this code into the Main Camera.
//What it does: Follows the target Player
//Last Modified: 12/2/2013
//by Yves J. Albuquerque

#pragma strict

var target : Transform;// The target we are following
var playerCharacterController : CharacterController;//Player Character Controller
var distance = 10.0; // The distance in the x-z plane to the target
var height = 5.0; // the height we want the camera to be above the target

var heightDamping = 2.0; // Height Damping
var sideDamping = 3.0; // Rotation Damping
var distanceDamping = 7.0; // Distance Damping

var fixedCameraMode : boolean = false;

@script AddComponentMenu("Camera-Control/Smooth Follow Cthulo")

function Awake ()
{
	if (!target)
		target = GameObject.FindGameObjectWithTag("Player").transform;
	if (!playerCharacterController)
		playerCharacterController = GameObject.FindGameObjectWithTag("Player").GetComponent(CharacterController);
}

function LateUpdate ()
{
	var wantedSide = target.position.x;
	var wantedHeight = target.position.y + height;
	var wantedDistance = target.position.z - distance;
	
	if (playerCharacterController.velocity.magnitude < 50)
		wantedDistance -= playerCharacterController.velocity.magnitude/10;
	else
		wantedDistance -= distance;

	var currentSide = transform.position.x;
	var currentHeight = transform.position.y;
	var currentDistance = transform.position.z;
	
	// Damp to the sides
	currentSide = Mathf.Lerp (currentSide, wantedSide, sideDamping * Time.deltaTime);

	// Damp the height
	currentHeight = Mathf.Lerp (currentHeight, wantedHeight, heightDamping * Time.deltaTime);
	
	// Damp the distance
	currentDistance = Mathf.Lerp (currentDistance, wantedDistance, distanceDamping * Time.deltaTime);
	
	//Damp 
	// Set the position of the camera on the x-z plane to:
	// distance meters behind the target
	//transform.position = target.position;
	//transform.position -= Vector3.forward * distance;

	if (fixedCameraMode)
	{
		// Set the distance of the camera
		transform.position.z = currentDistance;
		transform.position.x = 0;
		transform.position.y = height;
	}
	else
	{
		// Set the side of the camera
		transform.position.x = currentSide;
		
		// Set the height of the camera
		transform.position.y = currentHeight;
		
		// Set the distance of the camera
		transform.position.z = currentDistance;
		
		// Always look at the target
		transform.LookAt (target);

	}
}