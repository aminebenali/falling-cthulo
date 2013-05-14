//Rotate 27/1/2013
//How to use: Put this code into the Game Object
//What it does: Rotate object over time
//Last Modified: 14/3/2013
//by Yves J. Albuquerque

#pragma strict
var speedRotation : float = 60;// base rotation velocity
var randomImprovement : boolean = true; //Add some velocity to this object (0~2)

private var myTransform : Transform; //Caching component lookup - Optimization Issue

@script AddComponentMenu("Generics/Rotate Object")

function Start ()
{
	myTransform = transform;

	if (randomImprovement)
		speedRotation += Random.Range(0,2);
}

function Update ()
{
	myTransform.localEulerAngles.y += speedRotation * Time.deltaTime;
}