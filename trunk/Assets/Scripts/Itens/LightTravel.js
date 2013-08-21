//LightTravel 9/4/2013
//How to use: Put this code into your Item
//What it does: Attract coins in the range and makes your char invulnerable and untouchable
//Last Modified: 24/7/2013
//by Yves J. Albuquerque
#pragma strict

class LightTravel extends MagneticBehaviour
{	
	var grayScaleEffect : GrayscaleEffect;
	var twirlEffect : TwirlEffect;
	function Start ()
	{
		grayScaleEffect = Camera.mainCamera.GetComponent(GrayscaleEffect);
		grayScaleEffect.enabled = false;
		
		twirlEffect = Camera.mainCamera.GetComponent(TwirlEffect);
		twirlEffect.enabled = false;
	}
	
	function Update ()
	{
		if (twirlEffect.enabled)
			twirlEffect.angle ++;
	}
	
	function OnTriggerEnter (other : Collider)
	{
		if (other.CompareTag("Player"))
		{
			turnInEffects();
			super.OnTriggerEnter(other);

			return;
		}

		
		if (other.CompareTag("Coin"))
		{
			super.OnTriggerEnter(other);
		}
	}
	
	function DespawnItem ()
	{
		PlayerMovement.phantomMovement = false;
		PlayerStatus.invunerable = false;
		grayScaleEffect.enabled = false;
		twirlEffect.enabled = false;

		super.DespawnItem ();
	}
	
	function turnInEffects ()
	{
		PlayerMovement.phantomMovement = true;
		PlayerStatus.invunerable = true;
			
		grayScaleEffect.enabled = true;
		twirlEffect.enabled = true;
	}
}