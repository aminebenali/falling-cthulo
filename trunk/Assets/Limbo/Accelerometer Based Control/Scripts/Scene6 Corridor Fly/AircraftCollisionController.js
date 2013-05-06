/*
Aircraft Collision Controller:
	Aircraft has box colliders in order to calculate the collision easily. 
	The all other objects in the game have "trigger" colliders, so if aircraft hits any objects that has collider; this attached script is control the collision.
	There are two main items to hit: corridor wall and others. Here others are: all bonus items (shield, weapon, time bonus), game and sector entrances.
	If aircraft hits corridor wall, the spark effect will show. This collision should be calculate as long as the aircraft hits the wall, so we use "OnCollisionStay" and "OnCollisionEnter".
	However, other items should be calculated once the aircraft hits the object, so we use "OnTriggerEnter".
	
	Note: Sector Entrances are invisible box objects -collider-. They are used to understand whether the aircraft enters new sector or finished the game.
	
*/


function OnCollisionEnter(collisionInfo : Collision) {
	if(!ControllerXCode.isGameFinished && collisionInfo.collider.transform.CompareTag("Corridor")){
		ControllerXCode.sciptGameLogic.SparkOnWall(collisionInfo);
	}
	else{
		//do nothing -> Game is already finished
	}
	
}

function OnCollisionStay(collisionInfo : Collision) {
	if(!ControllerXCode.isGameFinished && collisionInfo.collider.transform.CompareTag("Corridor")){
		ControllerXCode.sciptGameLogic.SparkOnWall(collisionInfo);
	}
	else{
		//do nothing -> Game is already finished
	}
}


function OnTriggerEnter (other : Collider) {

	if(!ControllerXCode.isGameFinished){
		if(other.transform.parent && other.transform.parent.CompareTag("Coin")){
			ControllerXCode.sciptGameLogic.EarnCoin(other.transform.parent);
		}
		else if(other.transform.parent && other.transform.parent.CompareTag("BonusWeapon")){
			ControllerXCode.sciptGameLogic.EarnWeapon(other.transform.parent);
		}
		else if(other.transform.parent && other.transform.parent.CompareTag("BonusTime")){
			ControllerXCode.sciptGameLogic.EarnTime(other.transform.parent);
		}
		else if(other.transform.parent && other.transform.parent.CompareTag("BonusShield")){
			ControllerXCode.sciptGameLogic.EarnShield(other.transform.parent);
		}
		else if( other.transform.CompareTag("Gate")){ 	// it is a gate or pipe -> an obstacle
			ControllerXCode.sciptGameLogic.Crash(other.transform);
		}
		else if( other.transform.CompareTag("SectorEnterance")){	// it is a new sector
			ControllerXCode.sciptGameLogic.EnterNextSector(other.transform);
		}
		else {
			Debug.Log("Error - Trigger Entered with unknown tag");
		}
	}
	else{
		//do nothing -> Game is already finished
	}
}
