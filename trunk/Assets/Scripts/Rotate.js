#pragma strict
var speedRotation : float = 1;// base rotation velocity
var randomImprovement : boolean = true; //Add some velocity to this object (0~2)

function Start ()
{
	if (randomImprovement)
		speedRotation += Random.Range(0,2);
}

function Update ()
{
	transform.localEulerAngles.y += speedRotation;
}