#pragma strict
private var startRotate : boolean;
function Update ()
{
	transform.Translate(2 * transform.forward * Time.deltaTime);
	if (startRotate)
		transform.Rotate (0,15 * Time.deltaTime,0);
}

function OnTriggerEnter (collider : Collider)
{
	if (collider.tag == "Player")
		transform.LookAt(collider.transform);
	else
		startRotate = true;
}

function OnTriggerExit ()
{
	startRotate = false;
}