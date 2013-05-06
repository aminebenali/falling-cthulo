/*
Gate Animation:	
	This script is used by Map Generation script. It is used for determining that the aircraft is enough close to the gate to start the animation.
	Here, in this game; some gates are closing slowly within given animation but the starting distance is different from each other. 
	In the first sectors, the distance is close but in the last sectors the distance becomes longer in order to make hard to pass the gate.
	Note: If gate is visible then animation is enabled otherwise disabled.
*/
var distanceFromAircraft : float = 10.0;
var wrapModeAnimation : WrapMode = WrapMode.ClampForever;
var animationSpeed : float = 1.0;

private var animationAttached : Animation;

function Awake () {
	animationAttached = animation;
	animationAttached.wrapMode = wrapModeAnimation;
	// Make all animations in this character play at half speed
		for (var state : AnimationState in animationAttached) {
    		state.speed = animationSpeed;
		}
	
	animationAttached.enabled = false;
	enabled = false;
}

private var hasStartedPlay : boolean = false;
function Update () {
	// Early out if the player is too far away.
    if (!hasStartedPlay && (ControllerXCode.isUserAlive && Vector3.Distance(transform.position, ControllerXCode.currentAircraftTransform.position) < distanceFromAircraft)){
    	animation.Play();
    	hasStartedPlay = true;
    }
     // perform real work work...
}

function OnBecameVisible () {
	animationAttached.enabled = true;
    enabled = true;
}

function OnBecameInvisible () {
	//Debug.Log("Animation is invisible " + transform.name);
    animationAttached.enabled = false;
    enabled = false;
}
