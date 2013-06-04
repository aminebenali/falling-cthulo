#pragma strict
//Playerstatus 2/4/2013
//How to use: Put this code into your Item
//What it does: Disapear, play a SFX and reduce your velocity by half
//Last Modified: 2/4/2013
//by Yves J. Albuquerque

class Deboost extends ItemBehaviour
{
	function OnTriggerEnter (other : Collider)
	{
		if (other.CompareTag("Player"))
		{
			super.OnTriggerEnter(other);
			GameObject.FindGameObjectWithTag("Player").GetComponent(PlayerMovement).zSpeed /= 2;
		}
	}
}