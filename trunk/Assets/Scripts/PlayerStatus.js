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
    	Death ();
    if (life > 100)
    	life = 100;
    else
    	life += Time.deltaTime;
    
    print (life);
}

function Death ()
{
	print ("death");
}

function OnControllerColliderHit (hit : ControllerColliderHit)
{
	if (controller.collisionFlags & CollisionFlags.Sides)
		if (transform.position.z < hit.transform.position.z)
			life -= velocity;
}