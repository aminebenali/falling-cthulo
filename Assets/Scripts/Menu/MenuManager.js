//Level Manager 18/6/2013
//How to use: Put this code into a Game Menu Root
//What it does: Menu animation control and Menu Flow
//Last Modified: 18/6/2013
//by Yves J. Albuquerque

#pragma strict

var playButton : GameObject;
var creditsButton : GameObject;
var changeStageButton : GameObject;
var shopButton : GameObject;
var archievementButton : GameObject;
var customButton : GameObject;
var mirror : GameObject;

var changeColorButton : GUITexture;
var changeMaterialButton : GUITexture;
var nextCharButton : GUITexture;
var previousCharButton : GUITexture;

private var generator : CharacterGenerator;
private var usingLatestConfig : boolean;
private var newCharacterRequested : boolean = true;
private var firstCharacter : boolean = true;

private var retry : GameObject;
private var quit : GameObject;

private var customButtonBouyScript : Buoyance;
private var buoyance : Buoyance[];
private var player : GameObject;

public static var inFittingRoom : boolean = false; // Menu Mode On/Off


function Start ()
{
	player = GameObject.FindGameObjectWithTag("Player");

	retry = GameObject.Find("Retry");
	quit = GameObject.Find("Quit");

	changeColorButton.enabled = false;
	changeMaterialButton.enabled = false;
	nextCharButton.enabled = false;
	previousCharButton.enabled = false;

	retry.guiTexture.enabled = false;
	quit.guiTexture.enabled = false;
	
	var buoyanceComponents:Component[];
	customButtonBouyScript = customButton.GetComponent(Buoyance);
	buoyanceComponents = gameObject.GetComponentsInChildren(Buoyance, true);
	buoyance = new Buoyance[buoyanceComponents.Length];
	for (var i : int = 0; i<buoyanceComponents.Length;i++)
        buoyance[i] = buoyanceComponents[i] as Buoyance;

    while (!CharacterGenerator.ReadyToUse)
		yield;
		    
    generator = CharacterGenerator.CreateWithRandomConfig("Cthulho");

}

function Update ()
{
	if (Input.GetKeyDown("space"))
	{
		PlayerStatus.isDead=true;
	}
	
	if (generator == null)
		return;
    if (usingLatestConfig)
    	return;
    if (!generator.ConfigReady)
    	return;
    
    usingLatestConfig = true;
	
	if (newCharacterRequested)
    {
		Destroy(player);
        player = generator.Generate();
        newCharacterRequested = false;
    }
    else
    {
	    player = generator.Generate(player);
	}
}

function OnGUI ()
{
	if (LevelManager.gameStatus == GameStatus.GameResults)
	{
		var windowRect : Rect;
	 	if (!PlayerStatus.isDead)
	 		return;
	 	windowRect = Rect (Screen.width/4, Screen.height/4, Screen.width/2, Screen.height/2);
	
	 	GUILayout.BeginArea(windowRect);
		 	GUILayout.Label("Total Distance: " + player.transform.position.z);
		 	GUILayout.Label("Total Coins: " + PlayerStatus.coins);
		 	if (!retry.guiTexture.enabled)
				retry.guiTexture.enabled = true;
				quit.guiTexture.enabled = true;
	 	GUILayout.EndArea();
	}
	
	if (inFittingRoom)
	{
		var customizeOptionsRect : Rect;
		customizeOptionsRect = Rect(Screen.width/2-150,Screen.height/2,300,300);
		
		GUILayout.BeginArea(customizeOptionsRect);
		GUILayout.BeginHorizontal();
		if (generator == null)
			return;
	
		if (!usingLatestConfig)
		{
			var progress : float = generator.CurrentConfigProgress;
			var status : String = "Loading";
			if (progress != 1)
				status = "Downloading " + (progress * 100) + "%";
	    	GUILayout.Box(status);
		}
		
		GUILayout.EndHorizontal();
		GUILayout.EndArea();
	}
}

function OnClickPlay ()
{
	for (var buoy : Buoyance in buoyance)
        buoy.enabled = false;

	iTween.MoveBy(playButton, {"y": 5, "time":2.5, "space": Space.World});
	iTween.MoveBy(playButton, {"y": -5, "delay": 2.9, "time":3, "space": Space.World});
	
	iTween.MoveBy(creditsButton, {"x": -5, "time":2.5, "space": Space.World});
	iTween.MoveBy(creditsButton, {"x": 5, "delay": 2.9, "time":3, "space": Space.World});
	
	iTween.MoveBy(changeStageButton, {"y": 5, "time":2.5, "space": Space.World});
	iTween.MoveBy(changeStageButton, {"y": -5, "delay": 2.9, "time":3, "space": Space.World});
	
	iTween.MoveBy(shopButton, {"x": 5, "time":2.5, "space": Space.World});
	iTween.MoveBy(shopButton, {"x": -5, "delay": 2.9, "time":3, "space": Space.World});
	
	iTween.MoveBy(archievementButton, {"y": -5, "time":2.5, "space": Space.World});
	iTween.MoveBy(archievementButton, {"y": 5, "delay": 2.9, "time":3, "space": Space.World});
	
	iTween.MoveBy(customButton, {"x": -5, "time":2.5, "space": Space.World});
	iTween.MoveBy(customButton, {"x": 5, "delay": 2.9, "time":3, "space": Space.World});
	
	yield WaitForSeconds(6);

 	for (var buoy : Buoyance in buoyance)
        buoy.enabled = true;
}

function OnClickCredits ()
{
	iTween.MoveBy(creditsButton, {"z":5, "time":1, "space": Space.World});
	iTween.MoveBy(creditsButton, {"z":-5, "time":1,"delay":1, "space": Space.World});
}

function OnClickChangeStage ()
{
	iTween.RotateBy(changeStageButton, {"x": 1, "time":1, "space": Space.World});
}

function OnClickShop ()
{
	iTween.MoveBy(shopButton, {"z":5, "time":1, "space": Space.World});
	iTween.MoveBy(shopButton, {"z":-5, "time":1,"delay":1, "space": Space.World});
}

function OnClickArchievement ()
{
	iTween.MoveBy(archievementButton, {"z":5, "time":1, "space": Space.World});
	iTween.MoveBy(archievementButton, {"z":-5, "time":1,"delay":1, "space": Space.World});
}

function OnClickCustom ()
{
	customButtonBouyScript.enabled = false;
	iTween.MoveBy(mirror, {"x": -2.5,"y":-34,"z":-1, "time":3,"delay":1, "space": Space.World});
	iTween.MoveBy(customButton, {"x": 7,"y":-2,"z":-7, "time":1, "space": Space.World,"oncomplete":"MoveToFittingRoom", "oncompletetarget": gameObject});
	iTween.RotateTo(customButton, {"x": 0, "time":1, "space": Space.World});
}

function OnClickDesCustom ()
{
	iTween.MoveBy(mirror, {"x": 2.5,"y":34,"z":1, "time":1, "space": Space.World});
	iTween.MoveBy(customButton, {"x": -7,"y":2,"z":7, "time":1, "space": Space.World});
	iTween.RotateTo(customButton, {"x": 90, "time":1, "space": Space.World});
	yield WaitForSeconds (1);
	customButtonBouyScript.enabled = true;

}

function OnClickChangeColor ()
{
	generator.ChangeElement("color", true);
	usingLatestConfig = false;
}

function OnClickSkinColor ()
{
	generator.ChangeElement("skin", true);
	usingLatestConfig = false;
}

function OnClickPreviousChar ()
{
	ChangeCharacter(false);
}
 
function OnClickNextChar ()
{
	ChangeCharacter(true);
}

function OnPlayClick ()
{
	if (GUILayout.Button("Save Configuration"))
    	PlayerPrefs.SetString("MyChar", generator.GetConfig());
}

function OnClickRetry ()
{
	if (retry.guiTexture.enabled)
		retry.guiTexture.enabled = false;
		quit.guiTexture.enabled = false;
}

function MoveToFittingRoom ()
{
	iTween.MoveTo(player,{"position" : customButton.transform.position + Vector3.up, "time":1f, "easetype":"easeOutQuad", "looktarget" : customButton.transform.position + 5*Vector3.up -Vector3.forward});
}

function ChangeCharacter(next : boolean)
{
        generator.ChangeCharacter(next);
        usingLatestConfig = false;
        newCharacterRequested = true;
}