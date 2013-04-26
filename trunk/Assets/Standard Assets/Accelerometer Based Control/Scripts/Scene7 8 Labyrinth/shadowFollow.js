var theBall : Transform;
var useLocalPosition : boolean = false;
function LateUpdate () 
{
	if(useLocalPosition){
		transform.localPosition.x = theBall.localPosition.x; 
		transform.localPosition.z = theBall.localPosition.z;
	}
	else{
		transform.localPosition.x = theBall.position.x; 
		transform.localPosition.z = theBall.position.z;
	}
	
}