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

private var buoyance : Buoyance[];

function Start ()
{
	var buoyanceComponents:Component[];
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
	iTween.MoveBy(playButton, {"y": -5, "delay": 2.5, "time":3, "space": Space.World});
	
	iTween.MoveBy(creditsButton, {"x": -5, "time":2.5, "space": Space.World});
	iTween.MoveBy(creditsButton, {"x": 5, "delay": 2.5, "time":3, "space": Space.World});
	
	iTween.MoveBy(changeStageButton, {"y": 5, "time":2.5, "space": Space.World});
	iTween.MoveBy(changeStageButton, {"y": -5, "delay": 2.5, "time":3, "space": Space.World});
	
	iTween.MoveBy(shopButton, {"x": 5, "time":2.5, "space": Space.World});
	iTween.MoveBy(shopButton, {"x": -5, "delay": 2.5, "time":3, "space": Space.World});
	
	iTween.MoveBy(archievementButton, {"y": -5, "time":2.5, "space": Space.World});
	iTween.MoveBy(archievementButton, {"y": 5, "delay": 2.5, "time":3, "space": Space.World});
	
	iTween.MoveBy(customButton, {"x": -5, "time":2.5, "space": Space.World});
	iTween.MoveBy(customButton, {"x": 5, "delay": 2.5, "time":3, "space": Space.World});
	
	yield WaitForSeconds(6);

 	for (var buoy : Buoyance in buoyance)
        buoy.enabled = true;
}

function OnClickCredits ()
{
}

function OnClickChangeStage ()
{
}

function OnClickShop ()
{
}

function OnClickArchievement ()
{
}

function OnClickCustom ()
{
}