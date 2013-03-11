//Level Manager 31/1/2013
//How to use: Put this code into a Game Manager Object
//What it does: Creates a sequence and put some markers
//Last Modified: 01/3/2013
//by Yves J. Albuquerque

#pragma strict


class Level
{
	var obstacleParts : GameObject[]; //Put here all Obstacles
	var groundParts : GameObject[]; //Put here all ground islands. The pivot must be at the top of the Object
	var mountainParts : GameObject[]; //Put the mountains here. The pivot must be at the bottom
	var detailParts : GameObject[]; //Put here all Rocks, Walls and other Detail
}

static var actualLevelIndex : int = 0;
static var menuMode : boolean = false;
static var debugMode : boolean = false;

var distanceBetweenGround : float = 200;
var distanceBetweenMountain : float = 50;
var maxDistanceBetweenDetail : float = 200;
var minDistanceBetweenDetail : float = 1;
var maxDistanceBetweenObstacles : float = 50;
var minDistanceBetweenObstacles : float = 1;

var levels : Level[]; //Put here all cenario sequences

private var nextGround : float = -1;
private var nextMountain : float = -1;
private var nextDetail : float = -1;
private var nextObstacle : float = 200;

private var cthuloCamera : Camera;
private var player : Transform;
private var actualLevel : Level;
private var depth : float = 200; //Default cenario sequence depth
private var depthMultiplyer : float = 0; // Works like an index to depth control

private var vignet : Vignetting;
private var playerMovement : PlayerMovement;
private var playerMovementOnMenu : PlayerMovementOnMenu;
private var playerStatus : PlayerStatus;
private var smoothFollowCthulo : SmoothFollowCthulo;



function Awake ()
{
	menuMode = debugMode;
	cthuloCamera = Camera.mainCamera;
	player = GameObject.FindGameObjectWithTag("Player").transform;
	
	playerMovement = player.GetComponent(PlayerMovement);
	playerStatus = player.GetComponent(PlayerStatus);
	playerMovementOnMenu = player.GetComponent(PlayerMovementOnMenu);
	
	vignet = cthuloCamera.GetComponent(Vignetting);
	smoothFollowCthulo = cthuloCamera.GetComponent(SmoothFollowCthulo);
	
	if (menuMode)
	{
		playerMovement.enabled = false;
		playerStatus.enabled = false;
		smoothFollowCthulo.enabled = false;
		playerMovementOnMenu.enabled = true;
		player.position = Vector3 (Random.Range(-1,1), Random.Range(-1,1), Random.Range(-1,1));

	}
	else
	{
		playerMovement.enabled = true;
		playerStatus.enabled = true;
		smoothFollowCthulo.enabled = true;
		playerMovementOnMenu.enabled = false;
	}

}

function Start ()
{
	actualLevel = levels[actualLevelIndex];
	//nextGround = distanceBetweenGround;
	//nextMountain = distanceBetweenMountain;
	//nextDetail = Random.Range(minDistanceBetweenDetail, maxDistanceBetweenDetail);
	Reset ();

}

function Update ()
{
	if (menuMode)
	{
		playerMovement.enabled = false;
		playerStatus.enabled = false;
		smoothFollowCthulo.enabled = false;
		playerMovementOnMenu.enabled = true;
		return;
	}

		
	if (player.position.z > nextGround)
	{
		NewGround ();
		nextGround += distanceBetweenGround;
	}
	
	if (player.position.z > nextMountain)
	{
		NewMountain ();
		nextMountain += distanceBetweenMountain;
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
	var ground : GameObject;
	var mountain : GameObject;
	
	ground = Instantiate (actualLevel.groundParts[Random.Range(0,actualLevel.groundParts.Length)],Vector3(player.position.x, Random.Range(-4.5,-5),player.position.z),Quaternion.identity);
	ground.transform.localScale = Vector3 (Random.Range(1,3),Random.Range(1,3), Random.Range(1,3));
	
	ground = Instantiate (actualLevel.groundParts[Random.Range(0,actualLevel.groundParts.Length)],Vector3(player.position.x, Random.Range(-4.5,-5),Random.Range(player.position.z + distanceBetweenGround, player.position.z + distanceBetweenGround)),Quaternion.identity);
	ground.transform.localScale = Vector3 (Random.Range(1,3),Random.Range(1,3), Random.Range(1,3));
	//ground.transform.localEulerAngles.y += Random.Range(0,360);
	
	for (var i = 0; i<distanceBetweenGround; i+=distanceBetweenMountain)
	{
		mountain = Instantiate (actualLevel.mountainParts[Random.Range(0,actualLevel.mountainParts.Length)],Vector3(Random.Range(player.position.x-50,player.position.x-100), -5 ,player.position.z + distanceBetweenMountain+i),Quaternion.identity);
		//mountain.transform.localScale = Vector3 (Random.Range(1,20),Random.Range(1,31), Random.Range(1,20));
		mountain.transform.localEulerAngles.y += Random.Range(0,360);
		
		mountain = Instantiate (actualLevel.mountainParts[Random.Range(0,actualLevel.mountainParts.Length)],Vector3(Random.Range(player.position.x+50,player.position.x+100), -5 ,player.position.z + distanceBetweenMountain+i),Quaternion.identity);
		//mountain.transform.localScale = Vector3 (Random.Range(1,20),Random.Range(1,31), Random.Range(1,20));
		mountain.transform.localEulerAngles.y += Random.Range(0,360);
	}
}

function NewGround ()
{
	var ground : GameObject;
	
	ground = Instantiate (actualLevel.groundParts[Random.Range(0,actualLevel.groundParts.Length)],Vector3(player.position.x, Random.Range(-4.5,-5),player.position.z + (2*distanceBetweenGround)),Quaternion.identity);
	ground.transform.localScale = Vector3 (Random.Range(1,3),Random.Range(1,3), Random.Range(1,3));
	ground.transform.localEulerAngles.y += Random.Range(0,360);
	
	ground = Instantiate (actualLevel.groundParts[Random.Range(0,actualLevel.groundParts.Length)],Vector3(Random.Range(player.position.x-(distanceBetweenGround*0.3),player.position.x+(distanceBetweenGround*0.3)), Random.Range(-4.5,-5),Random.Range(player.position.z + distanceBetweenGround, player.position.z + (3*distanceBetweenGround))),Quaternion.identity);
	ground.transform.localScale = Vector3 (Random.Range(1,3),Random.Range(1,3), Random.Range(1,3));
	ground.transform.localEulerAngles.y += Random.Range(0,360);
}

function NewMountain ()
{
	var mountain : GameObject;
	
	mountain = Instantiate (actualLevel.mountainParts[Random.Range(0,actualLevel.mountainParts.Length)],Vector3(Random.Range(player.position.x-50,player.position.x-100), -5 ,player.position.z + distanceBetweenMountain+300),Quaternion.identity);
	//mountain.transform.localScale = Vector3 (Random.Range(1,20),Random.Range(1,31), Random.Range(1,20));
	//mountain.transform.localScale *= Random.Range(1,20);
	mountain.transform.localEulerAngles.y += Random.Range(0,360);
	mountain = Instantiate (actualLevel.mountainParts[Random.Range(0,actualLevel.mountainParts.Length)],Vector3(Random.Range(player.position.x+50,player.position.x+100), -5 ,player.position.z + distanceBetweenMountain+300),Quaternion.identity);
	//mountain.transform.localScale = Vector3 (Random.Range(1,20),Random.Range(1,31), Random.Range(1,20));
	//mountain.transform.localScale *= Random.Range(1,5);
	mountain.transform.localEulerAngles.y += Random.Range(0,360);
}

function NewDetail ()
{
	var detail : GameObject;
	var hit : RaycastHit;
	var detailPosition : Vector3;
	

    if (Physics.Raycast (Vector3(Random.Range(player.position.x-30,player.position.x+30), 50, player.position.z + 160), -Vector3.up, hit))
    {
        detailPosition = hit.point;
		
		detail = Instantiate (actualLevel.detailParts[Random.Range(0,actualLevel.detailParts.Length)],detailPosition,Quaternion.identity);
		//detail.transform.localScale = Vector3 (Random.Range(1,3),Random.Range(1,3), Random.Range(1,3));
		detail.transform.localEulerAngles.y += Random.Range(0,360);
		//detail.name += hit.transform.name;
	}
}

function NewObstacle ()
{
	var obstacle : GameObject;
	var hit : RaycastHit;
	var obstaclePosition : Vector3;
	

    if (Physics.Raycast (Vector3(Random.Range(player.position.x-30,player.position.x+30), 50, player.position.z + 160), -Vector3.up, hit))
    {
    	if (hit.collider.CompareTag("Terrain"))
    	{
	        obstaclePosition = hit.point;
			
			obstacle = Instantiate (actualLevel.obstacleParts[Random.Range(0,actualLevel.obstacleParts.Length)],obstaclePosition,Quaternion.identity);
			obstacle.transform.localScale = Vector3 (Random.Range(1,3),Random.Range(1,3), Random.Range(1,3));
			obstacle.transform.localEulerAngles.y += Random.Range(0,360);
			obstacle.name += hit.transform.name;
		}
	}
}

function OnDeath ()
{
	Reset();
}