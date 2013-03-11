//Destroyer 25/2/2013
//How to use: Put this code into on the ofuscator. The ofuscator is a plane in front of the camera.
//What it does: Progressivally change the ofuscator color
//Last Modified: 1/3/2013
//by Yves J. Albuquerque

#pragma strict

var startOfuscation : int = 5;
var maxHeight : int = 10;


function Update ()
{
	if (transform.position.y > startOfuscation)
		renderer.material.color.a = (transform.position.y - startOfuscation)/maxHeight;
	else
		renderer.material.color.a = 0;
}