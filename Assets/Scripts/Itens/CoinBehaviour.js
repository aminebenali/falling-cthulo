#pragma strict

//Playerstatus 9/2/2013
//How to use: Put this code into the coin
//What it does: Disapear and play a SFX
//Last Modified: 4/6/2013
//by Yves J. Albuquerque


class CoinBehaviour extends ItemBehaviour
{
	
	static var pitch : float;
	static var timeFromLastCoin : float;
	static var coinMultiplyier : int = 1;
	static var timeToPitchBack : float = 0.4;
	static var isBigCoin : boolean = false;
	static var oldIsBigCoin : boolean = false;
	static var colliderSize : float;
	
	private var localPosition : Vector3;
	var pickupBigCoinSound : AudioClip;
	
	function Start ()
	{
		localPosition = transform.localPosition;
	}
	
	function Update ()
	{
		var actualTime : float = Time.time;
	
		if (isBigCoin && transform.localScale.x != 2)
		{
			transform.localScale.x = 2;
			transform.localScale.y = 2;
			transform.localScale.z = 2;
		}
		if (!isBigCoin && transform.localScale.x != 0.5)
		{
			transform.localScale.x = 0.5;
			transform.localScale.y = 0.5;
			transform.localScale.z = 0.5;
		}
		
		if (!isBigCoin)
		{
			if (pitch > 2.8)
			{
				GoingBig ();
			}
		}
		else if (pitch < 2.8)
		{
			GoingSmall ();
		}
		
		if (actualTime - timeFromLastCoin > timeToPitchBack)
		{
			pitch = 1;
		}
	}
	
	function OnTriggerEnter (other : Collider)
	{
		if (!other.CompareTag("Player"))
			return;

		super.OnTriggerEnter(other);
	
		audio.pitch = pitch;
		
		if (isBigCoin)
		{
			audio.PlayOneShot(pickupBigCoinSound);
		}
		
		PlayerStatus.coins += coinMultiplyier;
		    
	  	if (!isBigCoin)
	  		pitch += 0.4;
	
	    timeFromLastCoin = Time.time;
	}
	
	
	function OnSpawned ()
	{
		if (!renderer.enabled)
		{
	   		renderer.enabled = true;
		}
		if (isBigCoin && transform.localScale.x != 2)
		{
			transform.localScale.x = 2;
			transform.localScale.y = 2;
			transform.localScale.z = 2;
		}
	}
	
	function OnDespawned ()
	{
		if (!isBigCoin && transform.localScale.x != 0.5)
		{
			transform.localScale.x = 0.5;
			transform.localScale.y = 0.5;
			transform.localScale.z = 0.5;
		}
		
		transform.localPosition = localPosition;
	}
	
	function GoingBig()
	{
		isBigCoin = true;
		timeToPitchBack = 3;
		coinMultiplyier = 10;
	}
	
	function GoingSmall()
	{
		isBigCoin = false;
		timeToPitchBack = 0.4;
		coinMultiplyier = 1;
	}
}