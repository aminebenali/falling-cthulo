/*
Controller GUI Button:
	This script is used for each GUI button.
	Here, the over image and the function call is selected within this script. 
	Within this script, each GUI Button knows its over image and the function to call.
	In order to be easy, we call ControllerXCode 's static function as we do in XCode after "mono assemblies" are registered. 
*/

var functionTouchDown : UnityInputType;
var functionTouchUpInside : UnityInputType;

private var imageNormal : Texture;
var imageOver : Texture;


private var hasTouchedDowned : boolean = false;
var isOverImage : boolean = false;


function Start(){
	imageNormal = this.guiTexture.texture;
}

function Update () {
	MouseControl();
}

function MouseControl(){
	if(Input.GetMouseButtonDown(0)){	//Started
		if(this.guiTexture.HitTest(Input.mousePosition)){ 	//Touch inside the button
			hasTouchedDowned = true;
			this.guiTexture.texture = imageOver; //over image
			isOverImage = true;
			
			if(functionTouchDown != UnityInputType.UnityInputTypeNAN){
				ControllerXCode.getInput(functionTouchDown);
			}
			
		}
		else{	//Touch outside the button
			//do nothing
		}
	}
	else if(Input.GetMouseButtonUp(0)){	//Ended
		if(hasTouchedDowned && this.guiTexture.HitTest(Input.mousePosition)){ //Touch up inside
			this.guiTexture.texture = imageNormal; //normal image
			isOverImage = false;
			
			if(functionTouchUpInside != UnityInputType.UnityInputTypeNAN){
				ControllerXCode.getInput(functionTouchUpInside);
			}
			
		}
		else{ 	// Touch up outside -> do nothing
			this.guiTexture.texture = imageNormal; //normal image
			isOverImage = false;
		}
		hasTouchedDowned = false;
		
	}
	else{		
		if(hasTouchedDowned){	//Started - moving
			if(this.guiTexture.HitTest(Input.mousePosition)){	//Still inside the button
				if(!isOverImage){ // did not change normal image to over
					this.guiTexture.texture = imageOver; //over image
					isOverImage = true;
				}
				else{	// changed before the normal image to over - do nothing
					// do nothing
				}
			}
			else{	//moved outside the button
				if(isOverImage){ // did not change over image to normal
					this.guiTexture.texture = imageNormal; //normal image
					isOverImage = false;
				}
				else{	// changed before the over image to normal - do nothing
					// do nothing
				}
			}
		}
		else{			//Not Started - do nothing
			//do nothing
		}
	}
}