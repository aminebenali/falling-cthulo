//Destroyer 30/1/2013
//How to use: Put this code into an empty Game Object.
//What it does: Destroy everything but Terrain and Players
//Last Modified: 27/2/2013
//by Yves J. Albuquerque

#pragma strict

@script AddComponentMenu("Generics/Small Destroyer")

function OnTriggerEnter (other : Collider)
{
	if (other.tag != "Terrain" && other.tag != "Player" && other.tag != "Mountain")
    	Destroy(other.transform.root.gameObject);
}