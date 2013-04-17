#pragma strict
private var myCamera : Camera;

function Awake ()
{
	Resources.UnloadUnusedAssets();
	myCamera = Camera.mainCamera;
	
	if (SystemInfo.graphicsShaderLevel >= 30)
	{
		myCamera.renderingPath = RenderingPath.DeferredLighting;

	}
	else if (SystemInfo.graphicsShaderLevel >= 20)
	{
		myCamera.renderingPath = RenderingPath.Forward;
	}
	else
	{
		myCamera.renderingPath = RenderingPath.VertexLit;
		myCamera.GetComponent(EdgeDetectEffectNormals).enabled = false;
	}
}

function Start ()
{

	
}

function Update () {

}

function OnGUI ()
{
	//GUILayout.Label(SystemInfo.graphicsShaderLevel.ToString()); returned 30 on Tchowkes Mobile
}