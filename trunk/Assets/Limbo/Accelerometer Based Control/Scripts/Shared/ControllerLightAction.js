#pragma strict

public var intensityChange : float = 0.5;
public var speedIntensityChange : float = 1;
public var speedRotation : Vector3 = Vector3.zero;

private var lightToControl : Light;
private var initialIntensity : float;

private var isLightExists : boolean;
private var isChangingIntesity : boolean;
private var isChangingRotation : boolean;

function Start () {
	lightToControl = transform.light;
	isLightExists = (lightToControl != null);
	if(isLightExists){
		initialIntensity = lightToControl.intensity;
		isChangingIntesity = (speedIntensityChange > 0);
		isChangingRotation = (speedRotation.magnitude > 0);
	}
}

function Update () {
	if(isLightExists){
		if(isChangingIntesity){
			lightToControl.intensity = initialIntensity + Mathf.PingPong(Time.time * speedIntensityChange, intensityChange);
		}
		if(isChangingRotation){
		 	transform.Rotate(speedRotation * Time.deltaTime);
		}
	}
}