//Playerstatus 9/2/2013
//How to use: Put this code into the item object
//What it does: Disapear, count ++ and play a SFX
//Last Modified: 15/2/2013
//by Yves J. Albuquerque
#pragma strict
var pickupSound : AudioClip;
var pickupEffect : GameObject;

function OnTriggerEnter (other : Collider)
{
	Instantiate (pickupEffect, transform.position, Quaternion.identity);
	audio.PlayOneShot(pickupSound);
	yield WaitForSeconds(0.1);
    //renderer.enabled = false;
    enabled = false;
}