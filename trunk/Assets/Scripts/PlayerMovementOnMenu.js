#pragma strict

var plane : GameObject;
var maxDistanceToMove : float = 3;
var speed = 4.0;

private var controller : CharacterController; //Character Controller Reference
 

function Start ()
{
	controller = GetComponent(CharacterController);
	transform.position = Vector3 (Random.Range (-30,30),Random.Range (0,30),Random.Range (-20,50));
}
 
function Update ()
{
    var playerPlane = new Plane(Vector3.up, transform.position);
    var ray = Camera.main.ScreenPointToRay (Input.mousePosition);
	var hit : RaycastHit;
	var targetPoint : Vector3;
	var targetRotation : Quaternion;
	print ("tá influenciando erroneamente");
	if (Physics.Raycast (ray, hit, 100))
	{
	    Debug.DrawLine (ray.origin, hit.point);
	    if (Vector3.Distance (hit.point, transform.position) >  maxDistanceToMove) 
	    {
	    	targetPoint = ray.GetPoint(8);
	    	print ("hitpoint:" + hit.point);
	    	print ("targetPoint:" + targetPoint);
	    	targetRotation = Quaternion.LookRotation(targetPoint - transform.position);
	    }
	   	transform.rotation = Quaternion.Slerp(transform.rotation, targetRotation, speed * Time.deltaTime);
	    controller.Move(transform.forward * speed * Time.deltaTime);
	}
}