//SmoothFollowCthulo 08/03/2013
//How to use: Put this code menu buttons
//What it does: Menu button actions
//Last Modified: 8/03/2013
//by Yves J. Albuquerque

#pragma strict

enum ButtonFunction {Start, Credits, Exit};
var buttonType : ButtonFunction;

var creditsBubbles : GameObject[];

function Start ()
{
	
}

function OnMouseOver ()
{
    renderer.material.color -= Color(0, 0, 1) * Time.deltaTime;
}

function OnMouseExit ()
{
    renderer.material.color = Color.white;
}


function OnMouseUpAsButton ()
{
	if (ButtonFunction.Start)
		LevelManager.menuMode = false;
		
	if (ButtonFunction.Credits)
	{
		for (var i=0 ; i < creditsBubbles.Length; i++)
		{
			Instantiate (creditsBubbles[i],Vector3 (Random.Range(-5,5), -8, -2),Quaternion.LookRotation(Vector3.up));
		}
	}
	
	if (ButtonFunction.Exit)
		Application.Quit();
}