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

private var buoyance : Buoyance[];
private var customButtonBouyScript : Buoyance;
private var player : GameObject;

function Start ()
{
	player = GameObject.FindGameObjectWithTag("Player");

	var buoyanceComponents:Component[];
	customButtonBouyScript = customButton.GetComponent(Buoyance);
	buoyanceComponents = gameObject.GetComponentsInChildren(Buoyance, true);
	buoyance = new Buoyance[buoyanceComponents.Length];
	for (var i : int = 0; i<buoyanceComponents.Length;i++)
        buoyance[i] = buoyanceComponents[i] as Buoyance;

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
}

function OnClickChangeStage ()
{
	iTween.RotateBy(changeStageButton, {"x": 1, "time":1, "space": Space.World});
}

function OnClickShop ()
{
}

function OnClickArchievement ()
{
}

function OnClickCustom ()
{
	customButtonBouyScript.enabled = false;
	iTween.MoveBy(mirror, {"x": -1.5,"y":-32.5,"z":-8.4, "time":3, "space": Space.World});
	iTween.MoveBy(customButton, {"x": 7,"y":-2,"z":-13, "time":1, "space": Space.World,"oncomplete":"MoveToFittingRoom", "oncompletetarget": gameObject});
	iTween.RotateTo(customButton, {"x": 0, "time":1, "space": Space.World});
}

function OnClickDesCustom ()
{
	iTween.MoveBy(mirror, {"x": 1.5,"y":32.5,"z":8.4, "time":1, "space": Space.World});
	iTween.MoveBy(customButton, {"x": -7,"y":2,"z":13, "time":1, "space": Space.World});
	iTween.RotateTo(customButton, {"x": 90, "time":1, "space": Space.World});
	yield WaitForSeconds (1);
	customButtonBouyScript.enabled = true;

}


function MoveToFittingRoom ()
{
	print ("MoveToFittingRoom");
	iTween.MoveTo(player,{"position" : customButton.transform.position + Vector3.up, "time":1f, "easetype":"easeOutQuad", "looktarget" : customButton.transform.position + 5*Vector3.up -Vector3.forward});
}

