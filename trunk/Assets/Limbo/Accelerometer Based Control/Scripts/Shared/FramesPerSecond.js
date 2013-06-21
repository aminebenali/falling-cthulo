// Attach this to a GUIText to make a frames/second indicator.
//
// It calculates frames/second over each updateInterval,
// so the display does not keep changing wildly.
//
// It is also fairly accurate at very low FPS counts (<10).
// We do this not by simply counting frames per interval, but
// by accumulating FPS for each frame. This way we end up with
// correct overall FPS even if the interval renders something like
// 5.5 frames.

var updateInterval = 0.5;

private var accum : float= 0.0; // FPS accumulated over the interval
private var frames: int = 0; // Frames drawn over the interval
private var timeleft : float; // Left time for current interval
private var framePerSecond : float; // FPS value
private var currentTransform : Transform;

public var skinSmallScreen : GUISkin;
public var skinBigScreen : GUISkin;
private var isBigScreen : boolean = false;

function Start()
{
	currentTransform = transform;
    timeleft = updateInterval; 
    isBigScreen = (Screen.width > 500)?true:false; 
}

function Update()
{
    timeleft -= Time.deltaTime;
    accum += Time.timeScale/Time.deltaTime;
    ++frames;
    
    // Interval ended - update GUI text and start new interval
    if( timeleft <= 0.0 )
    {
        // display two fractional digits (f2 format)
        framePerSecond = accum/frames;
        //guiText.text = "" + (accum/frames).ToString("f2");
        timeleft = updateInterval;
        accum = 0.0;
        frames = 0;
    }
}

function OnGUI(){
	GUI.skin = isBigScreen?skinBigScreen:skinSmallScreen; //GUI skin is changed for bigger screen!
	GUI.Label(Rect (Screen.width  * currentTransform.localPosition.x, Screen.height  * currentTransform.localPosition.y, Screen.width  * currentTransform.localScale.x , Screen.height  * currentTransform.localScale.y), String.Format("{0:F2}", framePerSecond), GUI.skin.GetStyle("Debug"));
}