//SmoothFollowCthulo 08/03/2013
//How to use: Put this code menu buttons
//What it does: Menu button actions
//Last Modified: 04/04/2013
//by Yves J. Albuquerque

#pragma strict

enum ButtonFunction {Start, Credits, Exit, ChangeLvl, FittingRoom}; //Button Types
var buttonType : ButtonFunction; //Button Type

var creditsBubbles : GameObject[];//Array with bubles from credits
private var myRenderer : Renderer;//Caching component lookup - Optimization Issue
private var levelManager : LevelManager;
private var playerMovementOnMenu : PlayerMovementOnMenu;
private var originalShader : Shader;
private var alternativeShader : Shader = Shader.Find("Transparent/Diffuse");


@script AddComponentMenu("GUI/Button")

function Start ()
{
	myRenderer = renderer;
	originalShader = myRenderer.material.shader;
	levelManager = GameObject.FindGameObjectWithTag("GameManager").GetComponent(LevelManager);
	playerMovementOnMenu = GameObject.FindGameObjectWithTag("Player").GetComponent(PlayerMovementOnMenu);
}

function OnMouseEnter ()
{
    switch (buttonType)
	{
		default:
			playerMovementOnMenu.inFittingRoom = false;
		break;
	} 
}

function OnMouseOver ()
{
	myRenderer.material.shader = alternativeShader;
	if (levelManager.isChangingLevel)
		return;
    myRenderer.material.color -= Color(0, 1, 1, 0) * Time.deltaTime;
    if (myRenderer.material.color.a > 0.7)
    {
	    myRenderer.material.color.a -= 1 * Time.deltaTime;
	}
}

function OnMouseExit ()
{
	myRenderer.material.shader = originalShader;
	myRenderer.material.color = Color.white;
}


function OnMouseUpAsButton ()
{
	if (levelManager.isChangingLevel)
		return;

	yield;
	switch (buttonType)
	{
		case ButtonFunction.Start:
			levelManager.WannaPlay();
			LevelManager.menuMode = false;
			SendMessageUpwards("OnClickPlay");
			break;
		case ButtonFunction.Credits:
			for (var i=0 ; i < creditsBubbles.Length; i++)
			{
				Instantiate (creditsBubbles[i],Vector3 (Random.Range(-5,5), -8, transform.position.z -1),Quaternion.LookRotation(Vector3.up));
			}
			break;
		case ButtonFunction.Exit:
			Application.Quit();
		break;
		case ButtonFunction.ChangeLvl:
			levelManager.LevelUp();
			levelManager.Restart();
			levelManager.CreateMenu();
		break;
		case ButtonFunction.FittingRoom:
			playerMovementOnMenu.inFittingRoom = true;
		break;
		default:
		break;
	}
}


function TurnOffMenu ()
{
	print ("turnOff");
	LevelManager.menuMode = false;
}