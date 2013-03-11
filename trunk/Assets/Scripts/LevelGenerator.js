//Level Generator 11/2/2013
//How to use: Put this code into a scene sequence
//What it does: Generate Details, and mountains around sequence
//Last Modified: 15/2/2013
//by Yves J. Albuquerque

#pragma strict

var groundParts : GameObject[]; //Put here all ground islands. The pivot must be at the top of the Object
var maxgroundParts : int = 3; //How many ground islands per sequence? Each island has a different height to prevent flickening.
var mountainParts : GameObject[]; //Put the mountains here. The pivot must be at the bottom
var maxMauntainsParts : int = 10; //How many details per sequence?
var groundDetailParts : GameObject[]; //Put here all Rocks, Walls and other Detail
var maxDetailParts : int = 30; //How many details per sequence?
var coinPrefab : GameObject; //Coin Prefab
var itemPrefab : GameObject; //Item Prefab
private var coins : GameObject[]; //Coins
private var itens : GameObject[]; //Itens



function Start ()
{
	coins = GameObject.FindGameObjectsWithTag("Coin");
	itens = GameObject.FindGameObjectsWithTag("Item");
	yield; //wait a cycle - performance tweak
	NewGroundDetails ();
}

function NewGroundDetails ()
{
	var ground : GameObject;
	var detail : GameObject;
	var mountain : GameObject;
	var tempCoin : GameObject;
	var tempItem : GameObject;

	var outSidePosX : float;
	
	for (var i = 0; i < maxgroundParts; i++)
	{
		ground = Instantiate (groundParts[Random.Range(0,groundParts.Length)],Vector3(Random.Range(-5, 5), Random.Range(-4.5,-5) -i,transform.position.z + Random.Range(0, 100)),Quaternion.identity);
		ground.transform.localScale += Vector3 (Random.Range(2,5+(2*i)),Random.Range(2,5+(2*i)),Random.Range(2,5+(2*i)));
		ground.transform.localEulerAngles.y += Random.Range(0,360);
		//ground.transform.parent = transform;
	}
	
	for (i = 0; i < maxDetailParts; i++)
	{
		detail = Instantiate (groundDetailParts[Random.Range(0,groundDetailParts.Length)],Vector3(Random.Range(-15, 15),-5,transform.position.z + Random.Range(0, 100)),Quaternion.identity);
		detail.transform.localScale += Vector3 (Random.Range(0.5,1.5),Random.Range(0.5,1.5),Random.Range(0.5,1.5));
		detail.transform.localEulerAngles.y += Random.Range(0,360);
		//detail.transform.parent = transform;
	}
	
	for (i = 0; i < maxMauntainsParts; i++)
	{
		do{
			outSidePosX = Random.Range(-40, 40);
		}while (outSidePosX < 25 && outSidePosX > -25);
		mountain = Instantiate (mountainParts[Random.Range(0,mountainParts.Length)],Vector3(outSidePosX,-5,transform.position.z + Random.Range(0, 100)),Quaternion.identity);
		mountain.transform.localScale += Vector3 (Random.Range(1,9),Random.Range(1,9),Random.Range(1,9));
		mountain.transform.localEulerAngles.y += Random.Range(0,360);
		//mountain.transform.parent = transform;
	}
	
	for (i = 0; i < coins.Length; i++)
	{
		tempCoin = Instantiate (coinPrefab, coins[i].transform.position, Quaternion.identity);
		//tempCoin.transform.parent = transform;
	}
	
	for (i = 0; i < itens.Length; i++)
	{
		tempItem = Instantiate (itemPrefab, itens[i].transform.position, Quaternion.identity);
		//tempItem.transform.parent = transform;
	}
}
