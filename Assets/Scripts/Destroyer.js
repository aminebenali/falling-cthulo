//Destroyer 30/1/2013
//How to use: Put this code into an empty Game Object.
//What it does: Destroy everything OnTriggerEnter
//by Yves J. Albuquerque

#pragma strict

@script AddComponentMenu("Scripts")

function OnTriggerEnter (other : Collider)
{
    Destroy(other.gameObject);
}