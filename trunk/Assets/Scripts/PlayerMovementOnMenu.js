//PlayerMovement 9/3/2013
//How to use: Put this code into your player prefab
//What it does: Character Follow Mouse
//Last Modified:04/04/2013
//by Yves J. Albuquerque

#pragma strict

var maxDistanceToMove : float = 3;
var speed = 4.0;

private var controller : CharacterController; //Character Controller Reference
private var myCamera : Camera; //main Camera reference

private var myTransform : Transform; //Caching component lookup - Optimization Issue
private var myFittingRoom : Transform;
@HideInInspector
public var inFittingRoom : boolean = false; //Falta implementar
@script AddComponentMenu("Characters/Cthulo Movement On Menu")


function Start ()
{
	myTransform = transform;
	myCamera = Camera.mainCamera;
	controller = GetComponent(CharacterController);
}
 
function FixedUpdate ()
{
	if (!LevelManager.menuMode)
		return;
		
	if (inFittingRoom)
	{
		if(!myFittingRoom)
			myFittingRoom = GameObject.Find("FittingRoom").transform;
		
		print (myFittingRoom);
		iTween.MoveTo(gameObject,{"position" : myFittingRoom.position + Vector3.up, "time":2f, "easetype":"easeOutQuad", "looktarget" : myFittingRoom.position + 5*Vector3.up -Vector3.forward});
		return;
	}

    var ray = myCamera.ScreenPointToRay (Input.mousePosition);
	var hit : RaycastHit;
	var targetPoint : Vector3;
	var targetRotation : Quaternion;
	if (Physics.Raycast (ray, hit, 100))
	{
	    if (Vector3.Distance (hit.point, myTransform.position) >  maxDistanceToMove) 
	    {
	    	targetPoint = ray.GetPoint(8);
	    	targetRotation = Quaternion.LookRotation(targetPoint - myTransform.position);
	    }

	   	myTransform.rotation = Quaternion.Slerp(myTransform.rotation, targetRotation, speed * Time.deltaTime);
	    controller.Move(myTransform.forward * speed * Time.deltaTime);
	}
}