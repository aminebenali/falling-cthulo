//Playerstatus 31/1/2013
//How to use: Put this code into the Player Game Object
//What it does: Manage the distance, life and velocity of the Player
//Last Modified: 31/1/2013
//by Yves J. Albuquerque

#pragma strict

public static var distance : float;
public static var life : float = 100;
public static var velocity : float;
private var controller : CharacterController;

function Start ()
{
    controller = GetComponent(CharacterController);
}

function Update ()
{
    velocity = controller.velocity.z;
    distance = transform.position.z;
    if (life < 0)
    {
    	SendMessage ("OnDeath");
    	gameObject.Find("Game Manager").SendMessage("OnDeath");
    }
    	
    if (life > 100)
    	life = 100;
    else
    	life += Time.deltaTime;
    
    print (life);
}

function OnDeath ()
{
	print ("Player Status Death");
	life = 100;
}

function OnControllerColliderHit (hit : ControllerColliderHit)
{
	if (controller.collisionFlags & CollisionFlags.Sides)
		if (transform.position.z < hit.transform.position.z)
			life -= (3*velocity);
}