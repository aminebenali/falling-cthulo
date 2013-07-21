//Playerstatus 9/4/2013
//How to use: Put this code into your Item
//What it does: Attract coins in the range
//Last Modified: 20/7/2013
//by Yves J. Albuquerque
#pragma strict

class MagneticCoin extends MagneticBehaviour
{	
	function OnTriggerEnter (other : Collider)
	{
		if (other.CompareTag("Player"))
		{
			super.OnTriggerEnter(other);

			return;
		}
	
		if (other.CompareTag("Coin"))
		{
			super.OnTriggerEnter(other);
		}
	}
}