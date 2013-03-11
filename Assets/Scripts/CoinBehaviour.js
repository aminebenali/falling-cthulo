//Playerstatus 9/2/2013
//How to use: Put this code into the coin
//What it does: Disapear and play a SFX
//Last Modified: 27/2/2013
//by Yves J. Albuquerque

#pragma strict
var pickupSound : AudioClip;
var pickupEffect : GameObject;


function OnTriggerEnter (other : Collider)
{
	PlayerStatus.coin ++;
	Instantiate (pickupEffect, transform.position, Quaternion.identity);
	audio.PlayOneShot(pickupSound);
	yield WaitForSeconds(0.1);
    renderer.enabled = false;
    enabled = false;

}