#pragma strict
private var myGUITexture : GUITexture;

function Start ()
{
	myGUITexture = guiTexture;
}

function OnMouseEnter ()
{
	iTween.ScaleTo(gameObject, {"scale": Vector3(0.05,0.05,1.2),"time": 0.7});
}

function OnMouseExit ()
{
	iTween.ScaleTo(gameObject, {"scale": Vector3(0,0,1),"time": 0.7});
}



