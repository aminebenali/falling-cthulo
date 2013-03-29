//SmoothFollowCthulo 08/03/2013
//How to use: Put this code menu buttons
//What it does: Menu button actions
//Last Modified: 19/03/2013
//by Yves J. Albuquerque

#pragma strict

enum ButtonFunction {Start, Credits, Exit, ChangeLvl}; //Button Types
var buttonType : ButtonFunction; //Button Type

var creditsBubbles : GameObject[];//Array with bubles from credits

private var myRenderer : Renderer;//Caching component lookup - Optimization Issue
private var levelManager : LevelManager;

@script AddComponentMenu("GUI/Button")

function Start ()
{
	myRenderer = renderer;
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
		levelManager.WannaPlay();
		LevelManager.menuMode = false;
	}
		
	if (buttonType == ButtonFunction.Credits)
	{
		for (var i=0 ; i < creditsBubbles.Length; i++)
		{
			Instantiate (creditsBubbles[i],Vector3 (Random.Range(-5,5), -8, transform.position.z -1),Quaternion.LookRotation(Vector3.up));
		}
	}
	
	if (buttonType == ButtonFunction.Exit)
		Application.Quit();
		
	if (buttonType == ButtonFunction.ChangeLvl)
		levelManager.Restart();
}

function TurnOffMenu ()
{
	print ("turnOff");
	LevelManager.menuMode = false;
}