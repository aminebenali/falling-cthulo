#pragma strict
var posCamera : Transform;
function Start ()
{
	posCamera = Camera.mainCamera.transform;
}

function Update ()
{
	transform.LookAt(posCamera);
}