#pragma strict
var maxDistanceToMove : float = 3;
var speed = 4.0;
private var parentPosition : Vector3;
private var targetPoint : Vector3;
private var targetRotation : Quaternion;
private var myTransform : Transform; //Caching component lookup - Optimization Issue


function FixedUpdate ()
{
	if (myTransform.position.y < -4)
		rigidbody.velocity.y = 1;
	if (myTransform.position.x < -20)
		rigidbody.velocity.x = 1;
	if (myTransform.position.x > 20)
		rigidbody.velocity.x = -1;
	if (Vector3.Distance (targetPoint, myTransform.position) >  maxDistanceToMove) 
    {
    	targetPoint = targetPoint + Random.onUnitSphere * 2;
    	targetRotation = Quaternion.LookRotation(targetPoint - myTransform.position);
    }
	    
   	myTransform.rotation = Quaternion.Slerp(myTransform.rotation, targetRotation, speed * Time.deltaTime);
   	rigidbody.AddForce(speed * transform.forward * Time.deltaTime, ForceMode.VelocityChange);
}
	

function OnTriggerEnter (collider : Collider)
{
	if (collider.tag == "Player")
	{
		speed = 10;
		targetPoint = collider.transform.position + collider.transform.forward;
	}
}

function OnTriggerExit (collider : Collider)
{
	if (collider.tag == "Player")
	{
		speed = 4;
		targetPoint = parentPosition;
	}
}

function OnSpawned ()
{
	myTransform = transform;
	parentPosition = myTransform.parent.transform.position;
	myTransform.position = parentPosition;
	targetPoint = parentPosition;
}