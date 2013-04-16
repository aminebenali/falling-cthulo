//Level Manager 31/1/2013
//How to use: Put this code into a Game Manager Object
//What it does: Level and Game Manager
//Last Modified: 02/4/2013
//by Yves J. Albuquerque

#pragma strict

class LandMarks
{
	var gameObject : GameObject;
	var distanceToThisLandMark : int;
	var done : boolean;
}

class Obstacle
{
	var gameObject : GameObject;
	var minimalDistanceToNextObstacle : float;
	var minX : float;
	var maxX : float;
}

class Level
{
	var lvlName : String;
	var skyBox : Color;
	var fogColor : Color;
	var ambientColor : Color;
	var directionalLightColor : Color;
	var directionalColorIntensity : float;
	var landMark : LandMarks[];
	var obstacleParts : Obstacle[]; //Put here all Obstacles
	var groundParts : GameObject[]; //Put here all ground islands. The pivot must be at the top of the Object
	var mountainParts : GameObject[]; //Put the mountains here. The pivot must be at the bottom
	var detailParts : GameObject[]; //Put here all Rocks, Walls and other Detail
	var distanceToNextLevel : int; //Put here how many coins you need to preceed to next level
}

static var actualLevelIndex : int = 0; //Current Level
static var menuMode : boolean = true; // Menu Mode On/Off
static var startedGame : boolean = false;//true is the game has already started

var menu : GameObject; //Menu Elements

var maxDistanceBetweenDetail : float = 200; //Max Distance between Details
var minDistanceBetweenDetail : float = 1;// Min Distance between Details
var maxDistanceBetweenObstacles : float = 50; //Max Distance between Obstacles
private var distanceBetweenGround : float = 250; //Distance between ground parts
private var distanceBetweenMountain : float = 250; //Distance between Mountain parts
var maxDistanceBetweenItem : float = 50; //Max Distance between Obstacles

var levels : Level[]; //Put here all cenario landMark
var itens : GameObject[];

private var cachedObstacles : Array;
private var cachedDetails : Array;
private var cachedGrounds : Array;
private var cachedMountains : Array;

private var nextGround : float = -1;
private var nextMountain : float = -1;
private var nextDetail : float = 100;
private var nextObstacle : float = 100;
private var nextItem : float = -1;


private var isChangingLevel : boolean = true;
private var renderSettingsBlender : float = 0;


private var player : Transform; //Player Transform reference
private var playerMovement : PlayerMovement;//PlayerMovement script Reference
private var playerMovementOnMenu : PlayerMovementOnMenu;//PlayerMovementOnMenu script Reference
private var playerStatus : PlayerStatus;//PlayerStatus script Reference
private var cthuloAlive : SkinnedMeshRenderer;//SkennedMeshRenderer Reference
private var myCamera : Camera; //Main Camera Reference
private var smoothFollowCthulo : SmoothFollowCthulo;//PlayerMovement script Reference
private var vignet : Vignetting; //Vignet Reference
private var myDirectionalLight : Light;
private var lvlNameDisplay : GUIText;//LvlName Reference
private var lastObstacle : Obstacle;

private var groundIndex : int = 0;


function Awake ()
{
	player = GameObject.FindGameObjectWithTag("Player").transform;
	playerMovement = player.GetComponent(PlayerMovement);
	playerMovementOnMenu = player.GetComponent(PlayerMovementOnMenu);
	playerStatus = player.GetComponent(PlayerStatus);
	
	cthuloAlive = GameObject.FindObjectOfType(SkinnedMeshRenderer);
	myCamera = Camera.mainCamera;
	smoothFollowCthulo = myCamera.GetComponent(SmoothFollowCthulo);
	vignet = myCamera.GetComponent(Vignetting);

	myDirectionalLight = GameObject.FindObjectOfType(Light);
	lvlNameDisplay = GameObject.FindObjectOfType(GUIText);
	
	cachedObstacles = new Array ();
	cachedDetails = new Array ();
	cachedGrounds = new Array ();
	cachedMountains = new Array ();
	
	lvlNameDisplay.material.color.a = 0; //Bug Correction: When the project is reopened, the default value is getting back to 1;
}

function Start ()
{
	CreateMenu ();	
	Restart ();
}

function Update ()
{
	if (isChangingLevel)
	{
		renderSettingsBlender += Time.deltaTime/3;
		RenderSettings.fogColor = Color.Lerp (RenderSettings.fogColor, levels[actualLevelIndex].fogColor,renderSettingsBlender);
		RenderSettings.ambientLight = Color.Lerp (RenderSettings.ambientLight, levels[actualLevelIndex].ambientColor,renderSettingsBlender);
		RenderSettings.skybox.SetColor("_Tint", Color.Lerp (RenderSettings.skybox.GetColor("_Tint"), levels[actualLevelIndex].skyBox,renderSettingsBlender));
		iTween.ColorUpdate(myDirectionalLight.gameObject, levels[actualLevelIndex].directionalLightColor, 3f);
		iTween.FloatUpdate(myDirectionalLight.intensity, levels[actualLevelIndex].directionalColorIntensity, 3f);
		if (renderSettingsBlender > 1)
			isChangingLevel = false;
	}

	if (menuMode)
	{
		playerStatus.invunerable = true;
		smoothFollowCthulo.enabled = false;
		//playerMovementOnMenu.enabled = true;
		return;
	}

	if (levels[actualLevelIndex].distanceToNextLevel < player.position.z)
	{
		LevelUp();
	}
		
	if (player.position.z > nextGround)
	{
		nextGround += distanceBetweenGround;
		
		if (cachedGrounds.length > 3)
		{
			var oldestGround : GameObject;
			groundIndex++;
			if (groundIndex > 3)
				groundIndex=0;
			
			oldestGround = cachedGrounds[groundIndex];
			oldestGround.transform.position.z = nextGround;
		}
		else
			NewGround ();
	}
	
	else if (player.position.z > nextMountain)
	{
		nextMountain += distanceBetweenMountain;
		NewMountain ();
	}
	
	else if (player.position.z > nextObstacle)
	{
		NewObstacle ();
		nextObstacle += Random.Range(lastObstacle.minimalDistanceToNextObstacle, maxDistanceBetweenObstacles);
		nextDetail += lastObstacle.minimalDistanceToNextObstacle;
	}
	
	else if (player.position.z > nextDetail)
	{
		NewDetail ();
		nextDetail += Random.Range(minDistanceBetweenDetail, maxDistanceBetweenDetail);;
	}
	
	else if (player.position.z > nextItem)
	{
		NewItem ();
		nextItem += Random.Range(50, maxDistanceBetweenItem);;
	}
}

function NewGround ()
{
	//cachedGrounds.Shift();
	cachedGrounds.Push (Instantiate (levels[actualLevelIndex].groundParts[Random.Range(0,levels[actualLevelIndex].groundParts.Length)],Vector3(0,-5,nextGround),Quaternion.identity));
	//Instantiate (levels[actualLevelIndex].groundParts[Random.Range(0,levels[actualLevelIndex].groundParts.Length)],Vector3(0,-5,nextGround + 125),Quaternion.identity);
}

function NewMountain ()
{
	Instantiate (levels[actualLevelIndex].mountainParts[Random.Range(0,levels[actualLevelIndex].mountainParts.Length)],Vector3(0, -5 ,nextMountain),Quaternion.identity);
}

function NewDetail ()
{
	var detail : GameObject;
	detail = Instantiate (levels[actualLevelIndex].detailParts[Random.Range(0,levels[actualLevelIndex].detailParts.Length)],Vector3(Random.Range(-20,20), -5, player.position.z + 197),Quaternion.identity);
	detail.transform.localEulerAngles.y += Random.Range(0,360);
	/*var hit : RaycastHit;
	var detailPosition : Vector3;
	

    if (Physics.Raycast (Vector3(Random.Range(-15,15), 50, player.position.z + 197), -Vector3.up, hit))
    {
        detailPosition = hit.point;
		detail = Instantiate (levels[actualLevelIndex].detailParts[Random.Range(0,levels[actualLevelIndex].detailParts.Length)],detailPosition,Quaternion.identity);
		detail.transform.localEulerAngles.y += Random.Range(0,360);
	}*/
}

function NewObstacle ()
{
	var obstaclePosition : Vector3;
	lastObstacle = levels[actualLevelIndex].obstacleParts[Random.Range(0,levels[actualLevelIndex].obstacleParts.Length)];
	Instantiate (lastObstacle.gameObject,Vector3(Random.Range(lastObstacle.minX,lastObstacle.maxX), -5, player.position.z + 200),Quaternion.identity);
}

function NewItem ()
{
	Instantiate (itens[Random.Range(0,itens.Length)],Vector3(Random.Range(-15,15),Random.Range(-5,15),player.position.z + 200),Quaternion.identity);
}

function DisplayLevelName ()
{
	lvlNameDisplay.text = levels[actualLevelIndex].lvlName;
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
 		playerStatus.Reset();
 		cthuloAlive.active = true;
 	 	menuMode = true;
 		SendMessageUpwards("Restart");
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
 

function CreateMenu ()
{
	Instantiate (menu, Vector3(0,0,0), Quaternion.identity);
	smoothFollowCthulo.enabled = false;
	playerMovement.enabled = false;
	playerMovementOnMenu.enabled = true;
	player.position = Vector3 (Random.Range(-20,20), Random.Range(-5,20), Random.Range(-15,15));
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
	DisplayLevelName ();
	IncreaseDistancesToNextLevel();
	cthuloAlive.active = true;
	smoothFollowCthulo.enabled = true;
	playerStatus.Reset();
}

function Reset ()
{
	cachedObstacles.Push (Instantiate (levels[actualLevelIndex].obstacleParts[Random.Range(0,levels[actualLevelIndex].obstacleParts.Length)].gameObject,Vector3(0,-5,Random.Range(50,150)),Quaternion.identity));
	cachedGrounds.Push (Instantiate (levels[actualLevelIndex].groundParts[Random.Range(0,levels[actualLevelIndex].groundParts.Length)],Vector3(0,-5,0),Quaternion.identity));
	cachedMountains.Push (Instantiate (levels[actualLevelIndex].mountainParts[Random.Range(0,levels[actualLevelIndex].mountainParts.Length)],Vector3(0, -5 ,0),Quaternion.identity));
	cachedDetails.Push (Instantiate (levels[actualLevelIndex].detailParts[Random.Range(0,levels[actualLevelIndex].detailParts.Length)],Vector3 (Random.Range(-15,15),-5, Random.Range(5,100)),Quaternion.identity));
	cachedDetails.Push (Instantiate (levels[actualLevelIndex].detailParts[Random.Range(0,levels[actualLevelIndex].detailParts.Length)],Vector3 (Random.Range(-15,15),-5, Random.Range(5,100)),Quaternion.identity));
	cachedDetails.Push (Instantiate (levels[actualLevelIndex].detailParts[Random.Range(0,levels[actualLevelIndex].detailParts.Length)],Vector3 (Random.Range(-15,15),-5, Random.Range(5,100)),Quaternion.identity));
}

function Restart ()
{
	ClearScene ();
	Reset ();
}

function ClearScene ()
{
	DestroyArrayElements (cachedObstacles);
	DestroyArrayElements (cachedDetails);
	DestroyArrayElements (cachedMountains);
	DestroyArrayElements (cachedGrounds);
}

function DestroyArrayElements (array : Array)
{
	for (var i : int = 0 ; i<array.length ; i++)
		Destroy (array[i]);
}

function LevelUp ()
{
	actualLevelIndex ++;

	if (actualLevelIndex == levels.Length)
	{
		actualLevelIndex = 0;
		IncreaseDistancesToNextLevel ();
	}

	DisplayLevelName ();

	isChangingLevel = true;
}

function ChangeSkybox ()
{
	var skyMaterial : Material;
	skyMaterial = RenderSettings.skybox;

//    lerpSkyBox += Time.deltaTime/6;
    
  //  skyMaterial.SetFloat("_Blend", lerpSkyBox);
	//if (lerpSkyBox > 1)
      	//changeSkyBox = false;
}

function IncreaseDistancesToNextLevel ()
{
	for (var i:int = 0; i < levels.Length; i++)
			levels[i].distanceToNextLevel += player.position.z;
}