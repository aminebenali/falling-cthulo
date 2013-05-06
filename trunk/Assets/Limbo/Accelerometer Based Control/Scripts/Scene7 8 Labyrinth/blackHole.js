var spawnPoint : Transform;
var theShadow : GameObject;

public var controllerBall : ControllerBallByAccelerometer;

function OnTriggerEnter (other : Collider) 
{
	if(controllerBall){
		controllerBall.isAvailableForControl = false;
	}
	other.rigidbody.velocity = Vector3.zero;
	other.rigidbody.angularVelocity = Vector3.zero;
	other.gameObject.active = false;
	theShadow.active = false;
	
	yield new WaitForSeconds (0.5);
	
    other.transform.position = spawnPoint.position;
    
    other.gameObject.active = true;
    theShadow.active = true;
    
    if(controllerBall){
    	yield new WaitForSeconds (0.3); //wait 0.2 seconds to control the ball in new game!
		controllerBall.isAvailableForControl = true;
	}
}