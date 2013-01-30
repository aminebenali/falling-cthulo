//PlayerMovement
//Put this code into your player prefab
//by Yves J. Albuquerque

#pragma strict
  

var xSpeed : float = 5.0;//Left-Right axis Speed Control
var ySpeed : float = 5.0;//Up-Down axis Speed Control
var zSpeed : float = 10.0;//Forward Speed Control
var gravity : float = 10.0;//Gravity Speed Control

private var finalGravity : float;//The final gravity value
private var moveDirection : Vector3 = Vector3.zero; //Move Direction Vector

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
        print("Free floating!");
        
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
    
    // Move the controller
    controller.Move(moveDirection * Time.deltaTime);
}


@script RequireComponent(CharacterController)