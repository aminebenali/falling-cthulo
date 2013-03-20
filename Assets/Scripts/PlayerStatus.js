//Playerstatus 31/1/2013
//How to use: Put this code into the Player Game Object
//What it does: Manage the distance, life, velocity and related behaviours of the Player
//Last Modified: 20/3/2013
//by Yves J. Albuquerque

#pragma strict
public static var distance : float = 0; //Distance since new Level
public static var life : float = 100; //Life of the player
public static var velocity : float = 0; //Current Velocity
public static var coins : int = 0; //Total coins taked
public static var isDead : boolean = false; //is dead?

public var deadReplacement : Transform;//dead gameobject
@HideInInspector
public var deadBody : Transform;//deadbody transform

private var turbilhaoDeVelocidade : ParticleSystem; //velocity feedback
private var miasma : Light; //Life feedback
private var controller : CharacterController;//Character Controller Reference
private var invunerable : boolean;// invunerabily on/off
private var myTransform : Transform;//Caching component lookup - Optimization Issue


@script AddComponentMenu("Characters/Player Status");

function Awake ()
{
 	myTransform = transform;
    controller = GetComponent(CharacterController);
    miasma = GameObject.Find("Miasma").GetComponent(Light);
    turbilhaoDeVelocidade = GameObject.Find("Turbilhao").GetComponent(ParticleSystem);
}

function Start ()
{
	Reset ();
 //carregar elementos salvos
}

function Update ()
{
	if (isDead)
		return;
    velocity = controller.velocity.z;
    distance = myTransform.position.z;
    	
    if (life > 100)
    	life = 100;
    else
    	life += Time.deltaTime;
    
    miasma.intensity = life/50;
    turbilhaoDeVelocidade.emissionRate = (velocity*velocity)/100;
}

function OnDeath ()
{
	if (!isDead)
	{
		deadBody = Instantiate(deadReplacement, transform.position, transform.rotation);
		CopyTransformsRecurse(transform, deadBody);
		isDead = true;
	}
}
 
function OnControllerColliderHit (hit : ControllerColliderHit)
{
	if (controller.collisionFlags & CollisionFlags.Sides)
	{
		if (myTransform.position.z < hit.transform.position.z)
		{
			life -= (3*velocity);
		}
	}
	else
	{
		life -= velocity;
	}
	
	if (life < 0)
	{
	 	BroadcastMessage ("OnDeath");
	}
	
	if (hit.transform.tag != "Terrain" || hit.transform.tag != "Mountain")
		iTween.MoveTo (hit.gameObject, {"y" : 20, "delay" : 2, "time":3});
}


function CopyTransformsRecurse (src : Transform,  dst : Transform)
{
	dst.position = src.position;
	dst.rotation = src.rotation;
	
	for (var child : Transform in dst)
	{
		// Match the transform with the same name
		var curSrc = src.Find(child.name);
		if (curSrc)
			CopyTransformsRecurse(curSrc, child);
	}
}

function Reset ()
{
	life = 100;
	isDead = false;
}