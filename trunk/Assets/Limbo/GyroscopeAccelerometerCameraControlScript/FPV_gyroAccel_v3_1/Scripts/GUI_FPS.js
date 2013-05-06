//================================================================================
// GUI_FPS
//================================================================================
//
// Display "Frames Per Second" menu button at the bottom of the screen
//
//================================================================================

#pragma strict

private var FPSstring : String; 
private var FPSupdateTime : float;

//================================================================================

function OnGUI () {
	if (Time.time > FPSupdateTime) {
		FPSstring = "FPS: "+(1/Time.deltaTime).ToString("#.00");
		FPSupdateTime = Time.time + 0.5; //update every 0.5 seconds
	}
	GUI.Box(Rect(Screen.width*0.5-40,Screen.height-20,80,20),FPSstring);
}

//================================================================================
