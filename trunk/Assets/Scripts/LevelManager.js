//Level Manager 3/1/2013
//How to use: Put this code into a Game Manager Object
//What it does: Level and Game Manager
//Last Modified: 07/07/2013
//by Yves J. Albuquerque

#pragma strict

enum GameStatus {StartMenu, InGame, GameResults}; //Game Behaviour
public static var gameStatus : GameStatus = GameStatus.StartMenu; 

class LandMarks//LandMark Class
{
	var landMark : Transform;//landMark transform
	var distanceToThisLandMark : int;//distance to this landmark should be half of total distance from level
	var done : boolean;//if you pass through a landmark it becomes true
}

class Obstacle//Obstacles Class
{
	var obstacle : Transform;//obstacle transform
	var DistanceToNextObstacle : float = 100;//minimal distance to next obstacle so no detail or obstacle is created over an obstacle
	var minX : float;//minimal value in X axis to spawn this Obstacle
	var maxX : float;//maximum value in X axis to spawn this Obstacle
}

class Level//Level class to manage our level.
{
	var lvlName : String;//Name of this level
	var skyBox : Color;//skyBox from this level
	var fogColor : Color;//fog Color of this level
	var ambientColor : Color;//ambiente color of this level
	var directionalLightColor : Color;//directional light color of this level
	var directionalColorIntensity : float;//directional light color intensity
	var landMark : LandMarks;//landMark of this Level
	var obstacleParts : Obstacle[]; //Put here all Obstacles
	var groundParts : Transform[]; //Put here all ground islands. The pivot must be at the top of the Object
	var mountainParts : Transform[]; //Put the mountains here. The pivot must be at the bottom
	var detailParts : Transform[]; //Put here all Rocks, Walls and other Detail
	@HideInInspector
	var startPoint : int; //Put here how long you need to swimming before go to the next level
	var endPoint : int; //Put here how long you need to swimming before go to the next level
}

static var actualLevelIndex : int = 0; //Current Level

var menu : GameObject; //Menu Elements

var maxDistanceBetweenDetail : float = 100; //Max Distance between Details
var minDistanceBetweenDetail : float = 1;// Min Distance between Details
var maxDistanceBetweenObstacles : float = 50; //Max Distance between Obstacles
//var maxDistanceBetweenItem : float = 50; //Max Distance between Itens

var levels : Level[]; //Here comes all you levels
//var itens : Transform[];//Put here all your itens

private var distanceBetweenGround : float = 250; //Distance between ground parts
private var distanceBetweenMountain : float = 250; //Distance between Mountain parts
private var nextGround : float = -1;//tracker to next ground
private var nextMountain : float = -1;//tracker to next Mountain
private var nextDetail : float = 100;//tracker to next Detail
private var nextObstacle : float = 100;//tracker to next Obstacle
//private var nextItem : float = -1;//tracker to next item

@HideInInspector
public var isChangingLevel : boolean = true;//is true while damping level settings
private var renderSettingsBlender : float = 1;//damping timer while changing level

private var player : Transform; //Player Transform reference
private var playerMovement : PlayerMovement;//PlayerMovement script Reference
private var playerMovementOnMenu : PlayerMovementOnMenu;//PlayerMovementOnMenu script Reference
private var playerStatus : PlayerStatus;//PlayerStatus script Reference
private var myCamera : Camera; //Main Camera Reference
private var smoothFollowCthulo : SmoothFollowCthulo;//PlayerMovement script Reference
private var vignet : Vignetting; //Vignet Reference
private var myDirectionalLight : Light;//My directional Light reference
private var lvlNameDisplay : GUIText;//LvlName Reference
private var lastObstacle : Obstacle;//Last instatiated Obstacle.

function Awake ()
{
	player = GameObject.FindGameObjectWithTag("Player").transform;
	playerMovement = player.GetComponent(PlayerMovement);
	playerMovementOnMenu = player.GetComponent(PlayerMovementOnMenu);
	playerStatus = player.GetComponent(PlayerStatus);	
	myCamera = Camera.mainCamera;
	smoothFollowCthulo = myCamera.GetComponent(SmoothFollowCthulo);
	vignet = myCamera.GetComponent(Vignetting);

	myDirectionalLight = GameObject.FindGameObjectWithTag("DirectionalLight").light;
	lvlNameDisplay = GameObject.FindObjectOfType(GUIText);
	
	lvlNameDisplay.material.color.a = 0; //Bug Correction: When the project is reopened, the default value is getting back to 1;
	gameStatus = GameStatus.StartMenu;
}

function Start ()
{
	CreateMenu ();
	Restart ();
}

function Update ()
{
	if (gameStatus != GameStatus.InGame)
		return;

	if (levels[actualLevelIndex].endPoint < player.position.z)
	{
		LevelUp();
	}
		
	if (player.position.z > nextGround)
	{
		nextGround += distanceBetweenGround;
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
		nextObstacle += lastObstacle.DistanceToNextObstacle;
		nextDetail += lastObstacle.DistanceToNextObstacle;
	}
	
	else if (player.position.z > nextDetail)
	{
		NewDetail ();
		nextDetail += Random.Range(minDistanceBetweenDetail, maxDistanceBetweenDetail);;
	}
	
/*	else if (player.position.z > nextItem)
	{
		NewItem ();
		nextItem += Random.Range(50, maxDistanceBetweenItem);;
	}*/
}

function NewGround ()
{
	PoolManager.Pools["Grounds"].Spawn(levels[actualLevelIndex].groundParts[Random.Range(0,levels[actualLevelIndex].groundParts.Length)],Vector3(0,-5,nextGround),Quaternion.identity);
}

function NewMountain ()
{
	PoolManager.Pools["Mountains"].Spawn(levels[actualLevelIndex].mountainParts[Random.Range(0,levels[actualLevelIndex].mountainParts.Length)],Vector3(0, -5 ,nextMountain),Quaternion.identity);
}

function NewDetail ()
{
	var detail : Transform;
	detail = PoolManager.Pools["Details"].Spawn(levels[actualLevelIndex].detailParts[Random.Range(0,levels[actualLevelIndex].detailParts.Length)].transform,Vector3(Random.Range(-20,20), -5, player.position.z + 197),Quaternion.identity);
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
	PoolManager.Pools["Obstacles"].Spawn(lastObstacle.obstacle,Vector3(Random.Range(lastObstacle.minX,lastObstacle.maxX), -5, player.position.z + 200),Quaternion.identity);
}

/*function NewItem ()
{
	PoolManager.Pools["Itens"].Spawn(itens[Random.Range(0,itens.Length)],Vector3(Random.Range(-15,15),Random.Range(-5,15),player.position.z + 200),Quaternion.identity);
}*/

function DisplayLevelName ()
{
	lvlNameDisplay.text = levels[actualLevelIndex].lvlName;
	iTween.ColorTo(lvlNameDisplay.gameObject, {"a": 1, "time" : 2f});
	iTween.ColorTo(lvlNameDisplay.gameObject, {"a": 0, "time" : 2f, "delay" : 3f});
}



function WannaPlay ()
{
	var wantedPlayerPosition : Vector3;
	var wantedCameraPosition : Vector3;

	wantedPlayerPosition.z = levels[actualLevelIndex].startPoint;
	wantedPlayerPosition.x = 0;
	wantedPlayerPosition.y = 0;
	
	wantedCameraPosition = Vector3(wantedPlayerPosition.x,wantedPlayerPosition.y + smoothFollowCthulo.height,wantedPlayerPosition.z - smoothFollowCthulo.distance);

	iTween.MoveTo(player.gameObject, {"position":wantedPlayerPosition, "time":3f, "easetype":"easeOutQuint"});
	iTween.RotateTo(player.gameObject, {"rotation":Vector3.forward, "time":3f,"easetype":"easeOutQuint"});
	
	iTween.MoveTo(myCamera.gameObject, {"position":wantedCameraPosition, "time":3f,"easetype":"easeInOutCubic", "oncomplete":"TurnOffMenu", "oncompletetarget":gameObject});
	iTween.LookTo(myCamera.gameObject, {"looktarget": myCamera.transform.position - (wantedCameraPosition - (wantedPlayerPosition + smoothFollowCthulo.target.localPosition)),"time":3f,"easetype":"easeInOutCubic"});
	
	yield WaitForSeconds (3);
	
	gameStatus = GameStatus.InGame;
	playerStatus.invunerable = false;
}
 

function CreateMenu ()
{
	PoolManager.Pools["Menu"].Spawn(menu.transform,Vector3(0,0,levels[actualLevelIndex].startPoint), Quaternion.identity);
	playerStatus.invunerable = true;
	if (gameStatus == GameStatus.InGame)
		player.position = Vector3 (Random.Range(-20,20), Random.Range(-5,20), Random.Range(levels[actualLevelIndex].startPoint-15,levels[actualLevelIndex].startPoint+15));
	gameStatus = GameStatus.StartMenu;	
}

function Reset ()
{
	PoolManager.Pools["Obstacles"].Spawn(levels[actualLevelIndex].obstacleParts[Random.Range(0,levels[actualLevelIndex].obstacleParts.Length)].obstacle,Vector3(0,-5,Random.Range(levels[actualLevelIndex].startPoint + 50,levels[actualLevelIndex].startPoint + 150)),Quaternion.identity);
	PoolManager.Pools["Grounds"].Spawn(levels[actualLevelIndex].groundParts[Random.Range(0,levels[actualLevelIndex].groundParts.Length)],Vector3(0,-5,levels[actualLevelIndex].startPoint-250),Quaternion.identity);
	PoolManager.Pools["Grounds"].Spawn(levels[actualLevelIndex].groundParts[Random.Range(0,levels[actualLevelIndex].groundParts.Length)],Vector3(0,-5,levels[actualLevelIndex].startPoint),Quaternion.identity);
	PoolManager.Pools["Mountains"].Spawn(levels[actualLevelIndex].mountainParts[Random.Range(0,levels[actualLevelIndex].mountainParts.Length)],Vector3(0, -5 ,levels[actualLevelIndex].startPoint),Quaternion.identity);
	PoolManager.Pools["Details"].Spawn(levels[actualLevelIndex].detailParts[Random.Range(0,levels[actualLevelIndex].detailParts.Length)].transform,Vector3(Random.Range(-20,20), -5, Random.Range(levels[actualLevelIndex].startPoint + 10,levels[actualLevelIndex].startPoint + 100)),Quaternion.identity);
	PoolManager.Pools["Details"].Spawn(levels[actualLevelIndex].detailParts[Random.Range(0,levels[actualLevelIndex].detailParts.Length)].transform,Vector3(Random.Range(-20,20), -5, Random.Range(levels[actualLevelIndex].startPoint + 10,levels[actualLevelIndex].startPoint + 100)),Quaternion.identity);
	PoolManager.Pools["Details"].Spawn(levels[actualLevelIndex].detailParts[Random.Range(0,levels[actualLevelIndex].detailParts.Length)].transform,Vector3(Random.Range(-20,20), -5, Random.Range(levels[actualLevelIndex].startPoint + 10,levels[actualLevelIndex].startPoint + 100)),Quaternion.identity);
}

function Restart ()
{
	ClearScene ();
	SendMessageUpwards ("OnAlive");

	if (gameStatus == GameStatus.InGame)
	{
		player.position = Vector3 (0,0,levels[actualLevelIndex].startPoint);
	}

	if (gameStatus == GameStatus.StartMenu)
	{
		if (actualLevelIndex != 0)
			player.position = Vector3 (player.position.x,player.position.y,player.position.z + levels[actualLevelIndex].startPoint);
		else
			player.position = Vector3 (player.position.x,player.position.y,levels[actualLevelIndex].startPoint);
		
		PoolManager.Pools["Menu"].Spawn(menu.transform,Vector3(0,0,levels[actualLevelIndex].startPoint), Quaternion.identity);
	}

	
	myCamera.transform.position.x = 0;
	myCamera.transform.position.y = 0;
	myCamera.transform.position.z = levels[actualLevelIndex].startPoint - 13;
	myCamera.transform.rotation = Quaternion.identity;
	
	nextGround = levels[actualLevelIndex].startPoint;
	nextMountain = levels[actualLevelIndex].startPoint;
	nextDetail = levels[actualLevelIndex].startPoint;
	nextObstacle = levels[actualLevelIndex].startPoint;
//	nextItem = levels[actualLevelIndex].startPoint; //No more random Itens
	
	Reset ();
}

function ClearScene ()
{
	var i : int;
	
	for (i = 0; i < PoolManager.Pools["Obstacles"].Count ; i++)
	{
		PoolManager.Pools["Obstacles"].Despawn(PoolManager.Pools["Obstacles"][i]);
	}
	
	for (i = 0; i < PoolManager.Pools["Grounds"].Count ; i++)
	{
		PoolManager.Pools["Grounds"].Despawn(PoolManager.Pools["Grounds"][i]);
	}
	
	for (i = 0; i < PoolManager.Pools["Mountains"].Count ; i++)
	{
		PoolManager.Pools["Mountains"].Despawn(PoolManager.Pools["Mountains"][i]);
	}
	
	for (i = 0; i < PoolManager.Pools["Details"].Count ; i++)
	{
		PoolManager.Pools["Details"].Despawn(PoolManager.Pools["Details"][i]);
	}
	
	for (i = 0; i < PoolManager.Pools["Landmarks"].Count ; i++)
	{
		PoolManager.Pools["Landmarks"].Despawn(PoolManager.Pools["Landmarks"][i]);
	}
}

function LevelUp ()
{		
	var lastEndPoint : int;	
	lastEndPoint = levels[actualLevelIndex].endPoint;

	actualLevelIndex ++;

	if (actualLevelIndex == levels.Length)
	{
		actualLevelIndex = 0;
		IncreaseDistancesToNextLevel ();
	}

	DisplayLevelName ();
	UpdateVisualAspects ();
	
	levels[actualLevelIndex].startPoint = lastEndPoint;

	isChangingLevel = true;
}

function UpdateVisualAspects ()
{
	iTween.ColorTo(myDirectionalLight.gameObject, {"color":levels[actualLevelIndex].directionalLightColor, "time":3});
	iTween.ValueTo(gameObject, {"from":myDirectionalLight.intensity,"to":levels[actualLevelIndex].directionalColorIntensity,"time":3,"onupdate":"UpdateLightIntensity"});
	iTween.ValueTo(gameObject, {"from":RenderSettings.fogColor,"to":levels[actualLevelIndex].fogColor,"time":3,"onupdate":"UpdateFogColor"});
	iTween.ValueTo(gameObject, {"from":RenderSettings.ambientLight,"to":levels[actualLevelIndex].ambientColor,"time":3,"onupdate":"UpdateAmbientLight"});
	iTween.ValueTo(gameObject, {"from":RenderSettings.ambientLight,"to":levels[actualLevelIndex].ambientColor,"time":3,"onupdate":"UpdateAmbientLight"});
	iTween.ValueTo(gameObject, {"from":RenderSettings.skybox.GetColor("_Tint"),"to":levels[actualLevelIndex].skyBox,"time":3,"onupdate":"UpdateSkyboxColor"});
}

function UpdateLightIntensity (newIntensity : float)
{
	myDirectionalLight.intensity = newIntensity;
}

function UpdateFogColor (newColor : Color)
{
	RenderSettings.fogColor = newColor;
}

function UpdateAmbientLight (newColor : Color)
{
	RenderSettings.ambientLight = newColor;
}

function UpdateSkyboxColor (newColor : Color)
{
	RenderSettings.skybox.SetColor("_Tint",newColor);
}

function IncreaseDistancesToNextLevel ()
{
	for (var i:int = 0; i < levels.Length; i++)
			levels[i].endPoint += player.position.z;
}