using UnityEngine;
using System.Collections;

/// <summary>
/// Demo game manager. This is the place where
/// we create the pools we need
/// </summary>
public class DemoGameManager : MonoBehaviour {
	
	public GameObject spherePrefab;
	public GameObject cubePrefab;	
	public GameObject capsulePrefab;
	
	public static DemoGameManager instance = null;
	
// We treat the first two as GameObjects
	
	/// <summary>
	/// The spheres.
	/// </summary>
	public PoolingSystem<GameObject> spheres = null;

	/// <summary>
	/// The cubes.
	/// </summary>
	public PoolingSystem<GameObject> cubes = null;
	
// And we pool the capsules as Rigidbody 
// to see how the typed pooling works. The sole
// constraint is that the component used to
// pool the objects must be in the hierarchy
// at the first level, not in any children in the 
// given prefab.
		
	/// <summary>
	/// The capsules.
	/// </summary>
	public PoolingSystem<Rigidbody> capsules = null;
	
	// Spawning counter
	private float counter = 0f;
	// Temporary GameObject holder
	private GameObject tmpObj = null;
	// Temporary Rigidbody holder
	private Rigidbody tmpRB = null;

	// GUI Positions
	private Rect cubesCount = new Rect(5f, 5f, 500f, 50f);
	private Rect spheresCount = new Rect(5f, 20f, 500f, 50f);
	private Rect capsulesCount = new Rect(5f, 35f, 500f, 50f);
	
	void Awake()
	{
		// Let's setup our singleton instance
		instance = this;
	}

	// Use this for initialization
	void Start () {
		// Initialise the spheres' pool
		spheres = new PoolingSystem<GameObject>(spherePrefab, 10);
		// Initialise the cubes' pool
		cubes = new PoolingSystem<GameObject>(cubePrefab, 10);	
		// Initialise the capsules' pool
		capsules = new PoolingSystem<Rigidbody>(capsulePrefab, 10);
	}
	
	void OnGUI()
	{
		GUI.Label(cubesCount, "Cubes - In use: " + cubes.InUse.ToString () + " - Available: " + cubes.Available.ToString());
		GUI.Label(spheresCount, "Spheres - In use: " + spheres.InUse.ToString () + " - Available: " + spheres.Available.ToString());
		GUI.Label(capsulesCount, "Capsules - In use: " + capsules.InUse.ToString () + " - Available: " + capsules.Available.ToString());
	}
	
	// Update is called once per frame
	void Update () {
		// Let's spawn at random every 100ms
		counter += Time.deltaTime;
		if (counter >= 0.1f)
		{
			counter = 0f;
			// Get an element from the pools
			int tmpInt = Random.Range(1, 10000);
			if ((tmpInt % 2) == 0)
				tmpObj = spheres.GetElement ();
			else if ((tmpInt % 3) == 0)
				tmpObj = cubes.GetElement ();
			else 
			{
				tmpRB = capsules.GetElement ();
				tmpObj = tmpRB.gameObject;
			}
			// Position the element
			tmpObj.transform.position = new Vector3(Random.Range(-6f, 6f), Random.Range(10f, 14f), Random.Range(-6f, 6f));
		}
	}
}
