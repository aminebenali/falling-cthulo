#pragma strict

class LightTravel extends MagneticBehaviour
{	
	
	function OnTriggerEnter (other : Collider)
	{
		super.OnTriggerEnter(other);
		
		PlayerMovement.phantomMovement = true;
		PlayerStatus.invunerable = true;
		
		if (other.CompareTag("Coin"))
		{
			atractedItemTransform = other.transform;
		}
	}
	
	function DespawnItem ()
	{
		PlayerMovement.phantomMovement = false;
		PlayerStatus.invunerable = false;
		super.DespawnItem ();
	}
}