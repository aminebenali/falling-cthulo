//PlayerMovement 30/1/2013
//How to use: Put this code into your player prefab
//What it does: Move the character to the sides when acelerates and apply gravity. Also constraits the character.
//Last Modified:4/6/2013
//by Yves J. Albuquerque

#pragma strict
  
var xSpeed : float = 5.0;//Left-Right axis Speed Control
var ySpeed : float = 5.0;//Up-Down axis Speed Control
var zSpeed : float = 10.0;//Forward Speed Control
var gravity : float = 10.0;//Gravity Speed Control

var xConstrait : float = 2.5; //Constrait distance on X axis
var yConstrait : float = 2.5; //Constrait distance on Y axis

var cThulo : GameObject; //cThulo model reference

var constrait : boolean = false; //Turn On and Turn Off constrait

private var finalGravity : float;//The final gravity value
private var moveDirection : Vector3 = Vector3.zero; //Move Direction Vector
private var impact : Vector3 = Vector3.zero;//modifies moveDirection over a short time
private var constraitTimer : float = 0;//Timer to Lerp between actual position and the desired position of the bound
private var isCorrectingPosition : boolean = false;//isCorrectingPosition?
private var isCorrectingPositionOldValue : boolean = false;//The Old Value from isCorrectingPosition
private var controller : CharacterController; //Character Controller Reference
private var anim : Animator; //Animator reference
private var myTransform : Transform;//Caching component lookup - Optimization Issue

static var phantomMovement: boolean;

@script AddComponentMenu("Characters/Cthulo Movement")

function Start ()
{
	finalGravity = gravity;
	controller = GetComponent(CharacterController);
	myTransform = transform;
	cThulo = GameObject.Find("char_cthulhu_anim");
	anim = GetComponentInChildren(Animator);
	controller.Move(Vector3.forward);

}

function Update()
{
	if (LevelManager.menuMode || PlayerStatus.isDead)
		return;
	var xAcc : float;
	var yAcc : float;
	
	if (SystemInfo.supportsAccelerometer)
	{
		xAcc = Input.acceleration.x*2;
		yAcc = (Input.acceleration.z*2)+0.5;
	}

	xAcc = Mathf.Clamp(xAcc,-1.2,1.2);
	yAcc = Mathf.Clamp(yAcc,-1.2,1.2);
	
    //Velocity Adjustment
    if (zSpeed < 25)
		zSpeed += (2*Time.deltaTime);
	else if (zSpeed < 80)
		zSpeed += Time.deltaTime;

	
	if (Application.isEditor)
	    moveDirection = Vector3(Input.GetAxis("Horizontal") * xSpeed, Input.GetAxis("Vertical")*ySpeed, zSpeed);
	else
		moveDirection = Vector3(xAcc * xSpeed, yAcc*ySpeed, zSpeed);

    cThulo.transform.LookAt (moveDirection + myTransform.position + Vector3.forward);
    moveDirection = myTransform.TransformDirection(moveDirection);
	
    // Apply gravity
    moveDirection.y -= gravity * Time.deltaTime;
    
    if (constrait)
    	ApplyConstraits ();
    	
    if (myTransform.position.y < -4.5 && moveDirection.y < 0)
    {
    	moveDirection.y = 0;
    }
    
     if (myTransform.position.y > 15 && moveDirection.y > 0)
    {
    	moveDirection.y = 0;
    }
    if (myTransform.position.x < -21 && moveDirection.x < 0)
    {
    	moveDirection.x = 0;
    }
    
    if (myTransform.position.x > 21 && moveDirection.x > 0)
    {
    	moveDirection.x = 0;
    }
    
    moveDirection += impact;
    impact = Vector3.Lerp(impact, Vector3.zero, 5*Time.deltaTime);
    
    // Move the controller
   	if (!PlayerStatus.invunerable)
    	controller.Move(moveDirection * Time.deltaTime);
    else
    	transform.Translate(Vector3(moveDirection.x,moveDirection.y,80) * Time.deltaTime);
    anim.SetFloat("Speed", moveDirection.magnitude);
}

function AddImpact(dir: Vector3, force: float)
{
	dir.Normalize();
 	if (dir.y < 0)
 		dir.y = -dir.y; // reflect down force on the ground
 	
 	impact += dir.normalized * force;
}

function OnGUI ()
{
	GUILayout.Label("\n");
	GUILayout.Label("x" + Input.acceleration.x.ToString());
	GUILayout.Label("y" + Input.acceleration.y.ToString());
	GUILayout.Label("z" + Input.acceleration.z.ToString());
}

function OnControllerColliderHit (hit : ControllerColliderHit)
{
	if (LevelManager.menuMode)
		return;
	if (controller.collisionFlags & CollisionFlags.Sides)
	{
		if (myTransform.position.z < hit.transform.position.z)
			if (zSpeed > 1)
				zSpeed /= 2; //HeadHit
	}
        
	if (controller.collisionFlags == CollisionFlags.None) //Free Floating
	{

	}
        
    if (controller.collisionFlags == CollisionFlags.Sides)
        print("Only touching sides");
        
    if (controller.collisionFlags == CollisionFlags.Above)
        //print("Touching ground!");

    if (controller.collisionFlags == CollisionFlags.Below)
        print("Something above");
}

function ApplyConstraits ()//Not good solution yet. Cthulo still bouncing at boundaries
{
	constraitTimer += Time.deltaTime;
	

	if ((myTransform.position.x < xConstrait) && (myTransform.position.x > -xConstrait) &&  (myTransform.position.y < yConstrait) && (myTransform.position.y > -yConstrait)) //Left-Right Ok
	{
		isCorrectingPosition = false;
	}
	else
	{
		isCorrectingPosition = true;
		
		if (myTransform.position.x > xConstrait)
		{
			moveDirection.x = Mathf.Lerp(0, -xSpeed, constraitTimer);
		}
		
	 	if (myTransform.position.x < -xConstrait)
	 	{
			moveDirection.x = Mathf.Lerp(0, xSpeed, constraitTimer);
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
	zSpeed = 0;
}

function OnAlive ()
{
	print ("PlayerMovement OnAlive");
	zSpeed = 1;
}


@script RequireComponent(CharacterController)