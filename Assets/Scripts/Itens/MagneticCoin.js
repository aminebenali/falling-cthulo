#pragma strict

//Playerstatus 9/4/2013
//How to use: Put this code into your Item
//What it does: Attract coins in the range
//Last Modified: 4/6/2013
//by Yves J. Albuquerque


class MagneticCoin extends MagneticBehaviour
{	

	function OnTriggerEnter (other : Collider)
	{
		super.OnTriggerEnter(other);
		if (other.CompareTag("Coin"))
		{
			atractedItemTransform = other.transform;
		}
	}
	
	function OnSpawned ()
	{
		if (myRenderer)
			myRenderer.enabled = true;
	}
}