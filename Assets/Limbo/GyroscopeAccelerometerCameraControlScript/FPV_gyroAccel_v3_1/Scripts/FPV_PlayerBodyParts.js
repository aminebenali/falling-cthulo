//================================================================================
// FPV_PlayerBodyParts
//================================================================================
//
// Contact info: MouseSoftware@GMail.com
//
// Determines the point at which the 'playerCamera' is looking. Then it rotates the 
// 'playerBody' accordingly and places the 'playerCamera' (back) at the 'playerHead'
// (if no Transforms are supplied, the current transform will be used)
//
// public variables:
// 'playerBody' (Transform):
//		The player's 'Body'
//
// 'playerHead' (Transform):
//		The player's 'Head' 
//
// 'playerCamera' (Transform):
//		The camera object. Usually this object will contain all 'FPV_GyroAccelScript' 
//		and relevant supporting scripts
//
//================================================================================

#pragma strict

// public variables
var playerBody : Transform;
var playerHead : Transform;
var playerCamera : Transform;

// private variables
private	var controller : CharacterController;

//////////////////////////////////////////////////

function Start () {
	controller = playerBody.GetComponent(CharacterController);
	// (if no Transforms are supplied, the current transform will be used)
	if (!playerBody) {
		playerBody = transform;
	}
	if (!playerHead) {
		playerHead = transform;
	}
	if (!playerCamera) {
		playerCamera = transform;
	}
}

//////////////////////////////////////////////////

function Update () {
	var sw : int = Screen.width;
	var sh : int = Screen.height;

	// where is the playerCamera looking at?
	var target : Vector3 = findTargetPoint();

	// make sure that the playerBody looks at this point
	var m : Vector3 = Vector3.Cross(Vector3.up,playerCamera.forward);
	var n : Vector3;
	if (Mathf.Approximately(m.sqrMagnitude,0)) {
		n = playerCamera.up;
	} else {
		n = Vector3.Cross(m,Vector3.up);
	}
	playerBody.LookAt(playerBody.position+n,Vector3.up);		
	
	// place the playerCamera (back) at the playerHead's position.
	playerCamera.position = playerHead.position;
}

//////////////////////////////////////////////////

function findTargetPoint() : Vector3 {
	// where is the playerCamera looking at?
	var targetPoint : Vector3;
	var layerMask = 1 << 8;
	layerMask = ~layerMask;
	var hit : RaycastHit;
	if (Physics.Raycast(playerCamera.position, playerCamera.forward, hit, 5000, layerMask)) {
		targetPoint = hit.point;
	} else {
		targetPoint = playerCamera.position+playerCamera.forward*5000;
	}
	return targetPoint;
}
