//Level Manager 31/1/2013
//How to use: Put this code into a Game Manager Object
//What it does: Level and Game Manager
//Last Modified: 19/3/2013
//by Yves J. Albuquerque

#pragma strict

class Sequences
{
	var gameObject : GameObject;
	var distanceToThisSequence : int;
	var coinsToThisSequence : int;
	var done : boolean;
}

class Level
{
	var lvlName : String;
	var sequences : Sequences[];
	var obstacleParts : GameObject[]; //Put here all Obstacles
	var groundParts : GameObject[]; //Put here all ground islands. The pivot must be at the top of the Object
	var mountainParts : GameObject[]; //Put the mountains here. The pivot must be at the bottom
	var detailParts : GameObject[]; //Put here all Rocks, Walls and other Detail
	var distanceToNextLevel : int; //Put here how many coins you need to preceed to next level
}

static var actualLevelIndex : int = 0; //Current Level
static var menuMode : boolean = false; // Menu Mode On/Off
var debugMode : boolean = false; // Debug Mode ignores Menu screen

var menu : GameObject;
var distanceBetweenGround : float = 200; //Distance between ground parts
var distanceBetweenMountain : float = 50; //Distance between Mountain parts
var maxDistanceBetweenDetail : float = 200; //Max Distance between Details
var minDistanceBetweenDetail : float = 1;// Min Distance between Details
var maxDistanceBetweenObstacles : float = 50; //Max Distance between Obstacles
var minDistanceBetweenObstacles : float = 1;// Min Distance between Obstacles

var levels : Level[]; //Put here all cenario sequences

private var nextGround : float = -1;
private var nextMountain : float = -1;
private var nextDetail : float = -1;
private var nextObstacle : float = 200;

private var cthuloCamera : Camera; //Main Camera Reference
private var player : Transform; //Player Transform reference
private var actualLevel : Level;// Current Level
private var depth : float = 200; //Default cenario sequence depth
private var depthMultiplyer : float = 0; // Works like an index to depth control

private var vignet : Vignetting; //Vignet Reference
private var playerMovement : PlayerMovement;//PlayerMovement script Reference
private var playerMovementOnMenu : PlayerMovementOnMenu;//PlayerMovementOnMenu script Reference
private var playerStatus : PlayerStatus;//PlayerStatus script Reference
private var smoothFollowCthulo : SmoothFollowCthulo;//PlayerMovement script Reference
private var lvlNameDisplay : GUIText;//LvlName Reference
private var cthuloAlive : SkinnedMeshRenderer;//SkennedMeshRenderer Reference




function Awake ()
{
	menuMode = !debugMode;
	cthuloCamera = Camera.mainCamera;
	player = GameObject.FindGameObjectWithTag("Player").transform;
	lvlNameDisplay = GameObject.FindObjectOfType(GUIText);

	
	playerMovement = player.GetComponent(PlayerMovement);
	playerStatus = player.GetComponent(PlayerStatus);
	playerMovementOnMenu = player.GetComponent(PlayerMovementOnMenu);
	cthuloAlive = GameObject.FindObjectOfType(SkinnedMeshRenderer);

	vignet = cthuloCamera.GetComponent(Vignetting);
	smoothFollowCthulo = cthuloCamera.GetComponent(SmoothFollowCthulo);
	
	if (menuMode)
	{
 		Instantiate (menu, cthuloCamera.transform.position + Vector3(0,0,5), Quaternion.identity);
		smoothFollowCthulo.enabled = false;
		playerMovementOnMenu.enabled = true;
		player.position = Vector3 (Random.Range(-20,20), Random.Range(-5,20), Random.Range(-15,15));
	}
	else
	{
		smoothFollowCthulo.enabled = true;
		playerMovementOnMenu.enabled = false;
	}

}

function Start ()
{
	actualLevel = levels[actualLevelIndex];
	Reset ();
}

function Update ()
{
	if (menuMode)
	{
		smoothFollowCthulo.enabled = false;
		playerMovementOnMenu.enabled = true;
		return;
	}
	else
	{
		smoothFollowCthulo.enabled = true;
		playerMovementOnMenu.enabled = false;
	}

	if (actualLevel.distanceToNextLevel < player.position.z)
	{
		actualLevelIndex ++;
		actualLevel = levels[actualLevelIndex];
		DisplayLevelName ();
	}
		
	if (player.position.z > nextGround)
	{
		nextGround += distanceBetweenGround;
		NewGround ();
	}
	
	if (player.position.z > nextMountain)
	{
		nextMountain += distanceBetweenMountain;
		NewMountain ();
	}
	
	if (player.position.z > nextDetail)
	{
		NewDetail ();
		nextDetail += Random.Range(minDistanceBetweenDetail, maxDistanceBetweenDetail);;
	}
	
	if (player.position.z > nextObstacle)
	{
		NewObstacle ();
		nextObstacle += Random.Range(minDistanceBetweenObstacles, maxDistanceBetweenObstacles);;
	}
}

function Reset ()
{
	Instantiate (actualLevel.groundParts[Random.Range(0,actualLevel.groundParts.Length)],Vector3(0,-5,player.position.z + 125),Quaternion.identity);
	Instantiate (actualLevel.mountainParts[Random.Range(0,actualLevel.mountainParts.Length)],Vector3(0, -5 ,player.position.z),Quaternion.identity);
	Instantiate (actualLevel.detailParts[Random.Range(0,actualLevel.detailParts.Length)],Vector3 (Random.Range(-10,10),-5, Random.Range(0,200)),Quaternion.identity);
}

function NewGround ()
{
	Instantiate (actualLevel.groundParts[Random.Range(0,actualLevel.groundParts.Length)],Vector3(0,-5,nextGround + 125),Quaternion.identity);
}

function NewMountain ()
{
	Instantiate (actualLevel.mountainParts[Random.Range(0,actualLevel.mountainParts.Length)],Vector3(0, -5 ,nextMountain),Quaternion.identity);
}

function NewDetail ()
{
	var detail : GameObject;
	var hit : RaycastHit;
	var detailPosition : Vector3;
	

    if (Physics.Raycast (Vector3(Random.Range(-15,15), 50, player.position.z + 197), -Vector3.up, hit))
    {
        detailPosition = hit.point;
		detail = Instantiate (actualLevel.detailParts[Random.Range(0,actualLevel.detailParts.Length)],detailPosition,Quaternion.identity);
		detail.transform.localEulerAngles.y += Random.Range(0,360);
	}
}

function NewObstacle ()
{
	var obstacle : GameObject;
	var hit : RaycastHit;
	var obstaclePosition : Vector3;
	

    if (Physics.Raycast (Vector3(Random.Range(-15,15), 50, player.position.z + 200), -Vector3.up, hit))
    {
    	if (hit.collider.CompareTag("Terrain"))
    	{
	        obstaclePosition = hit.point;
			obstacle = Instantiate (actualLevel.obstacleParts[Random.Range(0,actualLevel.obstacleParts.Length)],obstaclePosition,Quaternion.identity);
		}
	}
}

function DisplayLevelName ()
{
	lvlNameDisplay.text = actualLevel.lvlName;
	iTween.ColorTo(lvlNameDisplay.gameObject, {"a": 1, "time" : 2f});
	iTween.ColorTo(lvlNameDisplay.gameObject, {"a": 0, "time" : 2f, "delay" : 3f});

}

 function OnGUI ()
 {
 	if (!playerStatus.isDead)
 		return;
 	GUILayout.BeginArea(Rect (Screen.width/2, Screen.height/2, Screen.width/3,Screen.height/3));
 	GUILayout.Label("Total Distance: " + player.position.z);
 	GUILayout.Label("Total Coins: " + playerStatus.coins);

 	if (GUILayout.Button("Continue"))
 	{
 		cthuloAlive.active = true;
 		playerStatus.Reset();
    }
    
    if (GUILayout.Button("Return to Menu"))
 	{
 		cthuloAlive.active = true;
 	 	menuMode = true;
 		SendMessageUpwards("Reset");
 		Instantiate (menu, cthuloCamera.transform.position + Vector3(0,0,5), Quaternion.identity);

    }
 	GUILayout.EndArea();
 }
 
 function OnDeath ()
{
	cthuloAlive.active = false;
}