/*
Controller Map Generation:
	This script is used to generated coin sets and bonuses to the right position as well as deleting them.
	Here, we know each possible location with parts transform. 
	Then, we iteratively pass each part and choose the coin set for possible location. 
	After coin set generation of given part, we choose randomly the bonus item (can be nothing) and generate it on possible location with a small Z-offset (Here, 2 meter) namely "bonusPartDistance".

*/

var coinSets : Transform[];
var parts : Transform[];

var bonusTime : Transform;
var bonusShield : Transform;
var bonusWeapon : Transform;
private var bonusTransforms : Transform[];

var emptyCoinSetPercent : float = 0.1;
var generationDistance : float;

var bonusMinX : float;
var bonusMaxX : float;
var bonusMinY : float;
var bonusMaxY : float;
var bonusPartDistance : float = 2;
var emptyBonusPercent : float = 0.6;
private var bonusRandomIndex : int = 0;
private var bonusObjects : Transform[];
private var tempBonusPosition : Vector3;
private var lastDeletedBonusIndex : int = -1;

private var coinSetObjects : Transform[];
private var coinSetLocationScripts : CoinSetPossibleLocation[];

private var tempCoinSetPosition : Vector3;
private var coinSetRandomIndex : int = 0;
private var currentPart : Transform;

private var lastGeneratedLocationIndex : int = 15;
private var lastDeletedCoinIndex : int = -1;
private var hasDeleted : boolean = false;
private var hasGenerated : boolean = false;
private var updateTimeForGenerationAndDeletion : float = 0.2;

function Awake(){
	
	coinSetLocationScripts = new CoinSetPossibleLocation[coinSets.Length];
	coinSetObjects = new Transform[parts.Length];
	bonusObjects = new Transform[parts.Length];
	bonusTransforms = new Transform[3];
	bonusTransforms[0] = bonusTime;
	bonusTransforms[1] = bonusShield;
	bonusTransforms[2] = bonusWeapon;
	
	for(var coinSetIndex = 0; coinSetIndex < coinSets.Length; coinSetIndex++)
	{
    	coinSetLocationScripts[coinSetIndex] = coinSets[coinSetIndex].GetComponent("CoinSetPossibleLocation");
	}

	//for(var locationIndex = 0; locationIndex < parts.Length; locationIndex++)
	for(var locationIndex = 0; locationIndex <= lastGeneratedLocationIndex; locationIndex++)
	{
		generateCoinSet(locationIndex);
		generateBonus(locationIndex);
	}
	
}

function generateBonus(locationIndex : int){
	if(locationIndex < parts.Length){
			currentPart = parts[locationIndex];
 
	    	bonusRandomIndex =  Random.Range(0.0, 3 * (1+emptyBonusPercent)); //(Random.value*1000) % coinSets.Length;
	    	
	    	//Debug.Log("Part:"+locationIndex+" Bonus Index:"+bonusRandomIndex);
	    	if(bonusRandomIndex < 3){	
	    		tempBonusPosition.x = Random.Range(bonusMinX, bonusMaxX);
	    		tempBonusPosition.y = Random.Range(bonusMinY, bonusMaxY);
	    		tempBonusPosition.z = currentPart.position.z + bonusPartDistance;
	    		bonusObjects[locationIndex] = GameObject.Instantiate(bonusTransforms[bonusRandomIndex], tempBonusPosition, Quaternion.identity);
	    		
	    		//Debug.Log("Part Location: " + currentPart.position + ", CoinSet ("+ coinSetRandomIndex +") Random Location:"+tempCoinSetPosition);
	    	}
	    	else{
	    		//do nothing -> do not generate coin set make it empty
	    		bonusObjects[bonusRandomIndex] = null;
	    		//Debug.Log("Part Location: " + currentPart.position + ", CoinSet (NAN)");
	    	}
		}
		else{
			Debug.Log("Error bonus generation at" + locationIndex);
		}
}


function generateCoinSet(locationIndex : int){
		if(locationIndex < parts.Length){
			 currentPart = parts[locationIndex];
 
	    	coinSetRandomIndex =  Random.Range(0.0, coinSets.Length * (1 + emptyCoinSetPercent)); //(Random.value*1000) % coinSets.Length;
	    	
	    	//Debug.Log("Part:"+locationIndex+" CoinSet Index:"+coinSetRandomIndex);
	    	if(coinSetRandomIndex < coinSets.Length){	
	    		tempCoinSetPosition.x = Random.Range(coinSetLocationScripts[coinSetRandomIndex].possibleMinX, coinSetLocationScripts[coinSetRandomIndex].possibleMaxX);
	    		tempCoinSetPosition.y = Random.Range(coinSetLocationScripts[coinSetRandomIndex].possibleMinY, coinSetLocationScripts[coinSetRandomIndex].possibleMaxY);
	    		tempCoinSetPosition.z = currentPart.position.z;
	    		coinSetObjects[locationIndex] = GameObject.Instantiate(coinSets[coinSetRandomIndex], tempCoinSetPosition , coinSets[coinSetRandomIndex].rotation);
	    		
	    		//Debug.Log("Part Location: " + currentPart.position + ", CoinSet ("+ coinSetRandomIndex +") Random Location:"+tempCoinSetPosition);
	    	}
	    	else{
	    		//do nothing -> do not generate coin set make it empty
	    		coinSetObjects[locationIndex] = null;
	    		//Debug.Log("Part Location: " + currentPart.position + ", CoinSet (NAN)");
	    	}
		}
		else{
			Debug.Log("Error coin set generation at" + locationIndex);
		}
}

function checkMapToGenerate(){
	while(true){
		yield WaitForSeconds(updateTimeForGenerationAndDeletion);
		if(!ControllerXCode.isGamePaused && ControllerXCode.isUserAlive){
			do{
				if( (lastGeneratedLocationIndex + 1 < parts.Length) && parts[lastGeneratedLocationIndex+1] && (parts[lastGeneratedLocationIndex+1].position.z < ControllerXCode.currentAircraftTransform.position.z + generationDistance)){
					generateCoinSet(lastGeneratedLocationIndex+1);
					generateBonus(lastGeneratedLocationIndex+1);
					lastGeneratedLocationIndex++;
    				hasGenerated = true;
				}	
				else{
					hasGenerated = false;
				}
			}while(hasGenerated);
		}
	}
}


function checkMapToDelete(){
	while(true){
		yield WaitForSeconds(updateTimeForGenerationAndDeletion);
		if(!ControllerXCode.isGamePaused && ControllerXCode.isUserAlive){
			do{
				//Debug.Log("checkMapToDelete :"+lastDeletedCoinIndex+" coin positionZ: " + coinSetObjects[lastDeletedCoinIndex+1].position.z +" and aircraft z: " + (ControllerXCode.currentAircraftTransform.position.z - 10));
				if( (lastDeletedCoinIndex + 1 < coinSetObjects.Length) && coinSetObjects[lastDeletedCoinIndex+1] && (coinSetObjects[lastDeletedCoinIndex+1].position.z < ControllerXCode.currentAircraftTransform.position.z - 10)){
					GameObject.Destroy(coinSetObjects[lastDeletedCoinIndex+1].gameObject);
					lastDeletedCoinIndex++;
					hasDeleted = true;
				}
				else if((lastDeletedCoinIndex + 1 < coinSetObjects.Length) && !coinSetObjects[lastDeletedCoinIndex+1]){
					lastDeletedCoinIndex++;
					hasDeleted = true;
				}	
				else{
					hasDeleted = false;
				}
				
				if((lastDeletedBonusIndex + 1 < bonusObjects.Length) && bonusObjects[lastDeletedBonusIndex+1] && (bonusObjects[lastDeletedBonusIndex+1].position.z < ControllerXCode.currentAircraftTransform.position.z - 10)){
					GameObject.Destroy(bonusObjects[lastDeletedBonusIndex+1].gameObject);
					lastDeletedBonusIndex++;
					
				}
				else if((lastDeletedBonusIndex + 1 < bonusObjects.Length) && !bonusObjects[lastDeletedBonusIndex+1]){
					lastDeletedBonusIndex++;
					
				}	
				else{
					//do nothing
				}
				
				
				
			}while(hasDeleted);
		}
	}
}


function Start(){
	checkMapToGenerate();
	checkMapToDelete();
}
