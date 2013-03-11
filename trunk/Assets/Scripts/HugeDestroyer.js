//Destroyer 30/1/2013
//How to use: Put this code into an empty Game Object.
//What it does: Destroy everything
//Last Modified: 15/2/2013
//by Yves J. Albuquerque

#pragma strict

@script AddComponentMenu("Scripts")

function OnTriggerEnter (other : Collider)
{
	if (other.tag != "Player")
	    Destroy(other.transform.root.gameObject);
}