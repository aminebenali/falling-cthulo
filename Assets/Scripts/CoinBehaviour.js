//Playerstatus 9/2/2013
//How to use: Put this code into the coin
//What it does: Disapear and play a SFX
//Last Modified: 2/4/2013
//by Yves J. Albuquerque

#pragma strict
static var pitch : float;
static var timeFromLastCoin : float;
static var coinMultiplyier : int = 1;

var pickupSound : AudioClip;
var pickupEffect : GameObject;

function OnTriggerEnter (other : Collider)
{
	var actualTime : float = Time.time;
	if (actualTime - timeFromLastCoin < 0.3)
	{
		pitch += 0.3;
		coinMultiplyier ++;
	}
	else
	{
		coinMultiplyier = 1;
		pitch = 1;
	}

	PlayerStatus.coins += coinMultiplyier;
	Instantiate (pickupEffect, transform.position, Quaternion.identity);
	audio.pitch = pitch;
	audio.PlayOneShot(pickupSound);
	yield WaitForSeconds(0.1);
    renderer.enabled = false;
    enabled = false;
    
    timeFromLastCoin = Time.time;
}