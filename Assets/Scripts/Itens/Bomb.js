//Bomb 26/5/2013
//How to use: Put this code into your Bomb prefab
//What it does: Explodes
//Last Modified: 26/5/2013
//by Yves J. Albuquerque

#pragma strict
var explosionEffect : ParticleSystem;
var explosionSound : AudioClip; //Not working yet

function OnTriggerEnter (collider : Collider)
{
	if (collider.tag == "Player")
	{
		var dir = collider.transform.position - transform.position;
		PoolManager.Pools["Effects"].Spawn(explosionEffect, transform.position,transform.rotation);
		transform.position.y = -1000;
		collider.GetComponent(PlayerStatus).ReceiveDamage(80);
		collider.GetComponent(PlayerMovement).AddImpact(dir, 160);
	}
}