#pragma strict

//Playerstatus 9/4/2013
//How to use: Put this code into your Item
//What it does: Disapear, play a SFX and has a magnet effect over coins
//Last Modified: 9/4/2013
//by Yves J. Albuquerque

class MagneticCoin extends Collectors
{	
	private var sphereCollider : SphereCollider;
	private var myTransform : Transform;

	function Start ()
	{
		sphereCollider = GetComponent(SphereCollider);
		myTransform = transform;
	}
	
	function FixedUpdate ()
	{
		//if (!playerPosition)
			//rigidbody.AddForce (playerPosition.position - transform.position);
	}
	function OnTriggerEnter (other : Collider)
	{
		super.OnTriggerEnter(other);
		sphereCollider.radius = 8;
		if (other.CompareTag("Coin"))
		{
			iTween.MoveTo (other.gameObject, {"position" : playerPosition, "Time" : 1, "easetype" : "easeInQuad"});
		}
	}
}