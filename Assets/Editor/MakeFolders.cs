using UnityEngine;
using UnityEditor;
using System.Collections;
using System.IO;
 
/// Store this code as "MakeFolders.cs" in the Assets\Editor directory (create it, if it does not exist)
/// Creates a number of directories for storage of various content types.
/// Modify as you see fit.
/// Directories are created in the Assets dir.
/// Not tested on a Mac.
 
 
public class MakeFolders : ScriptableObject
{
 
    [MenuItem ( "Assets/Make Project Folders" )]
    static void MenuMakeFolders()
    {
		CreateFolders();
	}
 
	static void CreateFolders()
	{
		string f = Application.dataPath + "/";
 
		Directory.CreateDirectory(f + "Meshes");
		Directory.CreateDirectory(f + "Fonts");
		Directory.CreateDirectory(f + "Plugins");
		Directory.CreateDirectory(f + "Textures");
		Directory.CreateDirectory(f + "Materials");
		Directory.CreateDirectory(f + "Physics");
		Directory.CreateDirectory(f + "Resources");
		Directory.CreateDirectory(f + "Scenes");
		Directory.CreateDirectory(f + "Music");
		Directory.CreateDirectory(f + "Packages");
		Directory.CreateDirectory(f + "Scripts");
		Directory.CreateDirectory(f + "Shaders");
		Directory.CreateDirectory(f + "Sounds");
 
		Debug.Log("Created directories");
	}
}