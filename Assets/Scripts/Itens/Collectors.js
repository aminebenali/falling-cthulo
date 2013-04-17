#pragma strict
//Playerstatus 2/4/2013
//How to use: Put this code into your Item
//What it does: Disapear, play a SFX and reduce your velocity by half
//Last Modified: 9/4/2013
//by Yves J. Albuquerque

class Collectors extends ItemBehaviour
{	
	protected var playerPosition : Transform;

	function OnTriggerEnter (other : Collider)
	{
		super.OnTriggerEnter(other);

		if (other.CompareTag("Player"))
		{
			playerPosition = other.transform;
			transform.position = other.transform.position;
			transform.parent = playerPosition;
			//renderer.enabled = false;
		}
	}
}