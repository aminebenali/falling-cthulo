#pragma strict
public var skinSmallScreen : GUISkin;
public var skinBigScreen : GUISkin;

private var isBigScreen : boolean = false;
private var isLoading : boolean = false;


private var marginFromLeftRatio : float = 0.10;
private var marginFromTopRatio : float = 0.09;
private var marginBetweenButtonRatio : float = 0.10;
private var widthOfButtonRatio : float = 0.8;
private var heightOfButtonRatio : float = 0.08;

private class MainMenuItem{
	var titleOfButton : String;
	var nameOfScene : String;
};
public var mainMenuItems : MainMenuItem[];
private var mainMenuItem : MainMenuItem;

function Start(){
	isBigScreen = (Screen.width > 500)?true:false;
}

function OnGUI () {
	GUI.skin = isBigScreen?skinBigScreen:skinSmallScreen; //GUI skin is changed for bigger screen!
	
	if(!isLoading){
	
		for(var i : int = 0; i< mainMenuItems.length; i++){
			mainMenuItem = mainMenuItems[i];
			if (GUI.Button (new Rect (Screen.width * marginFromLeftRatio, Screen.height  * (marginFromTopRatio + i * marginBetweenButtonRatio), Screen.width * widthOfButtonRatio, Screen.height * heightOfButtonRatio), mainMenuItem.titleOfButton)){
				isLoading = true;
				Application.LoadLevel(mainMenuItem.nameOfScene);
			}
		}
		/*
		if (GUI.Button (Rect (Screen.width * marginFromLeftRatio, Screen.height  * (marginFromTopRatio + 0 * marginBetweenButtonRatio), Screen.width * widthOfButtonRatio, Screen.height * heightOfButtonRatio), "Free Fly (Simple) - Realistic")) {
			isLoading = true;
			Application.LoadLevel ("1 FreeFly Simple");
		}
		
		if (GUI.Button (Rect (Screen.width * marginFromLeftRatio, Screen.height  * (marginFromTopRatio + 1 * marginBetweenButtonRatio), Screen.width * widthOfButtonRatio, Screen.height * heightOfButtonRatio), "Free Fly (Simple) - Action")) {
			isLoading = true;
			Application.LoadLevel ("2 FreeFly Simple");
		}
		
		if (GUI.Button (Rect (Screen.width * marginFromLeftRatio, Screen.height  * (marginFromTopRatio + 2 * marginBetweenButtonRatio), Screen.width * widthOfButtonRatio, Screen.height * heightOfButtonRatio), "Free Fly - Detailed")) {
			isLoading = true;
			Application.LoadLevel ("2 FreeFly Detailed");
		}
		
		if (GUI.Button (Rect (Screen.width * marginFromLeftRatio, Screen.height  * (marginFromTopRatio + 3 * marginBetweenButtonRatio), Screen.width * widthOfButtonRatio, Screen.height * heightOfButtonRatio), "Corridor Fly Game")) {
			isLoading = true;
			Application.LoadLevel ("3 GameScene");
		}
		
		if (GUI.Button (Rect (Screen.width * marginFromLeftRatio, Screen.height  * (marginFromTopRatio + 4 * marginBetweenButtonRatio), Screen.width * widthOfButtonRatio, Screen.height * heightOfButtonRatio), "Rotate Labyrinth")) {
			isLoading = true;
			Application.LoadLevel ("4 LabyrinthRotate");
		}
		
		if (GUI.Button (Rect (Screen.width * marginFromLeftRatio, Screen.height  * (marginFromTopRatio + 5 * marginBetweenButtonRatio), Screen.width * widthOfButtonRatio, Screen.height * heightOfButtonRatio), "Roll a Ball in Labyrinth")) {
			isLoading = true;
			Application.LoadLevel ("5 RollABall");
		}
		*/
	}
	else{ //Loading !!!
		GUI.Label(Rect (Screen.width * 0.40, Screen.height * 0.45, Screen.width * 0.20, Screen.height * 0.1), "Loading...");
	}
	
}

