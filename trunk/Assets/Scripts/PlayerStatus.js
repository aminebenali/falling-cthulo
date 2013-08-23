//Playerstatus 31/1/2013
//How to use: Put this code into the Player Game Object
//What it does: Manage the distance, life, velocity and related behaviours of the Player
//Last Modified: 07/07/2013
//by Yves J. Albuquerque

#pragma strict
public static var distance : float = 0; //Distance since new Level
public static var life : float = 100; //Life of the player
public static var velocity : float = 0; //Current Velocity
public static var coins : int = 0; //Total coins taked
public static var isDead : boolean = false; //is dead?
public static var invunerable : boolean;// invunerabily on/off
private var cthuloAlive : SkinnedMeshRenderer;//SkennedMeshRenderer Reference
public var deadReplacement : Transform;//dead gameobject
@HideInInspector
public var deadBody : Transform;//deadbody transform

private var turbilhaoDeVelocidade : ParticleSystem; //velocity feedback
private var turbilhaoDeSuperVelocidade : ParticleSystem; //velocity feedback
private var miasma : ParticleSystem; //Life feedback
private var burningEffect : ParticleSystem;
var bloom : Bloom;


private var controller : CharacterController;//Character Controller Reference
private var myTransform : Transform;//Caching component lookup - Optimization Issue

@script AddComponentMenu("Characters/Player Status");

function Awake ()
{
 	myTransform = transform;
    controller = GetComponent(CharacterController);
 	miasma = GameObject.Find("miasma").GetComponent(ParticleSystem);
 	burningEffect = GameObject.Find("Burning").GetComponent(ParticleSystem);
    turbilhaoDeVelocidade = GameObject.Find("TurbilhaoDeBolhas").GetComponent(ParticleSystem);
    turbilhaoDeSuperVelocidade = GameObject.Find("Turbilhao2").GetComponent(ParticleSystem);
	cthuloAlive = GameObject.FindObjectOfType(SkinnedMeshRenderer);

}

function Start ()
{
	Reset ();
	invunerable = true;
	bloom = Camera.mainCamera.GetComponent(Bloom);

 //carregar elementos salvos
}

function Update ()
{
	if (isDead)
		return;
    
    velocity = controller.velocity.z;
    distance = myTransform.position.z;
    	
    if (life >= 100)
    	life = 100;
    else
    	life += Time.deltaTime;
    
    miasma.startSize = life/100;
    turbilhaoDeVelocidade.emissionRate = (velocity*velocity)/200;
    
    if (velocity > 60)
    {
    	if (!turbilhaoDeSuperVelocidade.isStopped)
    		turbilhaoDeSuperVelocidade.Play();
    	turbilhaoDeSuperVelocidade.emissionRate = velocity - 60;
    }
    else
    {
        if (turbilhaoDeSuperVelocidade.isPlaying)
        	turbilhaoDeSuperVelocidade.Stop();
    }
    
	if (myTransform.position.y > 10)
	{
		bloom.bloomThreshhold = 1 - Mathf.Clamp01((myTransform.position.y - 10)/5);
		if (burningEffect.isStopped)
		{
		    burningEffect.Play();
		}
		burningEffect.emissionRate = 10- (1 - Mathf.Clamp01((myTransform.position.y - 10)/5));
		life -= 1;
	}
	else
	{
		burningEffect.Stop();
	}
		
}

function DisableParticles ()
{
   	miasma.Stop();
   	turbilhaoDeSuperVelocidade.Stop ();
   	turbilhaoDeVelocidade.Stop ();
   	burningEffect.Stop();
}

function EnableParticles ()
{
	miasma.Play();
	turbilhaoDeVelocidade.Play();
	burningEffect.Play();

}

function OnDeath ()
{
	if (!isDead)
	{
		isDead = true;
		LevelManager.gameStatus = GameStatus.GameResults;
    	DisableParticles ();

		//Instantiate Rigdoll
		var startingVelocity : Vector3 = controller.velocity;

		deadBody = Instantiate(deadReplacement, transform.position, transform.rotation);
		CopyTransformsRecurse(transform, deadBody);
		var deadRigidBody : Rigidbody = deadBody.GetComponentInChildren(Rigidbody);
		deadRigidBody.velocity = controller.velocity;
		for (var body:Rigidbody in deadBody.GetComponentsInChildren(Rigidbody))
		{
			 body.velocity = startingVelocity;
		}
		
		cthuloAlive.active = false;
	}
}

function OnAlive ()
{
	Reset ();
	cthuloAlive.active = true;
}

function ReceiveDamage (damage : float)
{
	life -= damage;
	if (life < 0)
	{
	 	BroadcastMessage ("OnDeath");
	}
}
 
function OnControllerColliderHit (hit : ControllerColliderHit)
{
	if (!invunerable && !isDead)
	{
		if (controller.collisionFlags & CollisionFlags.Sides)
		{
			if (myTransform.position.z < hit.transform.position.z)
			{
				ReceiveDamage(velocity);
			}
		}
		else
		{
			ReceiveDamage(2*velocity/3);
		}
	}
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
	EnableParticles();
}

function Invulnerabilize ()
{
	Invulnerabilize (10);
}

function Invulnerabilize (timer : float)
{
	invunerable = true;
	controller.collider.enabled = false;
	yield WaitForSeconds (timer);
	invunerable = false;
	controller.collider.enabled = true;
}

function OnGUI ()
{
	GUI.Label(Rect (Screen.width-50,50,50,50),"$: " + coins);
}