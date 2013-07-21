//LightTravel 9/4/2013
//How to use: Put this code into your Item
//What it does: Attract coins in the range and makes your char invulnerable and untouchable
//Last Modified: 20/7/2013
//by Yves J. Albuquerque
#pragma strict

class LightTravel extends MagneticBehaviour
{	
	function OnTriggerEnter (other : Collider)
	{
		if (other.CompareTag("Player"))
		{
			PlayerMovement.phantomMovement = true;
			PlayerStatus.invunerable = true;
			return;
		}

		
		if (other.CompareTag("Coin"))
		{
			super.OnTriggerEnter(other);
		}
	}
	
	function DespawnItem ()
	{
		PlayerMovement.phantomMovement = false;
		PlayerStatus.invunerable = false;
		super.DespawnItem ();
	}
}