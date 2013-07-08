#pragma strict

class Retry extends Button2d
{
	private var levelManager : LevelManager;

	function Start ()
	{
		levelManager = GameObject.FindGameObjectWithTag("GameManager").GetComponent(LevelManager);
	}
	function OnMouseUpAsButton ()
	{
		LevelManager.gameStatus = GameStatus.StartMenu;
		levelManager.Restart ();
	}
}