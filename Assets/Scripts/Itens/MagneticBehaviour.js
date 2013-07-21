//Playerstatus 2/4/2013
//How to use: Put this code into your Item
//What it does: Align with Player, set a radius and move atractedObject to player position
//Last Modified: 20/7/2013
//by Yves J. Albuquerque
#pragma strict

class MagneticBehaviour extends ItemBehaviour
{	
	protected var playerPosition : Transform;
	protected var myTransform : Transform;
	protected var atractedItemTransform : Transform;
	protected var sphereCollider : SphereCollider;
	
	public var colliderRadius : float = 10;
	
	public var duration:float = 30;
	public var timer:float = 0;
	
	private var withPlayer : boolean;

	function Start ()
	{
		sphereCollider = GetComponent(SphereCollider);
		myTransform = transform;
	}
		
		
	function Update ()
	{
		timer += Time.deltaTime;
		if (timer > duration)
			DespawnItem ();
	}
	
	function FixedUpdate ()
	{
		if (withPlayer)
			transform.position = playerPosition.position;
	
		if (atractedItemTransform)
		{	
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
		super.OnTriggerEnter(other);
		
		if (!withPlayer)
		{
			if (other.CompareTag("Player"))
			{
				withPlayer = true;
				sphereCollider.radius = 8;
				return;
			}
		}
		
		atractedItemTransform = other.transform;

	}
	
	function OnSpawned ()
	{
		super.OnSpawned();
		sphereCollider.radius = 1;
	}
	
	function DespawnItem ()
	{
		withPlayer = false;
		PoolManager.Pools["Itens"].Despawn(transform);
	}
}