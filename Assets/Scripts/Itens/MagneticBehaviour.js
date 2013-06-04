#pragma strict
//Playerstatus 2/4/2013
//How to use: Put this code into your Item
//What it does: Align with Player, set a radius and move atractedObject to player position
//Last Modified: 4/6/2013
//by Yves J. Albuquerque

class MagneticBehaviour extends ItemBehaviour
{	
	protected var playerPosition : Transform;
	protected var myTransform : Transform;
	protected var atractedItemTransform : Transform;
	protected var sphereCollider : SphereCollider;
	
	public var colliderRadius : float = 10;

	function Start ()
	{
		sphereCollider = GetComponent(SphereCollider);
		myTransform = transform;
	}
		
	function FixedUpdate ()
	{
		if (playerPosition && atractedItemTransform)
		{
			if (atractedItemTransform.renderer.enabled == false)
				return;
				
			if (atractedItemTransform.rigidbody)
				atractedItemTransform.rigidbody.AddForce (atractedItemTransform.position - transform.position);
			else
				atractedItemTransform.Translate (atractedItemTransform.position - transform.position);
		}
	}
	
	function OnTriggerEnter (other : Collider)
	{
		sphereCollider.radius = 8;
		if (other.CompareTag("Player"))
		{
			playerPosition = other.transform;
			transform.position = other.transform.position;
			transform.parent = playerPosition;
		}
	}
}