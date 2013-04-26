/*
Controller Music Game:
	The general music controller script. Here, each aircraft has its own background music.
	Note: There is no music given with this asset, you can put it as your own.
*/

public var heartBeatSound : AudioSource;
public var shieldBonusUseSound : AudioSource;

var musicGameClip1 : AudioClip;
var musicGameClip2 : AudioClip;
var musicGameClip3 : AudioClip;
var musicGameClip4 : AudioClip;

function Start(){
	InitializeMusic(ControllerXCode.selectedAircraft);
}

function InitializeMusic(selectedAircraft :AircraftOption){
	if(selectedAircraft==AircraftOption.Aircraft1 && musicGameClip1){
		audio.clip = musicGameClip1;
	}
	else if(selectedAircraft==AircraftOption.Aircraft2 && musicGameClip2){
		audio.clip = musicGameClip2;
	}
	else if(selectedAircraft==AircraftOption.Aircraft3 && musicGameClip3){
		audio.clip = musicGameClip3;
	}
	else if(selectedAircraft==AircraftOption.Aircraft4 && musicGameClip4){
		audio.clip = musicGameClip4;
	}	
	else{
		audio.clip = null;
		//do nothing
		Debug.Log("NOTE - There is no music for aircraft index: " + selectedAircraft);
	} 
	if(audio.clip != null){
		audio.Play();
	}
	else{
		audio.Play();
	}
	
}