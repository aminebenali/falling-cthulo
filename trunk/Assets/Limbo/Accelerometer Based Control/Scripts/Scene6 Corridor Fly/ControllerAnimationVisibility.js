/*
Controller Animation Visibility:
	This script is attached each bonus objects' "Renderer" part.
	It is used for performance issues.
	Here, if object is visible then the animation has started playing, otherwise it is stopped.
	
*/

private var parentAnimation : Animation;
private var colliderAttached : Collider;

function Awake () {
	parentAnimation = transform.parent.animation;
	colliderAttached = collider;
	parentAnimation.enabled = false;
	colliderAttached.enabled = false;
}

function OnBecameVisible () {
	parentAnimation.enabled = true;
    colliderAttached.enabled = true;
}

function OnBecameInvisible () {
   parentAnimation.enabled = false;
   colliderAttached.enabled = false;
}
 