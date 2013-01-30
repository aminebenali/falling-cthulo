#pragma strict
//Destroyer
//Put this code into an empty Game Object.
//by Yves J. Albuquerque
function OnTriggerEnter (other : Collider)
{
    Destroy(other.gameObject);
}