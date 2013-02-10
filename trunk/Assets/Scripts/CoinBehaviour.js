#pragma strict
var pickupSound : AudioClip;
var pickupEffect : GameObject;

function OnTriggerEnter (other : Collider)
{
	PlayerStatus.coin ++;
	Instantiate (pickupEffect, transform.position, Quaternion.identity);
	audio.PlayOneShot(pickupSound);
	yield WaitForSeconds(0.2);
    Destroy(gameObject);
}