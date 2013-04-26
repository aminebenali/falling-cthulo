/*
Simple Aircraft Collision Controller

*/

public var explosionOnAircraftCrash : Transform;

function OnTriggerEnter (other : Collider) {

	if(other.transform.CompareTag("Terrain")){
		if(explosionOnAircraftCrash){
			GameObject.Instantiate(explosionOnAircraftCrash, transform.position, Quaternion.identity);  //Explosion
		}
		GameObject.Destroy(transform.gameObject);	
	}
	else{
		//do nothing -> Game is already finished
	}
}
