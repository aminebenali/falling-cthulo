/*
Controller Camera:
	There are two camera option : Standard and Action.
	Here the script manages camera in order to smooth follow the aircraft.
	If "action" camera is selected, then camera is turning with aircraft otherwise camera is stable in Y axis while following in Z axis.
*/

// The target we are following
private var target : Transform;

// The distance in the x-z plane to the target
var distanceForCamera1 : float = 1.85; 
var distanceForCamera2 : float = 2.25;

// the height we want the camera to be above the target
var heightForCamera1 : float = 0.35;
var heightForCamera2 : float = 0.31;

// How much we 
var followFactorXForCamera1 : float = 0.8;
var followFactorYForCamera1 : float = 0.8;

var followFactorXForCamera2 : float = 0.8;
var followFactorYForCamera2 : float = 0.8;
var followFactorRotationForCamera2 : float = 0.2;


private var maxX : float = 1.65;
private var minX : float = -maxX;
private var maxY : float = 3.07;
private var minY : float = 0.26;

var isCamera1: boolean = true;

var smoothRotationForCamera2 : boolean = true;
//var txtRotation : GUIText;
private var currentCameraOption: int = 1;

function Start(){
	target = ControllerXCode.currentAircraftTransform;
	
	//For Performance issue
	var distances = new float[32];
	distances[9] = 47; 	//rocket level
	distances[10] = 62; 	//gate level
    distances[11] = 17; 	//bonus level
    distances[12] = 62;	//effects level
    camera.layerCullDistances = distances;
}

private var isGameFinishedAndDirty : boolean = false;
private var lastPositionZ : float ;

	
function LateUpdate (){
	// Early out if we don't have a target
	if (target){
		if(!ControllerXCode.isGameFinished){
			//Camera 1
			if(ControllerXCode.selectedCamera == CameraOption.Camera1Standart){
				transform.position.x = Mathf.Clamp(Mathf.Lerp (transform.position.x, target.position.x, followFactorXForCamera1), minX, maxX);
				transform.position.y = Mathf.Clamp(Mathf.Lerp (transform.position.y, target.position.y + heightForCamera1, followFactorYForCamera1),minY, maxY);
				transform.position.z = target.position.z - distanceForCamera1;
				transform.LookAt (target.position);
			}
			//Camera 2
			else if(currentCameraOption == CameraOption.Camera2Action){
				var offsetDistance : Vector3 =  target.rotation * Vector3(0, heightForCamera2, 0) ;
				
				transform.rotation = Quaternion.Lerp (transform.rotation, Quaternion.LookRotation(target.position - transform.position, target.up), followFactorRotationForCamera2);
				
				transform.position.x = Mathf.Clamp(Mathf.Lerp (transform.position.x, target.position.x + offsetDistance.x, followFactorXForCamera2), minX, maxX);
				transform.position.y = Mathf.Clamp(Mathf.Lerp (transform.position.y, target.position.y + offsetDistance.y, followFactorYForCamera2),minY, maxY);
				transform.position.z = target.position.z - distanceForCamera2;
				
			}
		}
		else{
			//do nothing- the game is finished
			if(!isGameFinishedAndDirty){
				lastPositionZ = transform.position.z;
				isGameFinishedAndDirty = true;
			}
			transform.position.z =  Mathf.Lerp(transform.position.z, lastPositionZ + 5, 0.01) ;
		}
	}
	else{
		//do nothing- aircraft is died :(
	}
}
