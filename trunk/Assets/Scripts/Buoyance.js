//Level Manager 18/6/2013
//How to use: Put this code into a Game Object
//What it does: Simulates Bouyance
//Last Modified: 18/6/2013
//by Yves J. Albuquerque

#pragma strict

var speed : float = 1;
var xAmplitude : float = 1;
var yAmplitude : float = 1;

private var x0:float;
private var y0:float;

function Start ()
{
	speed = Random.Range(speed/2,speed);
	xAmplitude = Random.Range(xAmplitude/2,xAmplitude);
	yAmplitude = Random.Range(yAmplitude/2,yAmplitude);

	x0 = transform.position.x;
	y0 = transform.position.y;
}

function Update ()
{
	// Put the floating movement in the Update function:
	transform.position.x = x0+xAmplitude*Mathf.Sin(speed*Time.time);
	transform.position.y = y0+yAmplitude*Mathf.Sin(speed*Time.time);
}
