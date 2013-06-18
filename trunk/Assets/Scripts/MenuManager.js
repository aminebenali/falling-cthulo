#pragma strict

var playButton : GameObject;
var creditsButton : GameObject;
var changeStageButton : GameObject;
var shopButton : GameObject;
var archievementButton : GameObject;
var customButton : GameObject;

private var playPosition : Transform;
private var creditsPosition : Transform;
private var changeStagePosition : Transform;
private var ShopPosition : Transform;
private var ArchievementPosition : Transform;
private var CustomPosition : Transform;

function Start ()
{
	playPosition = playButton.transform;
	creditsPosition = creditsButton.transform;
	changeStagePosition = changeStageButton.transform;
	ShopPosition = shopButton.transform;
	ArchievementPosition = archievementButton.transform;
	CustomPosition = customButton.transform;
}

function Update ()
{

}

function OnClickPlay ()
{
	iTween.MoveBy(playButton, {"y": playPosition.position.y + 5, "time":2});
	iTween.MoveBy(playButton, {"y": playPosition.position.y, "delay": 2, "time":4});
	
	iTween.MoveBy(creditsButton, {"x": creditsPosition.position.x - 5, "time":2});
	iTween.MoveBy(creditsButton, {"x": creditsPosition.position.x, "delay": 2, "time":4});
	iTween.MoveBy(changeStageButton, {"y": changeStagePosition.position.y + 5, "time":2});
	iTween.MoveBy(changeStageButton, {"y": changeStagePosition.position.y, "delay": 2, "time":4});
	iTween.MoveBy(shopButton, {"x": ShopPosition.position.x + 5, "time":2});
	iTween.MoveBy(shopButton, {"x": ShopPosition.position.x, "delay": 2, "time":4});
	iTween.MoveBy(archievementButton, {"y": ArchievementPosition.position.y + 5, "time":2});
	iTween.MoveBy(archievementButton, {"y": ArchievementPosition.position.y, "delay": 2, "time":4});
	iTween.MoveBy(customButton, {"y": CustomPosition.position.y + 5, "time":2});
	iTween.MoveBy(customButton, {"y": CustomPosition.position.y, "delay": 2, "time":4});
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