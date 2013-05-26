//OftenControl 25/5/2013
//How to use: Put this code into your prefab
//What it does: The prefab sometimes comes up and sometimes don`t
//Last Modified:25/5/2013
//by Yves J. Albuquerque

#pragma strict
var chanceToAppear : float = 30;
private var originalLocalYPosition : float;

function Awake ()
{
	originalLocalYPosition = transform.localPosition.y;
}

function OnSpawned ()
{
	if (Random.value * 100 < chanceToAppear)
		transform.localPosition.y = originalLocalYPosition;
	else
		transform.localPosition.y = -1000;
}