/*
Controller Camera:
	There are two camera option : Standard and Action.
	Here the script manages camera in order to smooth follow the aircraft.
	If "action" camera is selected, then camera is turning with aircraft otherwise camera is stable in Y axis while following in Z axis.
*/

/*

// The target we are following
 var target : Transform;

// The distance in the x-z plane to the target
var distanceForCamera1 : float; 
// the height we want the camera to be above the target
var heightForCamera1 : float;
// How much we 
var followFactorXForCamera1 : float;
var followFactorYForCamera1 : float;

var followFactorRotationForCamera1 : float;

	
function LateUpdate (){
	// Early out if we don't have a target
	if (target){
	
		transform.position.x = Mathf.Lerp (transform.position.x, target.position.x, followFactorXForCamera1);
		transform.position.y = Mathf.Lerp (transform.position.y, target.position.y + heightForCamera1, followFactorYForCamera1);
		transform.position.z = target.position.z - distanceForCamera1;
		transform.LookAt (target.position);
		
		
	}
	else{
		//do nothing- the aircraft is not in scene
	}
}

*/

/*
This camera smoothes out rotation around the y-axis and height.
Horizontal Distance to the target is always fixed.

There are many different ways to smooth the rotation but doing it this way gives you a lot of control over how the camera behaves.

For every of those smoothed values we calculate the wanted value and the current value.
Then we smooth it using the Lerp function.
Then we apply the smoothed values to the transform's position.
*/

// The target we are following
var target : Transform;
// The distance in the x-z plane to the target
var distance = 10.0;
// the height we want the camera to be above the target
var height = 5.0;
// How much we 
var heightDamping = 2.0;
var rotationDamping = 3.0;

// Place the script in the Camera-Control group in the component menu
@script AddComponentMenu("Camera-Control/Smooth Follow")

private var wantedRotationAngle : float;
private var wantedHeight : float;

private var currentRotationAngle : float;
private var currentHeight : float;

private var currentRotation : Quaternion;


function LateUpdate () {
    // Early out if we don't have a target
    if (!target)
        return;

    // Calculate the current rotation angles
    wantedRotationAngle = target.eulerAngles.y;
    wantedHeight = target.position.y + height;

    currentRotationAngle = transform.eulerAngles.y;
    currentHeight = transform.position.y;

    // Damp the rotation around the y-axis
    currentRotationAngle = Mathf.LerpAngle (currentRotationAngle, wantedRotationAngle, rotationDamping * Time.deltaTime);

    // Damp the height
    currentHeight = Mathf.Lerp (currentHeight, wantedHeight, heightDamping * Time.deltaTime);

    // Convert the angle into a rotation
    currentRotation = Quaternion.Euler (0, currentRotationAngle, 0);

    // Set the position of the camera on the x-z plane to:
    // distance meters behind the target
    transform.position = target.position;
    transform.position -= currentRotation * Vector3.forward * distance;

    // Set the height of the camera
    transform.position.y = currentHeight;

    // Always look at the target
    transform.LookAt (target);
    
}
