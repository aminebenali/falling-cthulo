/*
Game Logic:
	GameLogic script is used for general game logic controlling aircraft's bonus earn and usage.
	Here, if aircraft hits a bonus or coin; then the corresponding function is called such as: "EarnTimeBonus". 
	If there is an explosion prefab or any sound should be given, then the function generates the given explosion or sound.
	If aircraft hits the sector entrance 4, it means that this simple game is over; so the camera is stopped following and game is finished.
	
	Note: The coin earn, bonus earn sounds are not given within this package. However, you can set easily for the sounds with prefix "sound".
	
*/
private var aircraft : GameObject;
private var currentSector : int;

var aircraftSpeedOfEachSector : float[];

var explosionCoin : Transform;
var soundCoinEarn : AudioClip;
var volumeCoinEarn : float = 0.5;

var explosionTimeBonus : Transform;
var soundTimeBonusEarn : AudioClip;
var volumeTimeBonusEarn : float = 0.5;

var explosionWeaponBonus : Transform;
var soundWeaponBonusEarn : AudioClip;
var volumeWeaponBonusEarn : float = 0.5;

var explosionRocket : Transform;
var soundRocket : AudioClip;
var volumeRocket : float = 0.5;

var explosionShieldBonus : Transform;
var soundShieldBonusEarn : AudioClip;
var volumeShieldBonusEarn : float = 0.5;

var explosionUserCrash : Transform;
var soundUserCrash : AudioClip;
var volumeUserCrash : float = 0.5;

var explosionUserDie : Transform;
var soundUserDie : AudioClip;
var volumeUserDie : float = 0.5;

var sparkWall : Transform;
var soundWallSpark : AudioClip[];
var volumeWallSpark : float = 0.5;
private var degreeZOfWallSparks : float;

var soundWeaponUse : AudioClip;
var volumeWeaponUse : float = 0.5;

//var soundShieldUse : AudioClip;
var volumeShieldUse : float = 0.5;

//var soundTimeUse : AudioClip;
var volumeTimeUse : float = 0.5;
var blurAmountTimeUse : float = 0.6;

var volumeNextSector : float = 0.5;
var soundSectors : AudioClip[];

var timeBonusUseTime : float = 3.0;
var timeBonusSlowDownTime : float = 0.2;
var timeBonusSpeedUpTime : float = 0.2;
var timeBonusMaxSlowDown : float = 0.5;
var timeIncrement : float = 0.01;

var rocketForAircraft1 : Transform;

private var isWeaponOpen : boolean = false;

function Start(){
	aircraft = ControllerXCode.currentAircraft;
	
	PlayerPrefs.SetInt("userGameLife", PlayerPrefs.GetInt("CurrentStars",0));
	currentSector = 0;
	ControllerXCode.sciptAircraftController.velocityOfRigidBody = aircraftSpeedOfEachSector[currentSector];
}

// ------- IN GAME ACTIONS

function EarnCoin(coin : Transform){
	//increase coin earn
	//PlayerPrefs.SetInt("EarnedCoins", PlayerPrefs.GetInt("EarnedCoins",0)+1); -> you can uncomment and show it in UI
	
	//make explosion
	if(explosionCoin){
		Instantiate(explosionCoin, coin.position, coin.rotation);
	}
	
	//give sound
	if(soundCoinEarn){ 
		AudioSource.PlayClipAtPoint(soundCoinEarn, coin.position, PlayerPrefs.GetFloat("SoundLevel", 0.5) * volumeCoinEarn);
	}
	
	//destroy coin
	Destroy(coin.gameObject);
}

function EarnShield(shield : Transform){
	//increase current shield bonus count
	PlayerPrefs.SetInt("EarnedShields", PlayerPrefs.GetInt("EarnedShields",0)+1);
	
	//make explosion
	if(explosionShieldBonus){
		Instantiate(explosionShieldBonus, shield.position, shield.rotation);
	}
	
	//give shield earn sound
	if(soundShieldBonusEarn){ 
		AudioSource.PlayClipAtPoint(soundShieldBonusEarn, shield.position, PlayerPrefs.GetFloat("SoundLevel", 0.5) * volumeShieldBonusEarn);
	}
	
	//destroy shield bonus
	Destroy(shield.gameObject);
	
	//check if weapon is open and if there is no more weapon bonus, close it!
	Invoke("checkAndCloseWeaponIfEmpty", 0.2);
}

function EarnWeapon(weapon : Transform){
	//increase current weapon bonus count
	PlayerPrefs.SetInt("EarnedWeapons", PlayerPrefs.GetInt("EarnedWeapons",0)+1);
	
	//make explosion
	if(explosionWeaponBonus){
		Instantiate(explosionWeaponBonus, weapon.position, weapon.rotation);
	}
	
	//give weapon earn sound
	if(soundWeaponBonusEarn){ 		//other.transform.root.audio.Play();
		AudioSource.PlayClipAtPoint(soundWeaponBonusEarn, weapon.position, PlayerPrefs.GetFloat("SoundLevel", 0.5) * volumeWeaponBonusEarn);
	}
	
	if(!isWeaponOpen){
			//make weapon visible with animation
		aircraft.animation["C4D Animation Take"].wrapMode = WrapMode.Once;
  		aircraft.animation["C4D Animation Take"].speed = 1;
  		aircraft.animation.Play("C4D Animation Take");
  		isWeaponOpen = true;
	}
  		
	//destroy weapon bonus
	Destroy(weapon.gameObject);
}


function EarnTime(timeBonus : Transform){
	//increase current time bonus count
	PlayerPrefs.SetInt("EarnedTimes", PlayerPrefs.GetInt("EarnedTimes",0)+1);
	
	//make explosion
	if(explosionTimeBonus){
		Instantiate(explosionTimeBonus, timeBonus.position, timeBonus.rotation);
	}
	
	//give time bonus earn sound
	if(soundTimeBonusEarn){ 
		AudioSource.PlayClipAtPoint(soundTimeBonusEarn, timeBonus.position, PlayerPrefs.GetFloat("SoundLevel", 0.5) * volumeTimeBonusEarn);
	}
	
	//destroy time bonus
	Destroy(timeBonus.gameObject);
	
	//check if weapon is open and if there is no more weapon bonus, close it!
	Invoke("checkAndCloseWeaponIfEmpty", 0.2);
}

private var shieldBonusInUse : boolean = false;

function UseShieldBonus(){
	if(!shieldBonusInUse){
		shieldBonusInUse  = true;
		
		var shieldTransform : Transform = ControllerXCode.currentAircraftTransform.Find("Shield");
		shieldTransform.light.enabled = true;
		Physics.IgnoreLayerCollision(8,12,true); //Aircraft - Gates Collision OFF
		
		if(ControllerXCode.audioSourceShieldUse){
			ControllerXCode.audioSourceShieldUse.volume = PlayerPrefs.GetFloat("SoundLevel", 0.5) * volumeShieldUse;
			ControllerXCode.audioSourceShieldUse.Play();
		}
		//check game is paused each 0.1 time and wait 0.1 till wait 4.8 seconds
		for(var tempIndex= 0; tempIndex < 20; tempIndex++)
		{
			yield StartCoroutine(WaitTillResumeGame());
	   		yield WaitForSeconds(0.1);
	   	}
		
		if(ControllerXCode.audioSourceShieldUse){
			ControllerXCode.audioSourceShieldUse.Stop();
		}
		
		Physics.IgnoreLayerCollision(8,12,false); //Aircraft - Gates Collision ON
		shieldTransform.light.enabled = false;
		shieldBonusInUse  = false;
	}
	else{
		Debug.Log("Shield is in USE");
		do{                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      
			yield WaitForSeconds(0.1);
		}while(shieldBonusInUse);
		//Now Shield Bonus is not in USE
		UseShieldBonusAfterInUse();
	}
}


function UseShieldBonusAfterInUse(){
	Debug.Log("Use Shield Bonus After Usage");
	UseShieldBonus();
}

function UseWeaponBonus(){
	//Instantiate (rocketForAircraft1, ControllerXCode.currentAircraftTransform.position , ControllerXCode.currentAircraftTransform.rotation);
	
	if(ControllerXCode.selectedAircraft==AircraftOption.Aircraft1){
		Instantiate (rocketForAircraft1, ControllerXCode.currentAircraftTransform.position + (ControllerXCode.currentAircraftTransform.rotation * Vector3(0.16,-0.05,0)) , ControllerXCode.currentAircraftTransform.rotation);
		Instantiate (rocketForAircraft1, ControllerXCode.currentAircraftTransform.position + (ControllerXCode.currentAircraftTransform.rotation * Vector3(-0.16,-0.05,0)) , ControllerXCode.currentAircraftTransform.rotation);
	}
	else if(ControllerXCode.selectedAircraft==AircraftOption.Aircraft2){
		Instantiate (rocketForAircraft1, ControllerXCode.currentAircraftTransform.position + (ControllerXCode.currentAircraftTransform.rotation * Vector3(0.14,0.1,-0.19)) , ControllerXCode.currentAircraftTransform.rotation);
		Instantiate (rocketForAircraft1, ControllerXCode.currentAircraftTransform.position + (ControllerXCode.currentAircraftTransform.rotation * Vector3(-0.14,0.1,-0.19)) , ControllerXCode.currentAircraftTransform.rotation);
	}
	else if(ControllerXCode.selectedAircraft==AircraftOption.Aircraft3){
		Instantiate (rocketForAircraft1, ControllerXCode.currentAircraftTransform.position + (ControllerXCode.currentAircraftTransform.rotation * Vector3(0.037,0.12,-0.2)) , ControllerXCode.currentAircraftTransform.rotation);
		Instantiate (rocketForAircraft1, ControllerXCode.currentAircraftTransform.position + (ControllerXCode.currentAircraftTransform.rotation * Vector3(0.0,0.12,-0.2)) , ControllerXCode.currentAircraftTransform.rotation);
		Instantiate (rocketForAircraft1, ControllerXCode.currentAircraftTransform.position + (ControllerXCode.currentAircraftTransform.rotation * Vector3(-0.037,0.12,-0.2)) , ControllerXCode.currentAircraftTransform.rotation);
	}
	else if(ControllerXCode.selectedAircraft==AircraftOption.Aircraft4){
		Instantiate (rocketForAircraft1, ControllerXCode.currentAircraftTransform.position + (ControllerXCode.currentAircraftTransform.rotation * Vector3(0.18,0.04,-0.45)) , ControllerXCode.currentAircraftTransform.rotation);
		Instantiate (rocketForAircraft1, ControllerXCode.currentAircraftTransform.position + (ControllerXCode.currentAircraftTransform.rotation * Vector3(-0.18,0.04,-0.45)) , ControllerXCode.currentAircraftTransform.rotation);
	}
	else{
		Debug.Log("Error - No selected aircraft to use weapon");
	}
	
	
	//Physics.IgnoreCollision(thisMissile.collider, ControllerXCode.currentAircraft.collider);
	Physics.IgnoreLayerCollision(11,8,true); //Rocket - Aircraft
	Physics.IgnoreLayerCollision(11,10,true); //Rocket - Bonus Items
	Physics.IgnoreLayerCollision(11,11,true); //Rocket to Rocket
	
	//give sound
	if(soundWeaponUse){ 
		AudioSource.PlayClipAtPoint(soundWeaponUse, ControllerXCode.currentAircraftTransform.position, PlayerPrefs.GetFloat("SoundLevel", 0.5) * volumeWeaponUse);
	}
	
	//if there is no more weapon bonus -> then play weapon off animation!
 	//check if weapon is open and if there is no more weapon bonus, close it!
	Invoke("checkAndCloseWeaponIfEmpty", 0.2);	
}

function checkAndCloseWeaponIfEmpty(){
	if(isWeaponOpen && !hasWeapon()){
		aircraft.animation["C4D Animation Take"].speed = -1;
  		aircraft.animation["C4D Animation Take"].time = aircraft.animation["C4D Animation Take"].length;
  		aircraft.animation.Play("C4D Animation Take");
  		isWeaponOpen = false;
	}
}

function hasWeapon() : boolean{
	var hasWeaponValue : boolean = false;
	if( PlayerPrefs.GetString("CurrentBonus1", "").Contains("bonusWeapon") || 
 		PlayerPrefs.GetString("CurrentBonus2", "").Contains("bonusWeapon") || 
 		PlayerPrefs.GetString("CurrentBonus3", "").Contains("bonusWeapon") || 
 		PlayerPrefs.GetString("CurrentBonus4", "").Contains("bonusWeapon")	){
 		hasWeaponValue = true;
 	}
 	else{
 		hasWeaponValue = false;
 	}
 	return hasWeaponValue;
}

function hasShield() : boolean{
	var hasShieldValue : boolean = false;
	if( PlayerPrefs.GetString("CurrentBonus1", "").Contains("bonusShield") || 
 		PlayerPrefs.GetString("CurrentBonus2", "").Contains("bonusShield") || 
 		PlayerPrefs.GetString("CurrentBonus3", "").Contains("bonusShield") || 
 		PlayerPrefs.GetString("CurrentBonus4", "").Contains("bonusShield")	){
 		hasShieldValue = true;
 	}
 	else{
 		hasShieldValue = false;
 	}
 	return hasShieldValue;
}


function hasTime() : boolean{
	var hasTimeValue : boolean = false;
	if( PlayerPrefs.GetString("CurrentBonus1", "").Contains("bonusTime") || 
 		PlayerPrefs.GetString("CurrentBonus2", "").Contains("bonusTime") || 
 		PlayerPrefs.GetString("CurrentBonus3", "").Contains("bonusTime") || 
 		PlayerPrefs.GetString("CurrentBonus4", "").Contains("bonusTime")	){
 		hasTimeValue = true;
 	}
 	else{
 		hasTimeValue = false;
 	}
 	return hasTimeValue;
}


private var timeIndex : float = 0.0;
private var timeSlowDownStep : float;
private var timeSpeedUpStep : float;
private var timeScaleValue : float = 1.0;
private var timeBonusInUse : boolean = false;

private var musicSlowDownStep : float;
private var musicSpeedUpStep : float;
private var hearbeatSlowDownVolume : float;
private var hearbeatSpeedUpVolume : float;
private var musicSlowDownVolume : float;
private var musicSpeedUpVolume : float;
private var musicMinPitch : float = 0.6;
private var musicMinVolume : float = 0.2;
private var musicDefaultVolume : float;
private var musicDefaultPitch : float;
private var blurSlowDownAmount : float;
private var blurSpeedUpAmount : float;


function WaitTillResumeGame(){
	while(ControllerXCode.isGamePaused){
		yield WaitForSeconds(0.1);
	}
}


function UseTimeBonus(){
	
	if(!timeBonusInUse){
	
		//ready to use blur!
		ControllerXCode.currentCameraMotionBlur.blurAmount = 0.0;
		ControllerXCode.currentCameraMotionBlur.enabled = true;
		
		
		//Slow Down Game Music
		musicDefaultPitch = ControllerXCode.audioSourceMusicGame.pitch;
		musicDefaultVolume = ControllerXCode.audioSourceMusicGame.volume;
		
		ControllerXCode.audioSourceHeartBeatGame.volume = 0.0;
		if(ControllerXCode.audioSourceHeartBeatGame){
			ControllerXCode.audioSourceHeartBeatGame.Play();
		}
		timeBonusInUse = true;
		Debug.Log("Use TimeBonus");
		
		musicSlowDownStep = (musicDefaultPitch - musicMinPitch) / (timeBonusSlowDownTime / timeIncrement);
		musicSpeedUpStep = (musicDefaultPitch - musicMinPitch) / (timeBonusSpeedUpTime / timeIncrement);
		
		musicSlowDownVolume =  (musicDefaultVolume - musicMinVolume) / (timeBonusSlowDownTime / timeIncrement);
		musicSpeedUpVolume =  (musicDefaultVolume - musicMinVolume) / (timeBonusSpeedUpTime / timeIncrement);
		
		hearbeatSlowDownVolume = volumeTimeUse / (timeBonusSlowDownTime / timeIncrement);
		hearbeatSpeedUpVolume = volumeTimeUse / (timeBonusSpeedUpTime / timeIncrement);
		
		blurSlowDownAmount = blurAmountTimeUse / (timeBonusSlowDownTime / timeIncrement);
		blurSpeedUpAmount =  blurAmountTimeUse / (timeBonusSpeedUpTime / timeIncrement);
		
		
		timeScaleValue = 1.0;
		timeSlowDownStep = (1.0 - timeBonusMaxSlowDown) / (timeBonusSlowDownTime / timeIncrement);
		timeSpeedUpStep = (1.0 - timeBonusMaxSlowDown) / (timeBonusSpeedUpTime / timeIncrement);
		
		for(timeIndex= 0.0; timeIndex < timeBonusSlowDownTime; timeIndex+= timeIncrement)
		{
			yield StartCoroutine(WaitTillResumeGame());
	   		yield WaitForSeconds(timeIncrement);
	   		timeScaleValue -= timeSlowDownStep;
	   		//Debug.Log("1 - TimeScale " + timeScaleValue);
	   		Time.timeScale = timeScaleValue;
	   		//slow down game music
	   		
			ControllerXCode.audioSourceMusicGame.pitch -= musicSlowDownStep;
			ControllerXCode.audioSourceMusicGame.volume -= musicSlowDownVolume;
			
			ControllerXCode.audioSourceHeartBeatGame.volume += hearbeatSlowDownVolume;
			
			ControllerXCode.currentCameraMotionBlur.blurAmount += blurSlowDownAmount;
		}
		
		ControllerXCode.audioSourceMusicGame.pitch = musicMinPitch;
		ControllerXCode.audioSourceMusicGame.volume = musicMinVolume;
		
		ControllerXCode.audioSourceHeartBeatGame.volume = volumeTimeUse;
		ControllerXCode.currentCameraMotionBlur.blurAmount = blurAmountTimeUse;
		
		yield StartCoroutine(WaitTillResumeGame());
		Debug.Log("2 - TimeScale " + timeScaleValue);
		yield WaitForSeconds(timeBonusUseTime - timeBonusSlowDownTime  - timeBonusSpeedUpTime);
		
		for(timeIndex= 0.0; timeIndex < timeBonusSpeedUpTime;  timeIndex+= timeIncrement)
		{
			yield StartCoroutine(WaitTillResumeGame());
	   		yield WaitForSeconds(timeIncrement);
	   		timeScaleValue += timeSpeedUpStep;
	   		//Debug.Log("3 - TimeScale " + timeScaleValue);
	   		if(timeScaleValue <= 1.0){
	   			Time.timeScale = timeScaleValue;
	   		}
	   		if(ControllerXCode.audioSourceMusicGame.pitch < musicDefaultPitch){
	   			ControllerXCode.audioSourceMusicGame.pitch += musicSpeedUpStep;
	   		}
	   		if(ControllerXCode.audioSourceMusicGame.volume < musicDefaultVolume){
	   			ControllerXCode.audioSourceMusicGame.volume += musicSpeedUpVolume;
	   		}
	   		if(ControllerXCode.audioSourceHeartBeatGame.volume > 0.0){
	   			ControllerXCode.audioSourceHeartBeatGame.volume -= hearbeatSpeedUpVolume;
	   		}
	   		if(ControllerXCode.currentCameraMotionBlur.blurAmount > 0.0){
	   			ControllerXCode.currentCameraMotionBlur.blurAmount -= blurSpeedUpAmount;
	   		}
	   		
		}
		Time.timeScale = 1.0;
		timeBonusInUse = false;
		//speed up game music
		ControllerXCode.audioSourceMusicGame.pitch = musicDefaultPitch;
		ControllerXCode.audioSourceMusicGame.volume = musicDefaultVolume;
		if(ControllerXCode.audioSourceHeartBeatGame){
			ControllerXCode.audioSourceHeartBeatGame.Stop();
		}
		
		ControllerXCode.currentCameraMotionBlur.blurAmount = 0.0;
		ControllerXCode.currentCameraMotionBlur.enabled = false;
		
	}
	else{	//Time Bonus is in USE
		Debug.Log("TimeBonus is in USE");
		do{                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      
			yield WaitForSeconds(0.1);
		}while(timeBonusInUse);
		//Now Time Bonus is not in USE
		UseTimeBonusAfterInUse();
	}
}

function UseTimeBonusAfterInUse(){
	Debug.Log("Use Time Bonus After Usage");
	UseTimeBonus();
}

function TurnStartAircraft(){
	//Debug.Log("Aircraft is TURNING");
	ControllerXCode.sciptAircraftController.needTurnAction = true;	
}

function TurnEndAircraft(){
	//Debug.Log("Aircraft is NOT Turning");
	ControllerXCode.sciptAircraftController.needTurnAction = false;	
}

function Crash(gate : Transform){

	Debug.Log("User chrashed");
	if(PlayerPrefs.GetInt("userGameLife",0) > 0){ 	//user has enough life to continue game
		//decrase user life
		
		PlayerPrefs.SetInt("userCurrentLife", PlayerPrefs.GetInt("userGameLife",0) - 1);
		PlayerPrefs.SetInt("userGameLife",PlayerPrefs.GetInt("userGameLife",0) - 1);
		
		//make explosion
		if(explosionUserCrash){
			Instantiate(explosionUserCrash, gate.position, gate.rotation);
		}
		
		//give user crash sound
		if(soundUserCrash){ 
			AudioSource.PlayClipAtPoint(soundUserCrash, gate.position, PlayerPrefs.GetFloat("SoundLevel", 0.5) * volumeUserCrash);
		}
		//Explode Gate
		ExplodeGate(gate.gameObject);
		
		//check if weapon is open and if there is no more weapon bonus, close it!
		Invoke("checkAndCloseWeaponIfEmpty", 0.2);
	}
	else{			//user crashes and lost the game. Game Over
		//decrase user life
		PlayerPrefs.SetInt("userCurrentLife", -1);
		PlayerPrefs.SetInt("userGameLife", - 1);
		//make explosion
		if(explosionUserDie){
			Instantiate(explosionUserDie, aircraft.transform.position - Vector3(0,0,0.5), aircraft.transform.rotation);
		}
		
		//give user die sound
		if(soundUserDie){ 
			AudioSource.PlayClipAtPoint(soundUserDie, aircraft.transform.position, PlayerPrefs.GetFloat("SoundLevel", 0.5) * volumeUserDie);
		}
		//mark user is die before destroy
		ControllerXCode.isUserAlive = false;
		//destroy user aircraft
		Destroy(aircraft);
	}
}

function ExplodeGate(gateObject : GameObject){
	//destroy gate
	Destroy(gateObject);
}

function ExplodeRocket(rocketObject : GameObject){
		//make explosion
		if(explosionRocket){
			Instantiate (explosionRocket, rocketObject.transform.position , Quaternion.identity);
		}
		
		//give user die sound
		if(soundRocket){ 
			AudioSource.PlayClipAtPoint(soundRocket, rocketObject.transform.position, PlayerPrefs.GetFloat("SoundLevel", 0.5) * volumeRocket);
		}
		
		//Destroy rocket object
 		Destroy (rocketObject);
}


function SparkOnWall(sparkWallCollision : Collision){
	
	for(var contactPointIndex : int = 0; contactPointIndex< sparkWallCollision.contacts.Length ; contactPointIndex += 2  ){
		var contact : ContactPoint = sparkWallCollision.contacts[contactPointIndex];
		degreeZOfWallSparks = 90 + Mathf.Rad2Deg * Mathf.Atan2(contact.normal.y, contact.normal.x);
       	if(sparkWall){
    		Instantiate(sparkWall, contact.point,  Quaternion.Euler(0, 0, degreeZOfWallSparks));
    	}
	}
    

    //give sound
    if(soundWallSpark.Length>0){
    	//AudioSource.PlayClipAtPoint(soundWallSpark[0], sparkWallCollision.contacts[0].point, volumeWallSpark);
    	//Debug.Log("Ok - there is wall spark sound");
    	AudioSource.PlayClipAtPoint(soundWallSpark[(Random.value * 100) % soundWallSpark.Length], sparkWallCollision.contacts[0].point, PlayerPrefs.GetFloat("SoundLevel", 0.5) * volumeWallSpark);
    }
    else{
    	Debug.Log("Error - there is no wall spark sound");
    }
}

private var lastSectorIndex : int = 4;

function EnterNextSector(sectorEnterance : Transform){
	Debug.Log("Entered Next Sector " + currentSector + "Sector Name:" + sectorEnterance.name.Substring(15));
	//Destroy sector enterance
	Destroy(sectorEnterance.gameObject);
	
	//Get entered sector
	int.TryParse(sectorEnterance.name.Substring(15), currentSector);
	
	PlayerPrefs.SetInt("EnteredSector", currentSector);
	ControllerXCode.sciptAircraftController.velocityOfRigidBody = aircraftSpeedOfEachSector[currentSector-1];
	//Play next sector sound	--	Debug.Log("EnterNextSector" + currentSector + " - " + soundSectors.Length);
	if(currentSector<= soundSectors.Length && soundSectors[currentSector-1]){ 
		AudioSource.PlayClipAtPoint(soundSectors[currentSector-1], sectorEnterance.position, PlayerPrefs.GetFloat("SoundLevel", 0.5) *  volumeNextSector);
	}
	
	//check the user is entered last sector - game is finished -> user won the game!
	if(currentSector==lastSectorIndex){
		Debug.Log("Note - Game Finished");
		ControllerXCode.isGameFinished = true;
		GameObject.Destroy(ControllerXCode.currentAircraft , 10);	//destroy aircraft after 10 seconds
	}
}