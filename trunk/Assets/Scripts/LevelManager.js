//Level Manager 31/1/2013
//How to use: Put this code into your player prefab
//What it does: Move the character to the sides when acelerates and apply gravity. Also constraits the character.
//Last Modified: 31/1/2013
//by Yves J. Albuquerque

#pragma strict

var parts : GameObject[]; //Put here all cenario sequences
var depth : float = 100; //Default cenario sequence depth
private var depthMultiplyer = 0; // Works like an index to depth control

function Start ()
{
	NewPart();
	NewPart();
}

function Update ()
{
	
}

function NewPart ()
{
	Instantiate (parts[Random.Range(0,parts.Length)],Vector3(0,0,depthMultiplyer*depth),Quaternion.identity);
	depthMultiplyer ++;
	transform.position.z = depth * (depthMultiplyer-1);
}

function OnTriggerEnter (other : Collider)
{
	NewPart();
}