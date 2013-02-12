//PlayerMovement 30/1/2013
//How to use: Put this code into your player prefab
//What it does: Move the character to the sides when acelerates and apply gravity. Also constraits the character.
//Last Modified: 8/2/2013
//by Yves J. Albuquerque

#pragma strict
  
var xSpeed : float = 5.0;//Left-Right axis Speed Control
var ySpeed : float = 5.0;//Up-Down axis Speed Control
var zSpeed : float = 10.0;//Forward Speed Control
var gravity : float = 10.0;//Gravity Speed Control

var xConstrait : float = 2.5; //Constrait distance on X axis
var yConstrait : float = 2.5; //Constrait distance on Y axis

var cThulo : GameObject;

private var finalGravity : float;//The final gravity value
private var moveDirection : Vector3 = Vector3.zero; //Move Direction Vector
private var constraitTimer : float = 0;//Timer to Lerp between actual position and the desired position of the bound
private var isCorrectingPosition : boolean = false;//isCorrectingPosition?
private var isCorrectingPositionOldValue : boolean = false;//The Old Value from isCorrectingPosition
private var controller : CharacterController; //Character Controller Reference

@script AddComponentMenu("Characters/Cthulo Movement")

function Start ()
{
	finalGravity = gravity;
}

function Update()
{
    controller = GetComponent(CharacterController);
    //Velocity Adjustment
	zSpeed += (2*Time.deltaTime);

    moveDirection = Vector3(Input.GetAxis("Horizontal") * xSpeed, Input.GetAxis("Vertical")*ySpeed, zSpeed);
    cThulo.transform.LookAt (moveDirection + transform.position);
    moveDirection = transform.TransformDirection(moveDirection);
	
	// Calculate Gravity
	//gravity = 1.0-moveDirection.normalized * gravity;
	
    // Apply gravity
    moveDirection.y -= gravity * Time.deltaTime;
    
    ApplyConstraits ();
    // Move the controller
    controller.Move(moveDirection * Time.deltaTime);
}


function OnControllerColliderHit (hit : ControllerColliderHit)
{

		
	if (controller.collisionFlags & CollisionFlags.Sides)
	{
		if (transform.position.z < hit.transform.position.z)
			if (zSpeed > 1)
				zSpeed /= 2; //HeadHit
	}
        
	if (controller.collisionFlags == CollisionFlags.None) //Free Floating
	{

	}
        
    if (controller.collisionFlags == CollisionFlags.Sides)
        print("Only touching sides");
        
    if (controller.collisionFlags == CollisionFlags.Above)
        print("Touching ground!");

    if (controller.collisionFlags == CollisionFlags.Below)
        print("Something above");
}

function ApplyConstraits ()//Not good solution yet. Cthulo still bouncing at boundaries
{
	constraitTimer += Time.deltaTime;
	

	if ((transform.position.x < xConstrait) && (transform.position.x > -xConstrait) &&  (transform.position.y < yConstrait) && (transform.position.y > -yConstrait)) //Left-Right Ok
	{
		isCorrectingPosition = false;
	}
	else
	{
		isCorrectingPosition = true;
		
		if (transform.position.x > xConstrait)
		{
			moveDirection.x = Mathf.Lerp(0, -xSpeed, constraitTimer);
		}
		
	 	if (transform.position.x < -xConstrait)
	 	{
			moveDirection.x = Mathf.Lerp(0, xSpeed, constraitTimer);
		}
		
		if (transform.position.y > yConstrait)
		{
			moveDirection.y = Mathf.Lerp(0, -ySpeed, constraitTimer);
		}
		
	 	if (transform.position.y < -yConstrait)
	 	{
			moveDirection.y = Mathf.Lerp(0, ySpeed, constraitTimer);
		}
	}
	
	if (isCorrectingPosition != isCorrectingPositionOldValue)
	{
		constraitTimer = 0;
	}
	
	isCorrectingPositionOldValue = isCorrectingPosition;
}

function OnDeath ()
{
	transform.position.z=0;
}
@script RequireComponent(CharacterController)