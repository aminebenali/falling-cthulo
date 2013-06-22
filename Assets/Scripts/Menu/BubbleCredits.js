//SmoothFollowCthulo 08/03/2013
//How to use: Put this code into yout bubble with a 3d text and a particle parented
//What it does: Animates the bubble
//Last Modified: 18/06/2013
//by Yves J. Albuquerque

#pragma strict
var miniBubbles :ParticleSystem;
var greatGuy : Renderer;

function Start ()
{
	miniBubbles = GetComponentInChildren(ParticleSystem);
	greatGuy = transform.GetComponentInChildren(TextMesh).renderer;
	
	miniBubbles.Pause();
	greatGuy.enabled = false;
	
	iTween.MoveTo(gameObject,{"x" : Random.Range(-15,15) ,"y":Random.Range(-2,10),"time":Random.Range(2,6) , "delay":Random.Range(0,4), "easetype":iTween.EaseType.easeOutBack, "oncomplete": "BubbleExplosion"});
}

function Update ()
{
}

function BubbleExplosion ()
{
	renderer.enabled = false;
	greatGuy.enabled = true;
	miniBubbles.Play();
	yield WaitForSeconds(5);
	iTween.MoveTo(gameObject,{"y":15,"time":Random.Range(3,8) , "delay":Random.Range(0,3), "easetype":iTween.EaseType.easeInQuad});
	yield WaitForSeconds(12);
	Destroy (gameObject);

}