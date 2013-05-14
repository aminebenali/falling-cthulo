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
var pickupMegaCoinSound : AudioClip;
var pickupEffect : GameObject;
var isMegaCoin : boolean = false;
private var newMegaCoin : boolean = false;
private var timeToPitchBack : float = 0.3;

function Start ()
{
	if (isMegaCoin)
	{
		transform.localScale *= 2;
	}
}

function Update ()
{
	if (!isMegaCoin)
	{
		if (!newMegaCoin)
		{
			if (pitch > 2.8)
			{
				newMegaCoin = true;
				transform.localScale *= 2;
				timeToPitchBack = 3;
			}
		}
		else
			if (pitch < 2.8)
			{
				newMegaCoin = false;
				transform.localScale /= 2;
				timeToPitchBack = 0.3;
			}
	}
}

function OnTriggerEnter (other : Collider)
{
	if (!other.CompareTag("Player"))
		return;
	var actualTime : float = Time.time;
	
	if (actualTime - timeFromLastCoin < timeToPitchBack)
	{
		pitch += 0.3;
		coinMultiplyier ++;
	}
	else
	{
		coinMultiplyier = 1;
		pitch = 1;
	}
	

	
	Instantiate (pickupEffect, transform.position, Quaternion.identity);
	audio.pitch = pitch;
	audio.PlayOneShot(pickupSound);
	if (newMegaCoin || isMegaCoin)
	{
		coinMultiplyier = 10;
		audio.PlayOneShot(pickupMegaCoinSound);
	}
	
	PlayerStatus.coins += coinMultiplyier;
	//yield WaitForSeconds(0.1);

    renderer.enabled = false;
    enabled = false;
    
    timeFromLastCoin = Time.time;
}