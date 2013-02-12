//Level Manager 31/1/2013
//How to use: Put this code into a Game Manager Object
//What it does: Creates a sequence and put some markers
//Last Modified: 11/2/2013
//by Yves J. Albuquerque

#pragma strict

var sequence : GameObject[]; //Put here all cenario sequences
var placa : GameObject; //Marcador de Distancia
private var depth : float = 100; //Default cenario sequence depth
private var depthMultiplyer : float = 0; // Works like an index to depth control
private var lastPart : GameObject; //Last Instantiated sequence

function Start ()
{
	NewMarkers ();
	NewPart();
	NewMarkers ();
	NewPart();
}

function NewPart ()
{
	lastPart = Instantiate (sequence[Random.Range(0,sequence.Length)],Vector3(0,0,depthMultiplyer*depth),Quaternion.identity);
	depthMultiplyer ++;
	transform.position.z = depth * (depthMultiplyer-1);
}

function NewMarkers ()
{
	for (var i = 0; i < 9; i++)
	{
		lastPart = Instantiate (placa,Vector3(-7,-5,(depthMultiplyer*depth) + (i*10)),Quaternion.identity);
		lastPart = Instantiate (placa,Vector3(7,-5,(depthMultiplyer*depth) + (i*10)),Quaternion.identity);
	}
}

function OnTriggerEnter (other : Collider)
{
	NewMarkers ();
	NewPart();
}

function OnDeath ()
{
	var sequences : GameObject[];
	sequences = GameObject.FindGameObjectsWithTag("Sequence");
	for (var i : int = 0; i < sequences.Length;i++)
		Destroy(sequences[i].transform.root.gameObject);
		
	depthMultiplyer = 0;
	NewPart();
	NewPart();
}