//PlayerMovement 30/1/2013
//How to use: Put this code into your player prefab
//What it does: Move the character to the sides when acelerates and apply gravity. Also constraits the character.
//by Yves J. Albuquerque

#pragma strict
  
var xSpeed : float = 5.0;//Left-Right axis Speed Control
var ySpeed : float = 5.0;//Up-Down axis Speed Control
var zSpeed : float = 10.0;//Forward Speed Control
var gravity : float = 10.0;//Gravity Speed Control

var xConstrait : float = 2.5; //Constrait distance on X axis
var yConstrait : float = 2.5; //Constrait distance on Y axis

private var finalGravity : float;//The final gravity value
private var moveDirection : Vector3 = Vector3.zero; //Move Direction Vector
private var constraitTimer : float = 0;
private var isCorrectingPosition : boolean = false;
private var isCorrectingPositionOldValue : boolean = false;

@script AddComponentMenu("Characters/Cthulo Movement")

function Start ()
{
	finalGravity = gravity;
}

function Update()
{
    var controller : CharacterController = GetComponent(CharacterController);
    //Velocity Adjustment
	zSpeed += Time.deltaTime;

    moveDirection = Vector3(Input.GetAxis("Horizontal") * xSpeed, Input.GetAxis("Vertical")*ySpeed, zSpeed);
    moveDirection = transform.TransformDirection(moveDirection);

    if (controller.collisionFlags == CollisionFlags.None)
        //print("Free floating!");
        
    if (controller.collisionFlags == CollisionFlags.Sides)
        print("Only touching sides");
        
    if (controller.collisionFlags == CollisionFlags.Above)
        print("Touching ground!");

    if (controller.collisionFlags == CollisionFlags.Below)
        print("Something above");
	
	// Calculate Gravity
	//gravity = 1.0-moveDirection.normalized * gravity;
	
    // Apply gravity
    moveDirection.y -= gravity * Time.deltaTime;
    
    ApplyConstraits ();

    // Move the controller
    controller.Move(moveDirection * Time.deltaTime);
}

function ApplyConstraits ()//Not good solution yet. Cthulo still bouncing at boundaries
{
	constraitTimer += Time.deltaTime;
	
	if (isCorrectingPosition != isCorrectingPositionOldValue)
	{
		constraitTimer = 0;
	}

	if ((transform.position.x < xConstrait) && (transform.position.x > -xConstrait)) //Left-Right Ok
	{
		isCorrectingPosition = false;
	}
	else
	{
		isCorrectingPosition = true;
		
		if (transform.position.x > xConstrait)
		{
			moveDirection.x = Mathf.Lerp(moveDirection.x, -1, constraitTimer);
		}
		
	 	if (transform.position.x < -xConstrait)
	 	{
			moveDirection.x = Mathf.Lerp(moveDirection.x, 1, constraitTimer);
		}
	}
	
	if ((transform.position.y < yConstrait) && (transform.position.y > -yConstrait)) //Up-Down Ok
	{
		isCorrectingPosition = false;
	}
	else
	{
		isCorrectingPosition = true;
		
		if (transform.position.y > yConstrait)
		{
			moveDirection.y = Mathf.Lerp(moveDirection.y, -1, constraitTimer);
		}
		
	 	if (transform.position.y < -yConstrait)
	 	{
			moveDirection.y = Mathf.Lerp(moveDirection.y, 1, constraitTimer);
		}
	}
	
	isCorrectingPositionOldValue = isCorrectingPosition;
}
@script RequireComponent(CharacterController)