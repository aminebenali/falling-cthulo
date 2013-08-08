//SmoothFollowCthulo 08/03/2013
//How to use: Put this code menu buttons
//What it does: Menu button actions
//Last Modified: 04/04/2013
//by Yves J. Albuquerque

#pragma strict

enum ButtonFunction {Start, Credits, Exit, ChangeLvl, FittingRoom, Shop, Achievement, ChangeSkin, ChangeColor, NextChar, PreviousChar, Retry, Quit}; //Button Types
var buttonType : ButtonFunction; //Button Type

var creditsBubbles : GameObject[];//Array with bubles from credits
private var myRenderer : Renderer;//Caching component lookup - Optimization Issue
private var myGUITexture : GUITexture;
private var levelManager : LevelManager;
private var originalShader : Shader;
private var alternativeShader : Shader;


@script AddComponentMenu("GUI/Button")

function Start ()
{
	if (renderer)
	{
		myRenderer = renderer;
		originalShader = myRenderer.material.shader;
	}
	else if (guiTexture)
	{
		myGUITexture = guiTexture;
	}

	alternativeShader = Shader.Find("Transparent/Diffuse");
	levelManager = GameObject.FindGameObjectWithTag("GameManager").GetComponent(LevelManager);
}

function OnMouseEnter ()
{
	if (myGUITexture)
		iTween.ScaleTo(gameObject, {"scale": Vector3(0.05,0.05,1.2),"time": 0.7});

    switch (buttonType)
	{
		default:
			//playerMovementOnMenu.inFittingRoom = false;
		break;
	}
}

function OnMouseOver ()
{
	if (!myRenderer)
		return;
	if (levelManager.isChangingLevel)
		return;
		
	myRenderer.material.shader = alternativeShader;
    myRenderer.material.color -= Color(0, 1, 1, 0) * Time.deltaTime;
    if (myRenderer.material.color.a > 0.7)
    {
	    myRenderer.material.color.a -= 1 * Time.deltaTime;
	}
}

function OnMouseExit ()
{
	if (myGUITexture)
		iTween.ScaleTo(gameObject, {"scale": Vector3(0,0,1),"time": 0.7});
	if (myRenderer)
	{
		myRenderer.material.shader = originalShader;
		myRenderer.material.color = Color.white;
	}
}


function OnMouseUpAsButton ()
{
	if (MenuManager.inFittingRoom)
	{
		SendMessageUpwards("OnClickDesCustom");
		MenuManager.inFittingRoom = false;
		return;
	}

	yield;
	switch (buttonType)
	{
		case ButtonFunction.Start:
			levelManager.WannaPlay();
			SendMessageUpwards("OnClickPlay");
			break;
		case ButtonFunction.Credits:
			SendMessageUpwards("OnClickCredits");
			for (var i=0 ; i < creditsBubbles.Length; i++)
			{
				Instantiate (creditsBubbles[i],Vector3 (Random.Range(-5,5), -8, transform.position.z -1),Quaternion.LookRotation(Vector3.up));
			}
			break;
		case ButtonFunction.Shop:
			SendMessageUpwards("OnClickShop");
		break;
		case ButtonFunction.ChangeLvl:
			SendMessageUpwards("OnClickChangeStage");
			levelManager.LevelUp();
			levelManager.Restart();
		break;
		case ButtonFunction.FittingRoom:
				SendMessageUpwards("OnClickCustom");
				MenuManager.inFittingRoom = true;
		break;
		case ButtonFunction.ChangeColor:
			SendMessageUpwards("OnClickChangeColor");
		break;
		case ButtonFunction.ChangeSkin:
			SendMessageUpwards("OnClickChangeSkin");
		break;
		case ButtonFunction.PreviousChar:
			SendMessageUpwards("OnClickPreviousChar");
		break;
		case ButtonFunction.NextChar:
			SendMessageUpwards("OnClickNextChar");
		break;
		case ButtonFunction.Retry:
			SendMessageUpwards("OnClickRetry");
			LevelManager.gameStatus = GameStatus.StartMenu;
			levelManager.Restart ();
		break;
		case ButtonFunction.Quit:
			SendMessageUpwards("OnClickQuit");
			Application.Quit();
		break;
	}
}