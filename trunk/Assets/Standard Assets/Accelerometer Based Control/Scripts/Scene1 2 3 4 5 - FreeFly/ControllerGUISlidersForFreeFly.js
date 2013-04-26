var scriptControllerTransformByAccelerometer : ControllerAircraftByAccelerometerForFreeFly;

public var skinSmallScreen : GUISkin;
public var skinBigScreen : GUISkin;
private var isBigScreen : boolean = false;

private var isiPhone4 : boolean = false;

function OnGUI () {

	GUI.skin = isBigScreen?skinBigScreen:skinSmallScreen; //GUI skin is changed for bigger screen!
	
	GUI.Label (Rect (Screen.width  * 0.6, Screen.height  * 0.12, Screen.width  * 0.5, Screen.height  * 0.1), String.Format("Yaw Sensitivity :{0:F2}", scriptControllerTransformByAccelerometer.sensitivtyRigidBodyRotation.y) , GUI.skin.GetStyle("InGame"));
	scriptControllerTransformByAccelerometer.sensitivtyRigidBodyRotation.y = GUI.HorizontalSlider (Rect (Screen.width  * 0.05, Screen.height  * 0.07, Screen.width  * 0.8, Screen.height  * 0.039), scriptControllerTransformByAccelerometer.sensitivtyRigidBodyRotation.y, 0.0, 1.0, GUI.skin.GetStyle("SliderBack"), GUI.skin.GetStyle("SliderThumb"));
	
	GUI.Label (Rect (Screen.width  * 0.008, Screen.height  * 0.18, Screen.width  * 0.5, Screen.height  * 0.1), String.Format("Pitch Sensitivity :{0:F2}", scriptControllerTransformByAccelerometer.sensitivtyRigidBodyRotation.x), GUI.skin.GetStyle("InGame"));
	scriptControllerTransformByAccelerometer.sensitivtyRigidBodyRotation.x = GUI.VerticalSlider (Rect (15, Screen.height  * 0.22, Screen.width  * 0.03, Screen.height  * 0.7), scriptControllerTransformByAccelerometer.sensitivtyRigidBodyRotation.x, 1.0, 0.0, GUI.skin.GetStyle("SliderBack"), GUI.skin.GetStyle("SliderThumb"));
	
	GUI.Label (Rect (Screen.width  * 0.1, Screen.height  * 0.84, Screen.width  * 0.5, Screen.height  * 0.1), String.Format("Roll Sensitivity :{0:F2}", scriptControllerTransformByAccelerometer.sensitivtyRigidBodyRotation.z), GUI.skin.GetStyle("InGame"));
	scriptControllerTransformByAccelerometer.sensitivtyRigidBodyRotation.z = GUI.HorizontalSlider (Rect (Screen.width  * 0.1, Screen.height  * 0.90, Screen.width  * 0.8, Screen.height  * 0.039), scriptControllerTransformByAccelerometer.sensitivtyRigidBodyRotation.z, 0.0, 1.0, GUI.skin.GetStyle("SliderBack"), GUI.skin.GetStyle("SliderThumb"));

}

function Start(){
	isBigScreen = (Screen.width > 500)?true:false;
}