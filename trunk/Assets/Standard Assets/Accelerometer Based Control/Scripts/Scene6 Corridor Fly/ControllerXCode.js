/*
Controller XCode:
	ControllerXCode is used for general game initialization script.
	It is used between XCode and Unity as well as initial condition setup.
	In addition, the debug options are given in this script.
	According to initial conditions; the selected aircraft and camera option is set.
	This script handles when there is an input from keyboard in debug-mode.	
	
	Note: You can make your own aircraft and set as aircraft Prefab in this code.
*/

var isDebugMode : boolean = true;

var isGameInitiallyPaused : boolean = false;
var initialCameraOption : CameraOption = CameraOption.Camera1Standart; //Default camera is standart
var initialAircraft : AircraftOption = AircraftOption.Aircraft4; //Default aircraft is 4

var aircraft1Prefab : Transform; //it can be download from internet for FREE - check http://www.gripati.com/blog/
var aircraft2Prefab : Transform;
var aircraft3Prefab : Transform; //it can be download from internet for FREE - check http://www.gripati.com/blog/
var aircraft4Prefab : Transform;

var aircraftSpeedInitial : float = 3;
var aircraftSpeedIncrementByDistance: float = 1;
var aircraftSpeedIncrementValue: float = 0.01;

var aircraftInitialPosition : Vector3 = Vector3(0, 1.65, -20);
var aircraftInitialRotation : Quaternion =  Quaternion.identity;

//STATIC VARIABLED -> THEY ARE USED FOR REACHING OUTSIDE THE SCRIPT EASILY
public static var isDebug : boolean; //it is used for reaching whether the game is in debug mode or not
public static var selectedAircraft : AircraftOption;
public static var selectedCamera : CameraOption;
public static var currentCamera : GameObject;
public static var scriptMusicGame : ControllerMusicGame;
public static var currentCameraMotionBlur : MotionBlur;
public static var currentAircraft : GameObject;
public static var currentAircraftTransform : Transform;
public static var isGamePaused : boolean;
public static var isUserAlive : boolean;
public static var isGameFinished : boolean;

//public static var sciptAircraftController : ControllerAircraft;
public static var sciptAircraftController : ControllerAircraftByAccelerometerForGame;
public static var sciptGameLogic : GameLogic;

public static var audioSourceMusicGame : AudioSource;
public static var audioSourceHeartBeatGame : AudioSource;
public static var audioSourceShieldUse : AudioSource;


private var aircraftTransform : Transform;
private var aircraftControllerScript : GameObject;


//UNITY input numbers
//They are used between XCode and Unity using mono dll s.  
enum UnityInputType{
	UnityInputTypeNAN,	//0
	UnityInputTypePauseGame,
	UnityInputTypeResumeGame,
	UnityInputTypePauseOrResumeGame,
	UnityInputTypeRestartGame,
	UnityInputTypeNeedCalibration,
	UnityInputTypeUseWeaponBonus,
	UnityInputTypeUseTimeBonus,
	UnityInputTypeUseShieldBonus,
	UnityInputTypeOpenMainMenu,
	UnityInputTypeTurnStartAircraft,
	UnityInputTypeTurnEndAircraft,
	UnityInputTypeChangeCamera
};

enum CameraOption{
	Camera1Standart,
	Camera2Action
};

enum AircraftOption{
	Aircraft1,	// use it after setting it
	Aircraft2,
	Aircraft3,	// use it after setting it
	Aircraft4
}



function Awake (){
	initializeConfiguration();
	initializeGamePauseOrResume();
	initializeAircraft(initialAircraft, aircraftInitialPosition);
	initializeGameForAttachOtherScripts();
}

function Update(){
	checkKeyboardInputInDebugMode ();
}

function initializeConfiguration(){
	isUserAlive = true;
	isGameFinished = false;
	isDebug = isDebugMode;
	ControllerXCode.selectedCamera = initialCameraOption;
}

function initializeGameForAttachOtherScripts(){
	var gameController = GameObject.FindWithTag ("GameController");
	if(gameController){
		sciptGameLogic = gameController.GetComponent("GameLogic");
	}
	
	currentCamera = GameObject.FindWithTag ("MainCamera");
	scriptMusicGame = currentCamera.GetComponent("ControllerMusicGame");
	audioSourceMusicGame = currentCamera.audio;
	audioSourceHeartBeatGame = scriptMusicGame.heartBeatSound;
	audioSourceShieldUse = scriptMusicGame.shieldBonusUseSound;
	currentCameraMotionBlur = currentCamera.GetComponent("MotionBlur");
	
	var controllerAircraft : Transform = GameObject.FindGameObjectWithTag("AccelerometerBasedControl").transform;
	sciptAircraftController = controllerAircraft.GetComponent("ControllerAircraftByAccelerometerForGame");
	if(!sciptAircraftController){
		Debug.LogError("Error !!!");
	}
}

function initializeGamePauseOrResume(){
	if(isGameInitiallyPaused){
		makeGamePause();
	}
	else{
		makeGameResume();
	}
}

function initializeAircraft(selectedAircraft :AircraftOption, position : Vector3){
	
		if(selectedAircraft==AircraftOption.Aircraft1 && aircraft1Prefab){
			aircraftTransform = Instantiate (aircraft1Prefab,position,  aircraftInitialRotation);
		}
		else if(selectedAircraft==AircraftOption.Aircraft2 && aircraft2Prefab){
			aircraftTransform = Instantiate (aircraft2Prefab,position,  aircraftInitialRotation);
		}
		else if(selectedAircraft==AircraftOption.Aircraft3 && aircraft3Prefab){
			aircraftTransform = Instantiate (aircraft3Prefab,position,  aircraftInitialRotation);
		}
		else if(selectedAircraft==AircraftOption.Aircraft4 && aircraft4Prefab){
			aircraftTransform = Instantiate (aircraft4Prefab,position,  aircraftInitialRotation);
		}	
		else{
			//do nothing
			Debug.Log("ERROR - Please select aircraft in your prefabs.");
			aircraftTransform = Instantiate(aircraft4Prefab,position,  aircraftInitialRotation);
		} 
		aircraftTransform.tag = "Aircraft";
		ControllerXCode.selectedAircraft = initialAircraft;
		ControllerXCode.currentAircraft = aircraftTransform.gameObject;
		ControllerXCode.currentAircraftTransform = aircraftTransform;
}

static function makeGamePause(){
	isGamePaused = true;
	Time.timeScale = 0;
}


static function makeGameResume(){
	isGamePaused = false;
	Time.timeScale = 1.0;
}

//Keybard input used in Debug Mode
function checkKeyboardInputInDebugMode () {

	if(ControllerXCode.isDebug){
		if(Input.GetKeyDown ("p")){
			if(ControllerXCode.isGamePaused){
				ControllerXCode.getInput(UnityInputType.UnityInputTypeResumeGame);
			}
			else{
				ControllerXCode.getInput(UnityInputType.UnityInputTypePauseGame);
			}
			
		}
		else if(Input.GetKeyDown ("1")){
			ControllerXCode.getInput(UnityInputType.UnityInputTypeUseWeaponBonus);
		}
		else if(Input.GetKeyDown ("2")){
			ControllerXCode.getInput(UnityInputType.UnityInputTypeUseTimeBonus);
		}
		else if(Input.GetKeyDown ("3")){
			ControllerXCode.getInput(UnityInputType.UnityInputTypeUseShieldBonus);
		}
		else if(Input.GetKeyDown ("c")){
			ControllerXCode.getInput(UnityInputType.UnityInputTypeNeedCalibration);
		}
		else if(Input.GetKeyDown ("r")){
			ControllerXCode.getInput(UnityInputType.UnityInputTypeRestartGame);
		}
		else if(Input.GetKeyDown("t")){
			ControllerXCode.getInput(UnityInputType.UnityInputTypeTurnStartAircraft);
		}
		else if(Input.GetKeyUp ("t")){
			ControllerXCode.getInput(UnityInputType.UnityInputTypeTurnEndAircraft);
		}
		else{
			// do nothing -> there is not input in debug mode
		}
	}
	if(Input.GetMouseButton(0)){
	
	}
}


// They are called directly from XCODE 
static function getInput(inputValue : int){

	//Debug.Log("Keyboard Input: " + inputValue);
	
	if(inputValue==UnityInputType.UnityInputTypePauseGame){			//is game paused
		ControllerXCode.makeGamePause();
	}
	else if(inputValue==UnityInputType.UnityInputTypeResumeGame){		//is game resumed
		ControllerXCode.makeGameResume();
	}
	else if(inputValue==UnityInputType.UnityInputTypePauseOrResumeGame){
		if(ControllerXCode.isGamePaused){
			ControllerXCode.makeGameResume();
		}
		else{
			ControllerXCode.makeGamePause();
		}
	}
	else if(inputValue==UnityInputType.UnityInputTypeRestartGame){
		Application.LoadLevel (0);	//Restart - Load level
	}
	else if(inputValue==UnityInputType.UnityInputTypeNeedCalibration){
		if(sciptAircraftController){
			//sciptAircraftController.needCalibration= true;
			sciptAircraftController.CalibrateAircraft();
		}
	}
    else if(inputValue==UnityInputType.UnityInputTypeUseWeaponBonus){
		if(sciptGameLogic && !ControllerXCode.isGameFinished && ControllerXCode.isUserAlive){
			 sciptGameLogic.UseWeaponBonus();
		}
	}
    else if(inputValue==UnityInputType.UnityInputTypeUseTimeBonus){
   		if(sciptGameLogic && !ControllerXCode.isGameFinished && ControllerXCode.isUserAlive){
			 sciptGameLogic.UseTimeBonus();
		}
	}
    else if(inputValue==UnityInputType.UnityInputTypeUseShieldBonus){
    	if(sciptGameLogic && !ControllerXCode.isGameFinished && ControllerXCode.isUserAlive){
			 sciptGameLogic.UseShieldBonus();
		}
	}
	else if(inputValue==UnityInputType.UnityInputTypeTurnStartAircraft){
		if(sciptGameLogic && !ControllerXCode.isGameFinished && ControllerXCode.isUserAlive){
			 sciptGameLogic.TurnStartAircraft();
		}
	}
	else if(inputValue==UnityInputType.UnityInputTypeTurnEndAircraft){
		if(sciptGameLogic && !ControllerXCode.isGameFinished && ControllerXCode.isUserAlive){
			 sciptGameLogic.TurnEndAircraft();
		}
	}
	else if(inputValue==UnityInputType.UnityInputTypeChangeCamera){
		if(selectedCamera == CameraOption.Camera1Standart){
			selectedCamera= CameraOption.Camera2Action;
		}
		else{
			selectedCamera= CameraOption.Camera1Standart;
		}
	}
	else{
		Debug.Log("Error - Unrecognized input type");
	}

}




