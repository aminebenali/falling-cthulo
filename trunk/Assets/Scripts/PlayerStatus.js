//Playerstatus 31/1/2013
//How to use: Put this code into the Player Game Object
//What it does: Manage the distance, life and velocity of the Player
//Last Modified: 27/2/2013
//by Yves J. Albuquerque

#pragma strict

public static var distance : float = 0;
public static var life : float = 100;
public static var velocity : float = 0;
public static var coin : int = 0;
public var miasma : Light;
public var turbilhaoDeVelocidade : ParticleSystem;
private var controller : CharacterController;
private var invunerable : boolean;

function Start ()
{
    controller = GetComponent(CharacterController);
    miasma = GameObject.Find("Miasma").GetComponent(Light);
    //turbilhaoDeVelocidade = GameObject.Find("Turbilhao De Velocidade").GetComponent(ParticleSystem);

}

function Update ()
{
    velocity = controller.velocity.z;
    distance = transform.position.z;
    if (life < 0)
    {
    	SendMessage ("OnDeath");
    }
    	
    if (life > 100)
    	life = 100;
    else
    	life += Time.deltaTime;
    
    miasma.intensity = life/50;
    turbilhaoDeVelocidade.emissionRate = (velocity*velocity)/100;
}

function OnDeath ()
{
	life = 100;
}

function OnControllerColliderHit (hit : ControllerColliderHit)
{
	if (controller.collisionFlags & CollisionFlags.Sides)
		if (transform.position.z < hit.transform.position.z)
		{
			life -= (3*velocity);
			//hit.collider.enabled = false;
		}
}