/*
Controller Gate:
	Before we start the game, each gate is organized randomly in order to make each gate animation ready and game is more fun! 
	Here, in sectors there are 4 gates and each gate has 3 animation. 
	Zero, we get all gate objects with tag "Gate".
	Firstly, we randomly select the animated ones and others are leaved open. (The first position according to any animation)
	Secondly, we select randomly the possible animation and set the distance to start the animation.
	Third, the gate is started waiting till the aircraft is in the range, then plays the given animation.
	
*/

var animationsLevel1Gate1 : AnimationClip[]; 	//left top
var animationsLevel1Gate2 : AnimationClip[];	//right top
var animationsLevel1Gate3 : AnimationClip[];	//right bottom
var animationsLevel1Gate4 : AnimationClip[];	//left bottom

var staticGatePercentOnSectors : float[];
//var allStaticGatePercentOnSectors : float[];
var distanceFromAircraftToStartAnimationBySector : float[];

private var addedAnimation : Animation;
private var scriptGateAnimation : GateAnimation;
private var addedBoxCollider : BoxCollider;
private var addedMeshCollider : MeshCollider;
private var randomAnimationClip : AnimationClip;

function Start(){
	

	var gateObjects : GameObject[] = GameObject.FindGameObjectsWithTag("Gate");
	
	Debug.Log("There are " + gateObjects.Length + " Gate objects to change! ");
	
	var counter : int = 0;
	for (var gateObject : GameObject in gateObjects){
		counter++;
		
		var gateName : String = gateObject.name;
		var parentName : String = gateObject.transform.parent.name;
		
		var sectorLevelNumber : int = getSectorLevelNumber(parentName);
		var sectorNumber : int = getSectorNumber(parentName);
		var gateNumber : int = getGateNumber(gateName);
		
		
		if(sectorLevelNumber==1 || sectorLevelNumber==2){
			setGatePositionAndAnimation(gateObject, gateNumber, sectorNumber, sectorLevelNumber);
		}
		else{ 
			// do nothing for sector level 3		
		}
	}
	
	
}

function getGateNumber(gateName : String) : int{
	var gateNumber : int = 0;
	if(gateName.Contains("G1") || gateName.Contains("Gate01.") ){
		gateNumber = 1;
	}
	else if(gateName.Contains("G2") || gateName.Contains("Gate02.")){
		gateNumber = 2;
	}
	else if(gateName.Contains("G3") || gateName.Contains("Gate03.")){
		gateNumber = 3;
	}
	else if(gateName.Contains("G4") || gateName.Contains("Gate04.")){
		gateNumber = 4;
	}
	else{
		gateNumber = 0;
	}
	return gateNumber;
}

function getSectorLevelNumber(gateParentName : String) : int{
	var sectorLevelNumber : int = 0;
	if(gateParentName.Contains("S1_") || gateParentName.Contains("S2")  || gateParentName.Contains("S3")  || gateParentName.Contains("S4")  || gateParentName.Contains("S5")){
		sectorLevelNumber = 1;
	}
	else if(gateParentName.Contains("S6") || gateParentName.Contains("S7")  || gateParentName.Contains("S8")  || gateParentName.Contains("S9")  || gateParentName.Contains("S10")){
		sectorLevelNumber = 2;
	}
	else{
		sectorLevelNumber = 3;
	}
	return sectorLevelNumber;
}

function getSectorNumber(gateParentName : String) : int{
	var sectorNumber : int = 0;
	if(gateParentName.Contains("S1_")){
		sectorNumber = 1;
	}
	else if(gateParentName.Contains("S2")){
		sectorNumber = 2;
	}
	else if(gateParentName.Contains("S3")){
		sectorNumber = 3;
	}
	else if(gateParentName.Contains("S4")){
		sectorNumber = 4;
	}
	else if(gateParentName.Contains("S5")){
		sectorNumber = 5;
	}
	else if(gateParentName.Contains("S6")){
		sectorNumber = 6;
	}
	else if(gateParentName.Contains("S7")){
		sectorNumber = 7;
	}
	else if(gateParentName.Contains("S8")){
		sectorNumber = 8;
	}
	else if(gateParentName.Contains("S9")){
		sectorNumber = 9;
	}
	else if(gateParentName.Contains("S10")){
		sectorNumber = 10;
	}
	else if(gateParentName.Contains("S11")){
		sectorNumber = 11;
	}
	else if(gateParentName.Contains("S12")){
		sectorNumber = 12;
	}
	else{
		sectorNumber = 0;
	}
	return sectorNumber;
}

function getRandomIndex(maxValueExlusive : int, percentForMax : float) : int{
	var randomValue : float = Random.Range(0.0, 100.0) % 100;
	
	var returnValue : int = maxValueExlusive;
	
	var oneStepValue : float = (100.0 - percentForMax) / maxValueExlusive;

	for(var i : int = 1; i<= maxValueExlusive ; i++){
		if(randomValue <= oneStepValue * i){
			returnValue = i-1;
			break;
		}
		else{
			continue;
		}
	}
	
	return returnValue;
}

function setGatePositionAndAnimation(gateObject : GameObject, gateNumber : int, sectorNumber : int, sectorLevelNumber: int ){
	
	var randomAnimationIndex : int = 0;
	var randomAnimationIndex2 : int = 0;
	
	if(sectorLevelNumber==1){
		
		randomAnimationIndex = getRandomIndex(3, staticGatePercentOnSectors[sectorNumber-1]);
		
		if(gateNumber==1 && randomAnimationIndex < animationsLevel1Gate1.Length){
			randomAnimationClip = animationsLevel1Gate1[randomAnimationIndex];
		}
		else if(gateNumber==2 && randomAnimationIndex < animationsLevel1Gate2.Length){
			randomAnimationClip = animationsLevel1Gate2[randomAnimationIndex];
		}
		else if(gateNumber==3 && randomAnimationIndex < animationsLevel1Gate3.Length){
			randomAnimationClip = animationsLevel1Gate3[randomAnimationIndex];
		}
		else if(gateNumber==4 && randomAnimationIndex < animationsLevel1Gate4.Length){
			randomAnimationClip = animationsLevel1Gate4[randomAnimationIndex];
		}
		else{
			randomAnimationClip = null;
		} 	
		addedBoxCollider = gateObject.AddComponent (BoxCollider);
		addedBoxCollider.isTrigger = true;
	}
	else{
		randomAnimationClip = null;
	}
	
	addedAnimation = gateObject.AddComponent("Animation");
	addedAnimation.enabled = false;
	if(randomAnimationClip){
		addedAnimation.AddClip(randomAnimationClip, randomAnimationClip.name);
		addedAnimation.clip = randomAnimationClip;
		addedAnimation.playAutomatically = false;
		
		var state : AnimationState = addedAnimation.animation[randomAnimationClip.name];
		state.weight = 1;
		state.enabled = true;
		state.normalizedTime = 0;
		addedAnimation.Sample();
		addedAnimation.Stop();
		addedAnimation.enabled = false;
		
		scriptGateAnimation = gateObject.AddComponent(GateAnimation);
		scriptGateAnimation.distanceFromAircraft = distanceFromAircraftToStartAnimationBySector[sectorNumber-1];

	}
	else{
		// randomly set by null at that sector and gate
	}
			
}
