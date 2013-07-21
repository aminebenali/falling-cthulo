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
		super.Start ();
		OnSpawned();
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
			transform.position = playerPosition.position + 3*Vector3.forward;
	
		if (atractedItemTransform)
		{	
			if (atractedItemTransform.rigidbody)
			{
				atractedItemTransform.rigidbody.AddForce (transform.position - atractedItemTransform.position);
			}
			else
			{
				var directionToGo : Vector3 = transform.position - atractedItemTransform.position;
				atractedItemTransform.Translate (directionToGo.normalized, Space.World);
			}
		}
	}
	
	function OnTriggerEnter (other : Collider)
	{
		super.OnTriggerEnter(other);
		print (withPlayer);

		if (!withPlayer)
		{

			if (other.CompareTag("Player"))
			{
				withPlayer = true;
				sphereCollider.radius = 8;
				playerPosition = other.transform;
				return;
			}
			
		}
		
		atractedItemTransform = other.transform;
	}
	
	function OnSpawned ()
	{
		super.OnSpawned();
		if (!myTransform)
			myTransform = transform;

		if (!sphereCollider)
			sphereCollider = GetComponent(SphereCollider);

		sphereCollider.radius = 1;
	}
	
	function DespawnItem ()
	{
		withPlayer = false;
		PoolManager.Pools["Itens"].Despawn(transform);
	}
}