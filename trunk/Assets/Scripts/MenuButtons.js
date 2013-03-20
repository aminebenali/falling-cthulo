//SmoothFollowCthulo 08/03/2013
//How to use: Put this code menu buttons
//What it does: Menu button actions
//Last Modified: 19/03/2013
//by Yves J. Albuquerque

#pragma strict

enum ButtonFunction {Start, Credits, Exit}; //Button Types
var buttonType : ButtonFunction; //Button Type

var creditsBubbles : GameObject[];//Array with bubles from credits

private var player : GameObject;//Player reference
private var myRenderer : Renderer;//Caching component lookup - Optimization Issue
private var myCameraTransform : GameObject;//Caching component lookup - Optimization Issue
private var levelManager : LevelManager;

@script AddComponentMenu("GUI/Button")

function Start ()
{
	myCameraTransform = Camera.mainCamera.gameObject;
	myRenderer = renderer;
	player = GameObject.FindGameObjectWithTag("Player");
	levelManager = GameObject.FindGameObjectWithTag("GameManager").GetComponent(LevelManager);
}

function OnMouseOver ()
{
    myRenderer.material.color -= Color(0, 0, 1) * Time.deltaTime;
}

function OnMouseExit ()
{
    myRenderer.material.color = Color.white;
}


function OnMouseUpAsButton ()
{
	if (buttonType == ButtonFunction.Start)
	{
		iTween.RotateTo(player, {"rotation":Vector3.forward, "time":3f,"easetype":"easeOutQuint"});
		iTween.MoveTo(player, {"position":Vector3.zero, "time":3f, "easetype":"easeOutQuint","oncomplete":"TurnOffMenu", "oncompletetarget":gameObject});
		iTween.LookTo(myCameraTransform, {"looktarget":Vector3.zero,"time":3f,"easetype":"easeInOutCubic"});
		iTween.MoveTo(myCameraTransform, {"position":Vector3.zero - Vector3(0,-2,3),"time":3f,"easetype":"easeInOutCubic"});
		levelManager.DisplayLevelName ();

	}
		
	if (buttonType == ButtonFunction.Credits)
	{
		for (var i=0 ; i < creditsBubbles.Length; i++)
		{
			Instantiate (creditsBubbles[i],Vector3 (Random.Range(-5,5), -8, -2),Quaternion.LookRotation(Vector3.up));
		}
	}
	
	if (buttonType == ButtonFunction.Exit)
		Application.Quit();
}

function TurnOffMenu ()
{
	LevelManager.menuMode = false;
}