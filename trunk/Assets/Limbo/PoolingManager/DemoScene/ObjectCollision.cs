using UnityEngine;
using System.Collections;

public enum ObjType 
{
	Sphere = 0,
	Cube,
	Capsule
}

public class ObjectCollision : MonoBehaviour {
	
	public ObjType whoAmI = ObjType.Sphere;

	void OnCollisionEnter(Collision collision)
	{
		// Only release the object if hits the plane
		if (collision.contacts[0].otherCollider.gameObject.name != "Plane")
			return;
		// release this object
		switch (whoAmI)
		{
		case ObjType.Cube:
			DemoGameManager.instance.cubes.ReleaseElement (gameObject, true);
			break;
		case ObjType.Sphere:
			DemoGameManager.instance.spheres.ReleaseElement (gameObject, true);
			break;
		case ObjType.Capsule:
			DemoGameManager.instance.capsules.ReleaseElement (rigidbody, true);
			break;
		}
	}
}
