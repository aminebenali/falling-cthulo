#pragma strict

class Quit extends Button2d
{
	function OnMouseUpAsButton ()
	{
		print ("Quit");
		Application.Quit();
	}
}

