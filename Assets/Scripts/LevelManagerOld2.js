//Level Manager 31/1/2013
//How to use: Put this code into a Game Manager Object
//What it does: Creates a sequence and put some markers
//Last Modified: 11/3/2013
//by Yves J. Albuquerque

#pragma strict


/*class Level
{
	var obstacleParts : GameObject[]; //Put here all Obstacles
	var groundParts : GameObject[]; //Put here all ground islands. The pivot must be at the top of the Object
	var mountainParts : GameObject[]; //Put the mountains here. The pivot must be at the bottom
	var detailParts : GameObject[]; //Put here all Rocks, Walls and other Detail
	var coinsToNextLevel : int[]; //Put here all cenario sequences
}*/

static var actualLevelIndex : int = 0; //Current Level
static var menuMode : boolean = false; // Menu Mode On/Off
var debugMode : boolean = false; // Debug Mode ignores Menu screen

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
private var smoothFollowCthulo : SmoothFollowCthulo;////PlayerMovement script Reference



function Awake ()
{
	menuMode = !debugMode;
	cthuloCamera = Camera.mainCamera;
	player = GameObject.FindGameObjectWithTag("Player").transform;
	
	playerMovement = player.GetComponent(PlayerMovement);
	playerStatus = player.GetComponent(PlayerStatus);
	playerMovementOnMenu = player.GetComponent(PlayerMovementOnMenu);
	
	vignet = cthuloCamera.GetComponent(Vignetting);
	smoothFollowCthulo = cthuloCamera.GetComponent(SmoothFollowCthulo);
	
	if (menuMode)
	{
		smoothFollowCthulo.enabled = false;
		playerMovementOnMenu.enabled = true;
		player.position = Vector3 (Random.Range(-1,1), Random.Range(-1,1), Random.Range(-1,1));
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
	//nextGround = distanceBetweenGround;
	//nextMountain = distanceBetweenMountain;
	//nextDetail = Random.Range(minDistanceBetweenDetail, maxDistanceBetweenDetail);
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