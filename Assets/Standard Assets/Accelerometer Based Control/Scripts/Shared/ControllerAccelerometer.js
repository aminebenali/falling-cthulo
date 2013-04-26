/*
Controller Accelerometer:
        This script is used for getting angle in X-axis, Y-axis and Z-axis from accelerometer data directly.
        If there is a Gyroscope controller, than is switches to Gyroscope instead of Accelerometer.

        Firstly, the code gets the initial device orientation (Automatic is selected by default, but you can change it).
        Secondly, accelerometer data is taken and flaged as initial and rotated in 3d according to initial position (according to device orientation)
        Thirdly, the accelerometer data is calculated to produce angle
        In addition, whenever user select need calibration at that time the controller is calibrated.

        The calibration is done each time at the start and according to user need.

        Check our game "Corridor Fly" in the App Store to see the real behavior.

*/

enum CalibrationStatus {NeedCalibrationAtStart, NeedCalibration, InCalibrating, Calibrated};

public var calibrationStatus : CalibrationStatus = CalibrationStatus.NeedCalibrationAtStart; // whenever calibration is need, then you should make this flag NeedCalibration. Initially this flag is NeedCalibration in order to start your control in calibrated at start time (at t=0)
public var calibrationTime : int = 0; //the calibration time, if it is 0 then the acceleration data at that time is used. If it is 3 for example, then 3 Acceleration Data is averaged and used as calibration offset.
private var calibrationTimeIndex : int = 0;

//public var smoothnessGeneral : float = 0.5; //general rotation smoothness. [0.0, 1.0]. If it is 0.1 then the control changes the output very slowly, but with 0.9 the angle change will be very fast. 0.0 = no change, 1.0= direct change
public var isReverseControl : boolean = false; //if you would like to use reverse control just change this flag as true. The reverse control affects the vertical (Y-axis rotation), not the general.

public var smoothnessOfAngles : Vector3 = Vector3.one; // The smoothness for each X-axis (Pitch), Y-axis (Yaw) and Z-axis (Roll) acceleration data [0.0, 1.0]. (1 is identical)
public var limitAnglesInDegree : Vector3 = Vector3(360.0, 360.0, 360.0); // The limit in output in X-axis (Pitch), Y-axis (Yaw) and Z-axis (Roll) [0.0, 360.0]

private var tempCalibrationOffset : Vector3 = Vector3.zero; //The TEMP calibration offset for X-axis (Pitch), Y-axis (Yaw) and Z-axis (Roll)
private var calibrationOffset : Vector3 = Vector3.zero; //The calibration offset for X-axis (Pitch), Y-axis (Yaw) and Z-axis (Roll)

private var angleRaw : Vector3 = Vector3.zero; //The raw angle for X-axis (Pitch), Y-axis (Yaw) and Z-axis (Roll)
private var angleCalibrated : Vector3 = Vector3.zero; //The calibrated angle for X-axis (Pitch), Y-axis (Yaw) and Z-axis (Roll)
private var angleSmoothed : Vector3 = Vector3.zero; //The multiplied angle by sensitivty multiplier for X-axis (Pitch), Y-axis (Yaw) and Z-axis (Roll)
private var angleLimited : Vector3 = Vector3.zero; //The limits are applied to the angles, it is used as pre-ready output angle

private var accelerationQuaternionToMakeStandart : Quaternion;
private var acclerationStandart : Vector3 = Vector3(0, -1, 0);

private var accelerationDataRaw : Vector3 = Vector3.zero;
private var accelerationData : Vector3 = Vector3.zero;

private var lastOrientation : ScreenOrientation = ScreenOrientation.Unknown; //We can store the last orientation value in order to understand that the orientation is changed or not. If orientation is changed, then calibration need flag is set TRUE.

public var outputAngle : Vector3 = Vector3.zero; //The output angles (in Degree) for X-axis (Pitch), Y-axis (Yaw) and Z-axis (Roll)
public var editorModeScreenOrientation : ScreenOrientation = ScreenOrientation.LandscapeLeft;

function Start(){
        calibrationStatus = CalibrationStatus.NeedCalibrationAtStart;
        calibrationTimeIndex = 0;
        tempCalibrationOffset = Vector3.zero;
        lastOrientation = Screen.orientation;
}


function AdjustAccelerationDataAccordingToOrientation(){

        accelerationDataRaw = Input.acceleration;

        if(accelerationDataRaw == Vector3.zero){        //We are cheking that whether there is an acceleration or not. In debug mode, we are simulating that the acceleration as standart, otherwise there is an acceleration so the code is skipped!
                accelerationDataRaw = acclerationStandart;
        }

        if (!Application.isEditor) // In Game Mode
        {
        
            switch(Screen.orientation){
            	#if UNITY_4_0
					case ScreenOrientation.LandscapeLeft:  //Right Home Button
					case ScreenOrientation.LandscapeRight:  //Left Home Button
					case ScreenOrientation.PortraitUpsideDown:  //upside Down
					case ScreenOrientation.Portrait:  //In normal case
						// do nothing extra
						accelerationData = accelerationDataRaw;
						break;
					default:
						accelerationData = Vector3.zero;
						Debug.LogError("Device orientation is not a valid type : " + Screen.orientation); //Error - unknown orientation
						break;
				#endif
				#if UNITY_2_6 || UNITY_2_6_1 || UNITY_3_0 || UNITY_3_0_0 || UNITY_3_1 || UNITY_3_2 || UNITY_3_3 || UNITY_3_4 || UNITY_3_5
				
					#if UNITY_ANDROID
						  case ScreenOrientation.LandscapeLeft:  //Right Home Button
                                accelerationData = Vector3(-accelerationDataRaw.y, accelerationDataRaw.x, accelerationDataRaw.z);
                                break;
                        case ScreenOrientation.LandscapeRight:  //Left Home Button
                                //accelerationData = Vector3(accelerationDataRaw.y, -accelerationDataRaw.x, accelerationDataRaw.z);
                                accelerationData = Vector3(-accelerationDataRaw.y, accelerationDataRaw.x, accelerationDataRaw.z);
                                break;
                        case ScreenOrientation.PortraitUpsideDown:  //upside Down
                        		accelerationData = Vector3(-accelerationDataRaw.y, accelerationDataRaw.x, accelerationDataRaw.z);
                                //accelerationData = Vector3(-accelerationDataRaw.x, -accelerationDataRaw.y, accelerationDataRaw.z);
                                break;
                        case ScreenOrientation.Portrait:  //In normal case
                                // do nothing extra
                                accelerationData = Vector3(-accelerationDataRaw.y, accelerationDataRaw.x, accelerationDataRaw.z);
                                //accelerationData = accelerationDataRaw;
                                break;
                        default:
                                accelerationData = Vector3.zero;
                                Debug.LogError("Device orientation is not a valid type : " + Screen.orientation); //Error - unknown orientation
                                break;
					#endif
					
					#if UNITY_IPHONE
                        case ScreenOrientation.LandscapeLeft:  //Right Home Button
                                accelerationData = Vector3(-accelerationDataRaw.y, accelerationDataRaw.x, accelerationDataRaw.z);
                                break;
                        case ScreenOrientation.LandscapeRight:  //Left Home Button
                                accelerationData = Vector3(accelerationDataRaw.y, -accelerationDataRaw.x, accelerationDataRaw.z);
                                break;
                        case ScreenOrientation.PortraitUpsideDown:  //upside Down
                        		accelerationData = Vector3(-accelerationDataRaw.x, -accelerationDataRaw.y, accelerationDataRaw.z);
                                break;
                        case ScreenOrientation.Portrait:  //In normal case
                                // do nothing extra
                                accelerationData = accelerationDataRaw;
                                break;
                        default:
                                accelerationData = Vector3.zero;
                                Debug.LogError("Device orientation is not a valid type : " + Screen.orientation); //Error - unknown orientation
                                break;
                    #endif
                 #endif
                };
       }
       else{ // In Editor Mode - In editor mode, you can't select the orientation. However, you can now select your demanded orientation and select it on editor.
                switch(editorModeScreenOrientation){
                        case ScreenOrientation.LandscapeLeft:  //Right Home Button
                                accelerationData = Vector3(-accelerationDataRaw.y, accelerationDataRaw.x, accelerationDataRaw.z);
                                break;
                        case ScreenOrientation.LandscapeRight:  //Left Home Button
                                accelerationData = Vector3(accelerationDataRaw.y, -accelerationDataRaw.x, accelerationDataRaw.z);
                                break;
                        case ScreenOrientation.PortraitUpsideDown:  //upside Down
                                accelerationData = Vector3(-accelerationDataRaw.x, -accelerationDataRaw.y, accelerationDataRaw.z);
                                break;
                        case ScreenOrientation.Portrait:  //In normal case
                                // do nothing extra
                                accelerationData = accelerationDataRaw;
                                break;
                        default:
                                accelerationData = Vector3.zero;
                                Debug.LogError("Device orientation is not a valid type : " + Screen.orientation); //Error - unknown orientation
                                break;
                };
        }


        if(lastOrientation != Screen.orientation){ // Orientation has changed! Need re-calibration!
                lastOrientation = Screen.orientation;
                Debug.Log("Orientation changed " + lastOrientation + " Time " + Time.time);

                //If auto rotation applies, we should wait some time to finish rotation. Otherwise, calibration is set immediately.
                if(Screen.autorotateToLandscapeLeft ||  Screen.autorotateToLandscapeRight || Screen.autorotateToPortrait || Screen.autorotateToPortraitUpsideDown){
                        yield WaitForSeconds(0.3);
                        calibrationStatus = CalibrationStatus.NeedCalibration;
                        Debug.Log("Calibration has done - Time " + Time.time);
                }
                else{
                        calibrationStatus = CalibrationStatus.NeedCalibration;
                        Debug.Log("Calibration has done - Time " + Time.time);
                }

        }
        else{
                //do nothing. Everything should remain same
        }

}

function AdjustCalibration(){
        if(calibrationStatus == CalibrationStatus.NeedCalibrationAtStart){
                calibrationStatus = CalibrationStatus.InCalibrating;
                tempCalibrationOffset += angleRaw / (calibrationTime + 1);
                calibrationTimeIndex++;

                if(calibrationTimeIndex > calibrationTime){
                        accelerationQuaternionToMakeStandart = Quaternion.FromToRotation(accelerationData, acclerationStandart);
                        calibrationStatus = CalibrationStatus.NeedCalibration;
                        calibrationOffset = tempCalibrationOffset;
                        tempCalibrationOffset = Vector3.zero;
                        calibrationTimeIndex = 0;
                }
                //Debug.Log("Calibration At First: " + tempCalibrationOffset + " Quaternion: " + accelerationQuaternionToMakeStandart.eulerAngles + " Angle: " + outputAngle);
        }
        else if(calibrationStatus == CalibrationStatus.NeedCalibration){
                calibrationStatus = CalibrationStatus.InCalibrating;
                tempCalibrationOffset += angleRaw / (calibrationTime + 1);
                calibrationTimeIndex++;

                if(calibrationTimeIndex > calibrationTime){
                        accelerationQuaternionToMakeStandart = Quaternion.FromToRotation(accelerationData, acclerationStandart);
                        calibrationStatus = CalibrationStatus.Calibrated;
                        calibrationOffset = tempCalibrationOffset;
                        tempCalibrationOffset = Vector3.zero;
                        calibrationTimeIndex = 0;
                }
                //Debug.Log("Calibrated: " + tempCalibrationOffset + " Quaternion: " + accelerationQuaternionToMakeStandart.eulerAngles + " Angle: " + outputAngle);
        }
        else{
                //do nothing - no calibration is needed
        }
}

function setRawAngles(){
        angleRaw.x = normalizeAngle(- 90 - Mathf.Rad2Deg * Mathf.Atan2(accelerationData.y, accelerationData.z));

        var acceleratorYaw : Vector3 =  (accelerationQuaternionToMakeStandart * accelerationData);
        angleRaw.y = normalizeAngle(90 + Mathf.Rad2Deg * Mathf.Atan2(acceleratorYaw.y, acceleratorYaw.x));
        angleRaw.z = normalizeAngle(-angleRaw.y);
        //print("Angle Raw : " + angleRaw);
}

function setCalibratedAngles(){
        angleCalibrated.x = normalizeAngle(angleRaw.x - calibrationOffset.x);
        angleCalibrated.y = angleRaw.y;
        angleCalibrated.z = angleRaw.z;
        //print("Angle Calibrated : " + angleCalibrated);
}


function setSmoothedAngles(){
        if(calibrationStatus == CalibrationStatus.Calibrated){ //Smoothing should be done after calibration finished!
                angleSmoothed.x =  normalizeAngle(Mathf.LerpAngle(angleSmoothed.x, angleCalibrated.x, smoothnessOfAngles.x));
                angleSmoothed.y =  normalizeAngle(Mathf.LerpAngle(angleSmoothed.y, angleCalibrated.y, smoothnessOfAngles.y));
                angleSmoothed.z =  normalizeAngle(Mathf.LerpAngle(angleSmoothed.z, angleCalibrated.z, smoothnessOfAngles.z));
                //print("Angle Smoothed : " + angleSmoothed);
        }
}

function setLimitsOfAngles(){
        angleLimited.x = Mathf.Clamp(angleSmoothed.x, -limitAnglesInDegree.x, limitAnglesInDegree.x);
        angleLimited.y = Mathf.Clamp(angleSmoothed.y, -limitAnglesInDegree.y, limitAnglesInDegree.y);
        angleLimited.z = Mathf.Clamp(angleSmoothed.z, -limitAnglesInDegree.z, limitAnglesInDegree.z);
        //print("Angle Limited : " + angleLimited);
}

function setOutputAngles(){

        if(calibrationStatus == CalibrationStatus.Calibrated){
                outputAngle = angleLimited;

                if(isReverseControl){
                        outputAngle.x = -1 * outputAngle.x;
                }
                else{
                        //do nothing
                }
        }
}


function Calibrate(){
        calibrationStatus = CalibrationStatus.NeedCalibration;
}

//Utility function to make angles between -180 to +180 , 0 is the origin angle
function normalizeAngle(angleToNormalize:float) : float{
        if(angleToNormalize < -180){
                angleToNormalize = angleToNormalize + 360;
        }
        else if(angleToNormalize > 180){
                angleToNormalize = angleToNormalize - 360;
        }
        else{
                //do nothing
        }
        return angleToNormalize;
}


function Update() {
        AdjustAccelerationDataAccordingToOrientation();
        AdjustCalibration();
        setRawAngles();
        setCalibratedAngles();
        setSmoothedAngles();
        setLimitsOfAngles();
        setOutputAngles();

        //print("Screen Orientation : " + Screen.orientation + " AP-" + Screen.autorotateToPortrait + " APUD-" + Screen.autorotateToPortraitUpsideDown  + " ALL-" + Screen.autorotateToLandscapeLeft + " ALR-" + Screen.autorotateToLandscapeRight + " Device Orientation : " + Input.deviceOrientation );

        //print("Orientation" + Screen.orientation + " Input Data:" + accelerationDataRaw + ", Acceleration Data: " + accelerationData + ", Raw Angle" + angleRaw + ", Calibrated Angle"+ angleCalibrated + ", Smoothed Angle" + angleSmoothed + "Output Angle" + outputAngle);
}

