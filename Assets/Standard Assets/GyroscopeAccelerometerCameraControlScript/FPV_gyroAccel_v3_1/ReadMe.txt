(Contact info: MouseSoftware@GMail.com)

This asset is meant to be used to directly map the gyroscope's rotational movements to the (main) camera in the scene, thus creating a First Person View when running the game on a handheld device. If no gyroscope is available on the device, the accelerometer will be used to find the device's rotation (note: rotation around the device's y-axis cannot be determined with an accelerometer). Inside the unity editor, the mouse will be used.

As a ready-to-use example: open the test_scene and compile this for your iOS device. After installing and running it directly on your iOS device, you can freely move around by rotating your device in any direction and/or using the left/right mousebutton. Dragging your finger on the top half of the screen will allow direct changes of the camera's pitch/yaw. 

IMPORTANT: Gyroscopic data can not be read while running the scripts inside the Unity Editor. The Unity editor is running on a desktop/laptop which doesn't have a gyro! Using your iOS device with the Unity Remote app doesn't work either: the Unity Remote app doesn't send gyroscopic data back to the editor. The ONLY way to make this script work is to fully compile it using XCode, installing it and running it DIRECTLY on your iOS device.


********************************************************************************
Quick Start: Using the 'FPV_character' Prefab
********************************************************************************

The 'FPV_character' Prefab is a simple First Person View Character that you can add to your scene. It contains two parts: 
- The 'Body', which is basically a standard Character Controller with a separate node to indicate the position of the 'Head'. This node will be used to place the camera.
- The 'GyroCam', which contains all scripts to handle gyroscope/accelerometer and joystick controls. Each script has configurable variables that can be set in the Inspector window. Most of them are self-explanatory, and already have ready-to-use settings. See the following sections for more details on each setting per script:

=======================
 FPV_GyroAccelScript.js
=======================
Sets the current rotation as determined by the gyroscope. If no gyroscope is available, the accelerometer will be used to find the device's rotation (note: rotation around the device's y-axis cannot be determined with an accelerometer). Inside the unity editor, the mouse will be used.

**** Public variables:
* 'pitchOffset' (float) --> The pitch angle of the device's horizon. Usefull for configuring your gameplay to a convenient playing angle.

* 'yawOffset' (float) --> By default, the script starts looking 'north'. Change this value to start with a different direction.

* 'gyroSmoothFactor' (float) --> Decreasing the value of 'gyroSmoothFactor' will result in smoother, but slower, movement while using the gyroscope.

* 'accelerometerSmoothFactor' (float) --> Decreasing the value of 'accelerometerSmoothFactor' will result in smoother, but slower, movement while using the accelerometer.

* 'mouseSensitivity (float) and 'invertMouseAxis (boolean) --> While inside the unity editor, the mouse will be used to look around. This is useful when testing other parts of your project. The sensitivity can be set with 'mouseSensitivity', and mouse movements can be inverted with 'invertMouseAxis'.

**** The following functions can be called by other scripts (by using SendMessage or BroadcastMessage):
* function AddYawOffsetToGyroscope(yawToAdd : float) --> Add an (extra) yaw to the rotation (e.g. when using a joystick button)

* function AddPitchOffsetToGyroscope(PitchToAdd : float) --> add an (extra) pitch to the rotation (e.g. when using a joystick button)

* function SetForwardLookingDirection(dir : Vector3) --> instantiantly sets the forward looking vector 

=====================
 FPV_JoystickRight.js
=====================
Controls the right joystick button, e.g. adding extra rotation ('turning')
Note: attach this script to the same gameobject that holds the FPV_GyroAccelScript, because it sends a message to this script which calls the method 'AddYawOffsetToGyroscope'

**** Public variables:
* 'joystickTexture' (Texture) and 'joystickBackgroundTexture' (Texture) --> If specified, the joystick will be drawn using the joystickTexture. It's bckground will be drawn using the joystickBackgroundTexture.

* 'joystickRelSize' (float) --> The maximum size of the joystick button (in relative screen coordinates)

* 'joystickRelativeTouchArea' (Rect) --> The joystick will only be drawn when a touch occurs within this Rect. The Rect coordinates are relative coordinates, e.g.: Rect(0,0,1,1) will use the entire screen, Rect(0,0.5,0.5,0.5) will use the lower left corner, etc.

* 'joystickRelDeadZone' (float) --> joystick deadZone (in relative screen coordinates). If the touch is within this radius from the joystick's center, then no movement will be added.
 
* 'joystickRelMaxRadius' (float) --> The maximum radius that the joystick can be moved (in relative screen coordinates)

====================
 FPV_JoystickLeft.js
====================
Controls the left joystick button, e.g. moving left/right/forward/back ('strafing')

**** Public variables:
* 'characterObject' (GameObject) --> The GameObject that should be moved. A CharacterController component must be attached to this GmaeObject. If this variable is left empty, the current gameObject will be used.

* 'joystickTexture' (Texture) and 'joystickBackgroundTexture' (Texture) --> If specified, the joystick will be drawn using the joystickTexture. It's bckground will be drawn using the joystickBackgroundTexture.

* 'joystickRelSize' (float) --> The maximum size of the joystick button (in relative screen coordinates)

* 'joystickRelativeTouchArea' (Rect) --> The joystick will only be drawn when a touch occurs within this Rect. The Rect coordinates are relative coordinates, e.g.: Rect(0,0,1,1) will use the entire screen, Rect(0,0.5,0.5,0.5) will use the lower left corner, etc.

* 'joystickRelDeadZone' (float) --> joystick deadZone (in relative screen coordinates). If the touch is within this radius from the joystick's center, then no movement will be added.
 
* 'joystickRelMaxRadius' (float) --> The maximum radius that the joystick can be moved (in relative screen coordinates)

* 'maxSpeed' (float) --> The maximum speed of the movement

===========================
 FPV_SteeringWheelScript.js
===========================
Enabling this script will simulate a very simple steering wheel effect. It Uses the rotation around the device z-axis to add an extra rotation around the y-axis, by changing the 'yawOffset'-variable in the FPV_GyroAccelScript that is attached to the current GameObject.

**** Public variables:
* 'steeringWheelEnabled' (boolean) --> User setting to enable/disable the steering wheel.

* 'maxRotationSpeed' (float) --> The maximum allowed extra rotation around the vertical axis, in degrees per second.

* 'DeadZoneDegrees' (float) --> Only angles larger than this value will be used. Usefull for compensating small movements, like shaky hands, when holding the device.

* 'playerCamera' (Transform) --> If specified, the rotation of this object will be used, instead of the current GameObject. IMPORTANT: a 'FPV_GyroAccelScript' component must be attached to this Transform!

**** The following functions can be called by other scripts (by using SendMessage or BroadcastMessage):
* function SetSteeringWheelEffect(on_off : boolean) --> enables/disables the steering wheel effect.

=========================
 FPV_TouchDragRotation.js
=========================
This script uses every touch, that occurs within the Rect defined by 'touchSensitiveRectRel', to change the pitch/yaw of the camera, e.g. you can drag your finger across the device's screen to rotate the camera up/down/left/right. 
Note: this script must be addes to the same GameObject that contains the 'FPV_GyroAccelScript' component.

**** public variables:
* 'touchSensitiveRectRel' (Rect) --> Only track touch movements within this Rect. The Rect is defined by relative screen coordinates, e.g.: Rect(0,0,1,1) will use the entire screen, Rect(0,0,1,0.5) will use the top half of the screen, etc.

=======================
 FPV_PlayerBodyParts.js
=======================
Determines the point at which the 'playerCamera' is looking. Then it rotates the 'playerBody' accordingly and places the 'playerCamera' (back) at the 'playerHead' (if no Transforms are supplied, the current transform will be used)

**** public variables:
* playerBody (Transform) --> The player's 'Body'
* playerHead (Transform) --> The player's 'Head' 
* playerCamera (Transform) --> The camera object. Usually this object will contain all 'FPV_GyroAccelScript' and relevant supporting scripts





********************************************************************************
Advanced: Setting up your own First Person View Character
********************************************************************************

- Create an empty GameObject and name it 'gyroCam' or something similar.
- Attach the 'FPV_GyroAccelScript' script to it. This GameObject will now follow the gyroscopes's movements. 
- Add a (main) Camera component to the same GameObject. 
- And you're basically done! The (main) camera can now be used to look around in your gameworld using the gyroscope. 
- For further functionality and to change various orientation settings, you can use the 'SendMessage' or 'BroadcastMessage' commands in other (custom made) scripts. E.g.: 
	'gyroCam.SendMessage('AddYawOffsetToGyroscope',10)' will add 10 degrees to the gyro's yaw offset;
	'gyroCam.SendMessage('AddPitchOffsetToGyroscope',-5)' will subtract 5 degrees from the gyro's pitch offset;
	'gyroCam.SendMessage('SetForwardLookingDirection', Vector3(1,2,3))' will instantiantly set the forward looking vector to the direction (1,2,3)

