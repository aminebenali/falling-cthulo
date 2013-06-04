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
	
	public var duration:float = 30;
	public var timer:float = 0;
	public var dontTurnOff:boolean;

	function Start ()
	{
		sphereCollider = GetComponent(SphereCollider);
		myTransform = transform;
	}
		
		
	function Update ()
	{
		if (!dontTurnOff)
			timer += Time.deltaTime;
		if (timer > duration)
			DespawnItem ();
	}
	
	function DespawnItem ()
	{
		transform.parent = null;
		PoolManager.Pools["Itens"].Despawn(transform);
	}
	
	function FixedUpdate ()
	{
		if (playerPosition && atractedItemTransform)
		{
			if (atractedItemTransform.renderer.enabled == false)
				return;
				
			if (atractedItemTransform.rigidbody)
			{
				atractedItemTransform.rigidbody.AddForce (transform.position - atractedItemTransform.position);
			}
			else
			{
				atractedItemTransform.Translate (transform.position - atractedItemTransform.position, Space.World);
			}
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