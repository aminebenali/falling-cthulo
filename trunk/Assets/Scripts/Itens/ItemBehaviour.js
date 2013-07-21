//Playerstatus 9/2/2013
//How to use: Put this code into the item object
//What it does: Disappear, spawn pickupeffect and play a pickup SFX. ABSTRACT Class. That means: Other classes inherit
//Last Modified: 20/7/2013
//by Yves J. Albuquerque
#pragma strict

var pickupSound : AudioClip;
var pickupEffect : GameObject;
protected var myRenderer : Renderer;

function Start ()
{
	if (!renderer)
		myRenderer = GetComponentInChildren(Renderer);
	else
		myRenderer = renderer;
}

function OnTriggerEnter (other : Collider)
{
	if (other.CompareTag("Player"))
	{
		PoolManager.Pools["Effects"].Spawn(pickupEffect.transform, transform.position, Quaternion.identity);
		audio.PlayOneShot(pickupSound);

		if (renderer)
			myRenderer = renderer;
		
		myRenderer.enabled = false;		
	}
}

function OnSpawned ()
{
	if (myRenderer)
		myRenderer.enabled = true;
}