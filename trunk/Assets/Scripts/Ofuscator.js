//Destroyer 25/2/2013
//How to use: Put this code into on the ofuscator. The ofuscator is a plane in front of the camera.
//What it does: Progressivally change the ofuscator color
//Last Modified: 15/3/2013
//by Yves J. Albuquerque

#pragma strict

var startOfuscation : int = 5;
var maxHeight : int = 10;

var myMaterial : Material;//Caching component lookup - Optimization Issue
var myTransform : Transform;//Caching component lookup - Optimization Issue

@script AddComponentMenu("Generics/Ofuscator")

function Start ()
{
	myMaterial = renderer.material;
	myTransform = transform;
}
function Update ()
{
	if (myTransform.position.y > startOfuscation)
		myMaterial.color.a = (myTransform.position.y - startOfuscation)/maxHeight;
	else
		myMaterial.color.a = 0;
}