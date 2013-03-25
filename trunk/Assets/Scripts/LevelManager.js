//Level Manager 31/1/2013
//How to use: Put this code into a Game Manager Object
//What it does: Level and Game Manager
//Last Modified: 21/3/2013
//by Yves J. Albuquerque

#pragma strict

class LandMarks
{
	var gameObject : GameObject;
	var distanceToThisLandMark : int;
	var coinsToThisLandMark : int;
	var done : boolean;
}

class Obstacle
{
	var gameObject : GameObject;
	var minimalDistanceToNextObstacle : float;
}

class Level
{
	var lvlName : String;
	var landMark : LandMarks[];
	var obstacleParts : Obstacle[]; //Put here all Obstacles
	var groundParts : GameObject[]; //Put here all ground islands. The pivot must be at the top of the Object
	var mountainParts : GameObject[]; //Put the mountains here. The pivot must be at the bottom
	var detailParts : GameObject[]; //Put here all Rocks, Walls and other Detail
	var distanceToNextLevel : int; //Put here how many coins you need to preceed to next level
}

static var actualLevelIndex : int = 0; //Current Level
static var menuMode : boolean = false; // Menu Mode On/Off
static var startedGame : boolean = false;//true is the game has already started
var debugMode : boolean = false; // Debug Mode ignores Menu screen

var menu : GameObject;
var distanceBetweenGround : float = 200; //Distance between ground parts
var distanceBetweenMountain : float = 50; //Distance between Mountain parts
var maxDistanceBetweenDetail : float = 200; //Max Distance between Details
var minDistanceBetweenDetail : float = 1;// Min Distance between Details
var maxDistanceBetweenObstacles : float = 50; //Max Distance between Obstacles
var minDistanceBetweenObstacles : float = 1;// Min Distance between Obstacles

var levels : Level[]; //Put here all cenario landMark

private var nextGround : float = -1;
private var nextMountain : float = -1;
private var nextDetail : float = -1;
private var nextObstacle : float = 200;

private var myCamera : Camera; //Main Camera Reference
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
private var lastObstacle : Obstacle;





function Awake ()
{
	menuMode = !debugMode;
	myCamera = Camera.mainCamera;
	player = GameObject.FindGameObjectWithTag("Player").transform;
	lvlNameDisplay = GameObject.FindObjectOfType(GUIText);

	
	playerMovement = player.GetComponent(PlayerMovement);
	playerStatus = player.GetComponent(PlayerStatus);
	playerMovementOnMenu = player.GetComponent(PlayerMovementOnMenu);
	cthuloAlive = GameObject.FindObjectOfType(SkinnedMeshRenderer);

	vignet = myCamera.GetComponent(Vignetting);
	smoothFollowCthulo = myCamera.GetComponent(SmoothFollowCthulo);
	
	if (menuMode)
	{
 		Instantiate (menu, myCamera.transform.position + Vector3(0,0,7), Quaternion.identity);
		smoothFollowCthulo.enabled = false;
		playerMovement.enabled = false;
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
	lvlNameDisplay.material.color.a = 0;
	Reset ();
}

function Update ()
{
	if (menuMode)
	{
		playerStatus.invunerable = true;
		smoothFollowCthulo.enabled = false;
		playerMovementOnMenu.enabled = true;
		return;
	}

	if (actualLevel.distanceToNextLevel < player.position.z)
	{
		actualLevelIndex ++;
		if (actualLevelIndex > levels.Length)
		{
			actualLevelIndex = 0;
			for (var i:int = 0; i < levels.Length; i++)
				levels[i].distanceToNextLevel += player.position.z;
		}
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
		nextObstacle += Random.Range(lastObstacle.minimalDistanceToNextObstacle, maxDistanceBetweenObstacles);;
	}
}

function Reset ()
{
	Instantiate (actualLevel.groundParts[Random.Range(0,actualLevel.groundParts.Length)],Vector3(0,-5,125),Quaternion.identity);
	Instantiate (actualLevel.mountainParts[Random.Range(0,actualLevel.mountainParts.Length)],Vector3(0, -5 ,0),Quaternion.identity);
	Instantiate (actualLevel.detailParts[Random.Range(0,actualLevel.detailParts.Length)],Vector3 (Random.Range(-10,10),-5, Random.Range(0,200)),Quaternion.identity);
	Instantiate (actualLevel.detailParts[Random.Range(0,actualLevel.detailParts.Length)],Vector3 (Random.Range(-10,10),-5, Random.Range(0,200)),Quaternion.identity);
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
	var hit : RaycastHit;
	var obstaclePosition : Vector3;
	

    if (Physics.Raycast (Vector3(Random.Range(-15,15), 50, player.position.z + 200), -Vector3.up, hit))
    {
    	if (hit.collider.CompareTag("Terrain"))
    	{
	        obstaclePosition = hit.point;
			lastObstacle = actualLevel.obstacleParts[Random.Range(0,actualLevel.obstacleParts.Length)];
			Instantiate (lastObstacle.gameObject,obstaclePosition,Quaternion.identity);
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
	var windowRect : Rect;
 	if (!playerStatus.isDead)
 		return;
 	windowRect = Rect (Screen.width/4, Screen.height/4, Screen.width/2, Screen.height/2);

 	GUILayout.BeginArea(windowRect);
 	GUILayout.Label("Total Distance: " + player.position.z);
 	GUILayout.Label("Total Coins: " + playerStatus.coins);

 	if (GUILayout.Button("Continue"))
 	{
		OnAlive();
    }
    
    if (GUILayout.Button("Return to Menu"))
 	{
 		cthuloAlive.active = true;
 	 	menuMode = true;
 		SendMessageUpwards("Reset");
 		Instantiate (menu, myCamera.transform.position + Vector3(0,0,5), Quaternion.identity);
    }
 	GUILayout.EndArea();
}

function WannaPlay ()
{
	var wantedPlayerPosition : Vector3;
	var wantedCameraPosition : Vector3;
	wantedPlayerPosition = player.position;
	wantedPlayerPosition.x = 0;
	wantedPlayerPosition.y = 0;
	if (startedGame == false)
	{
		wantedPlayerPosition.z = 0;
		startedGame = true;
	}
	
	wantedCameraPosition = Vector3(wantedPlayerPosition.x,wantedPlayerPosition.y + smoothFollowCthulo.height,wantedPlayerPosition.z - smoothFollowCthulo.distance);

		
	playerMovementOnMenu.enabled = false;
	iTween.MoveTo(player.gameObject, {"position":wantedPlayerPosition, "time":3f, "easetype":"easeOutQuint"});
	iTween.RotateTo(player.gameObject, {"rotation":Vector3.forward, "time":3f,"easetype":"easeOutQuint"});
	iTween.MoveTo(myCamera.gameObject, {"position":wantedCameraPosition, "time":3f,"easetype":"easeInOutCubic", "oncomplete":"TurnOffMenu", "oncompletetarget":gameObject});
	iTween.LookTo(myCamera.gameObject, {"looktarget": myCamera.transform.position - (wantedCameraPosition - (wantedPlayerPosition + smoothFollowCthulo.target.localPosition)),"time":3f,"easetype":"easeInOutCubic"});
	yield WaitForSeconds (3);
	DisplayLevelName ();
	playerMovement.enabled = true;
	playerStatus.invunerable = false;
	smoothFollowCthulo.enabled = true;
}
 
function OnDeath ()
{
	cthuloAlive.active = false;
	smoothFollowCthulo.enabled = false;
	iTween.MoveTo(myCamera.gameObject, {"x":0,"y":0,"time":3f,"easetype":"easeInOutCubic"});
	iTween.LookTo(myCamera.gameObject, {"looktarget":Vector3(0,0,myCamera.transform.position.z) + ( 100*(Vector3.forward)),"time":3f,"easetype":"easeInOutCubic", "delay" : 3});
}

function OnAlive ()
{
 		cthuloAlive.active = true;
		smoothFollowCthulo.enabled = true;
 		playerStatus.Reset();
}