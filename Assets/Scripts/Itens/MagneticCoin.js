#pragma strict

//Playerstatus 9/4/2013
//How to use: Put this code into your Item
//What it does: Disapear, play a SFX and has a magnet effect over coins
//Last Modified: 4/6/2013
//by Yves J. Albuquerque

class MagneticCoin extends MagneticBehaviour
{	
	function Start ()
	{
		super.Start ();
	}

	function FixedUpdate ()
	{
		super.FixedUpdate ();
	}
	
	function OnTriggerEnter (other : Collider)
	{
		super.OnTriggerEnter(other);
		if (other.CompareTag("Coin"))
		{
			atractedItemTransform = other.transform;
		}
	}
}