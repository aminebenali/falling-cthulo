/*
Controller Rocket:
	This script manages the rockets behavior such as initial speed and collisions.
	If an aircraft uses weapon bonus, then the rockets will released from the aircraft. 
	The rocket's initial speed should be the same with aircraft with an additional speed.
	Then for fixedUpdate the rocket will go forward (we apply force) and when hit to corridor or gate, it blasts.
	If the rocket hits the gate, then the corresponding gate will explode.

*/


var rocketLaunch : GameObject;
var rocketExpolosion : GameObject;
var initialRocketSpeed : float;

function Start(){
	Debug.Log("Rocket is launced");
	rigidbody.velocity = ControllerXCode.currentAircraft.rigidbody.velocity + (transform.forward * initialRocketSpeed);
	Instantiate (rocketLaunch, transform.position - Vector3(0, 0, -0.2), Quaternion.identity);
}

function FixedUpdate(){
	rigidbody.AddForce (transform.forward * 0.3);
}

function OnCollisionEnter(collisionInfo : Collision) {
	CheckTagAndDecideToDestry(collisionInfo.transform);
}

function OnTriggerEnter (other : Collider) {
	CheckTagAndDecideToDestry(other.transform);
}

function CheckTagAndDecideToDestry(collisionTransform : Transform){
 	if(collisionTransform.CompareTag("Gate")){
 		ControllerXCode.sciptGameLogic.SendMessage ("ExplodeGate", collisionTransform.gameObject);
 		ControllerXCode.sciptGameLogic.SendMessage ("ExplodeRocket", gameObject);
 	}
 	else if(collisionTransform.CompareTag("Corridor")){
 		ControllerXCode.sciptGameLogic.SendMessage ("ExplodeRocket", gameObject);
 	}
 	else{
 		//do nothing -> rocket has crashed to coin, aircraft or some other objects...
 	}
 	
}

