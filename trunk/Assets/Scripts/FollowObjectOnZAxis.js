//PlayerMovement 23/2/2013
//How to use: Put this code into your player prefab
//What it does: Stay at a predefined distance from your camera in Z axis
//Last Modified: 27/2/2013
//by Yves J. Albuquerque

#pragma strict

var distance : float;

function FixedUpdate ()
{
	transform.position = Camera.mainCamera.transform.position;
	transform.position.z -= distance;
}