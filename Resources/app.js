/*
 * Single Window Application Template:
 * A basic starting point for your application.  Mostly a blank canvas.
 * 
 * In app.js, we generally take care of a few things:
 * - Bootstrap the application with any data we need
 * - Check for dependencies like device type, platform version or network connection
 * - Require and open our top-level UI component
 *  
 */


//bootstrap and check dependencies
if (Ti.version < 1.8 ) {
	alert('Sorry - this application template requires Titanium Mobile SDK 1.8 or later');	  	
}

// This is a single context application with mutliple windows in a stack
(function() {
	//determine platform and form factor and render approproate components
	var osname = Ti.Platform.osname,
		version = Ti.Platform.version,
		height = Ti.Platform.displayCaps.platformHeight,
		width = Ti.Platform.displayCaps.platformWidth;
	
	//considering tablet to have one dimension over 900px - this is imperfect, so you should feel free to decide
	//yourself what you consider a tablet form factor for android
	var isTablet = osname === 'ipad' || (osname === 'android' && (width > 899 || height > 899));
	
	var Window;
	if (isTablet) {
		Window = require('ui/tablet/ApplicationWindow');
	}
	else {
		// Android uses platform-specific properties to create windows.
		// All other platforms follow a similar UI pattern.
		if (osname === 'android') {
			Window = require('ui/handheld/android/ApplicationWindow');
		}
		else {
			Window = require('ui/handheld/ApplicationWindow');
		}
	}


var platino = require('co.lanica.platino');
//var almixerproxy = require('co.lanica.almixer');
var ALmixer = platino.require('co.lanica.almixer');
//Ti.API.info("module is => "+almixerproxy);
//platino.require('co.lanica.almixer');
Ti.API.info("module is => "+ALmixer);


//almixerproxy.require("co.lanica.almixer");
Ti.API.info("done calling my-require ");
// Note: Our module code calls Init for us. But maybe we want to give the user more control since this is where they setup the frequency.
var init_flag = ALmixer.Init(0,32,0);
// I don't think Ti print commands understand how to handle type 'char' because the return value keeps coming up blank.
	  Ti.API.info("init_flag is " + init_flag + ".\n");


//var ALmixer = platino.require('co.lanica.almixer');



//Ti.include('ALmixer_Initialize.js');
/*
almixerproxy.addEventListener('ALmixerSoundPlaybackFinished',function(e){
  Ti.API.info("name is "+e.name);
//  Ti.API.info("handle is "+e.handle);
  Ti.API.info("channel is "+e.channel);
  Ti.API.info("source is "+e.alsource);
  Ti.API.info("completed is "+e.completed);
});
*/



/*
var resource_dir;
if (Ti.Platform.osname == 'android')
{
	resource_dir = "Resources/";

}
else
{
	resource_dir = Ti.Filesystem.resourcesDirectory;
	Ti.API.info("resource_dir is => "+resource_dir);

	//var resource_dir = Ti.Filesystem.resourcesDirectory + Ti.Filesystem.separator;
	// Originally, I was getting a file://localhost/ at the beginning of the directory. 
	// This is a problem because ALmixer needs file paths compatible with the typical fopen type family.
	resource_dir = resource_dir.replace(/^file:\/\/localhost/g,'');
	// Later, Titanium started giving me URLs like file:// without the localhost. So this is a fallback string replacement.
	resource_dir = resource_dir.replace(/^file:\/\//g,'');
	// Replace %20 with spaces.
	resource_dir = resource_dir.replace(/%20/g,' ');
}
*/
//var full_file_path = resource_dir + "pew-pew-lei.wav";
//Ti.API.info("full_file_path is => "+full_file_path);

// A nice convenience function would be to automatically try looking in the Resource directory if the user did not provide an absolute path.
/*
var sound_handle_pew = ALmixer.LoadAll(full_file_path, 0);
var sound_handle_note = ALmixer.LoadAll(resource_dir + "note2_aac.aac", 0);
var music_handle = ALmixer.LoadStream(resource_dir + "background-music-aac.wav", 0, 0, 0, 0, 0);
*/
var sound_handle_pew = ALmixer.LoadAll("pew-pew-lei.wav");
var sound_handle_note = ALmixer.LoadAll("note2_aac.aac");
var music_handle = ALmixer.LoadStream("background-music-aac.wav");

//	Ti.API.info("channel is => "+channel);
var options_table = { onComplete:function(e) {
	  Ti.API.info("name is "+e.name);
//  Ti.API.info("handle is "+e.handle);
  Ti.API.info("channel is "+e.channel);
  Ti.API.info("source is "+e.alsource);
  Ti.API.info("completed is "+e.completed);
	
}
};
options_table.loops = -1;
//var music_channel = ALmixer.util.Play(music_handle, options_table);

// This will omit one channel (channel #0) from the automatic channel assignment mechanism so it is always available.
// I will use this reserved channel for music. 
// This is typical because you generally always want to make sure you have a free channel for music (since people will notice missing music more than any other missing sound effect),
// and it also makes it easier because you can directly refer to the channel number instead of using a variable (if you choose). This can be useful for global user preferences such as having different volumes for music and sound effects.
ALmixer.ReserveChannels(1);
// This says play the music on channel 0, and loop infinitely (-1)
var music_channel = ALmixer.PlayChannel(0, music_handle, -1);
//var music_channel = ALmixer.PlayChannelTimed(-1, music_handle, -1, -1);
//var music_channel = ALmixer.PlayChannel(music_handle, -1);
options_table.loops = 1;
//var note_channel = ALmixer.Play(sound_handle_note, options_table);
options_table.loops = 4;

/*
music_handle = null;
ALmixer.FreeData(sound_handle_note);
sound_handle_note = null;
sound_handle_pew = null;
*/
//	var ret_win = new Window().open();
	var win = Window();

	var note_button = Ti.UI.createButton({
//	backgroundImage:'blue.png',
	title:'note',
//	width:90,
//	height:35,
//	right:12,
//	bottom:10,
	top:44,
	left:4,
//	font:{fontFamily:'Arial',fontWeight:'bold',fontSize:14},
//	opacity:0
	});

	note_button.addEventListener('click', function(event)
	{
		// PlayChannel allows you to omit the channel (-1) and num_loops (0).
		var note_channel = ALmixer.PlayChannel(sound_handle_note, 
			function(e)
			{
			 	Ti.API.info("completed pew is "+e.name);
			 	Ti.API.info("name is "+e.name);
				Ti.API.info("channel is "+e.channel);
				Ti.API.info("source is "+e.alsource);
				Ti.API.info("finishedNaturally is "+e.finishedNaturally);
			}
		);
	}); 
/*
var window1 = Titanium.UI.createWindow({
    
})
*/

	var pew_button = Ti.UI.createButton({
//	backgroundImage:'blue.png',
	title:'pew',
//	width:90,
//	height:35,
//	right:12,
//	bottom:10,
	top:44,
	left:64,
//	font:{fontFamily:'Arial',fontWeight:'bold',fontSize:14},
//	opacity:0
	});

	pew_button.addEventListener('click', function(event)
	{
		// Alternatively, if you prefer named parameters,
		// the ALmixer.util library provides this convenience function for this style.
		var pew_channel = ALmixer.util.Play(sound_handle_pew,
		{
			loops:2,
			onComplete:function(e)
			{
			 	Ti.API.info("completed_note is "+e.name);
			 	Ti.API.info("name is "+e.name);
				Ti.API.info("channel is "+e.channel);
				Ti.API.info("source is "+e.alsource);
				Ti.API.info("finishedNaturally is "+e.finishedNaturally);

			},
		});
	});
	
	var music_button = Ti.UI.createButton({
//	backgroundImage:'blue.png',
	title:'Pause-Music',
//	width:90,
//	height:35,
//	right:12,
//	bottom:10,
	top:4,
	left:4,
//	font:{fontFamily:'Arial',fontWeight:'bold',fontSize:14},
//	opacity:0
	});

	music_button.addEventListener('click', function(event)
	{

		if(ALmixer.IsPausedChannel(music_channel))
		{
			ALmixer.ResumeChannel(music_channel);
		}
		else
		{
			ALmixer.PauseChannel(music_channel);
		}


	}); 
	
	var volume_slider = Titanium.UI.createSlider({
    min:0,
    max:1.0,
    value:1.0,
    width:268,
    height:30,
    top:90,
 //   leftTrackImage:'../images/slider_orangebar.png',
 //   rightTrackImage:'../images/slider_lightbar.png',
 //   thumbImage:'../images/slider_thumb.png'
});
volume_slider.addEventListener('change',function(e)
{
	ALmixer.SetMasterVolume(e.value);
	
});

	var pitch_slider = Titanium.UI.createSlider({
    min:.25,
    max:2.0,
    value:1.0,
    width:268,
    height:30,
    top:130,
 //   leftTrackImage:'../images/slider_orangebar.png',
 //   rightTrackImage:'../images/slider_lightbar.png',
 //   thumbImage:'../images/slider_thumb.png'
});
pitch_slider.addEventListener('change',function(e)
{
	//ALmixer.SetMasterVolume(e.value);
	var ret_array = {};
	var ret_val = 0;
	var alsource = ALmixer.GetSource(0);
	var ret_val1 = {};
	var ret_val2 = {};
	var ret_val3 = {};

	ALmixer.alGetSourcef(alsource, ALmixer.AL_PITCH, ret_val1);
  Ti.API.info("old pitch "+ ret_val1[0]);

	ALmixer.alSourcef(alsource, ALmixer.AL_PITCH, e.value);

	ALmixer.alGetSourcef(alsource, ALmixer.AL_PITCH, ret_val2);
  Ti.API.info("new pitch "+ ret_val2[0]);

	ALmixer.alGetSource3f(alsource, ALmixer.AL_POSITION, ret_val1, ret_val2, ret_val3);
  //Ti.API.info("position  "+ ret_array[0] + ", " +  ret_array[1] + ", " +  ret_array[2]);
  Ti.API.info("alGetSource3f position  "+ ret_val1[0] + ", " +  ret_val2[0] + ", " +  ret_val3[0]);
	
	ALmixer.alGetSourcefv(alsource, ALmixer.AL_POSITION, ret_array);
  Ti.API.info("alGetSource3fv position  "+ ret_array[0] + ", " +  ret_array[1] + ", " +  ret_array[2]);

  
});



//var curr_win = Ti.UI.currentWindow;
win.add(note_button);
win.add(pew_button);
win.add(music_button);
win.add(volume_slider);
win.add(pitch_slider);
win.open();

if (Ti.Platform.osname == 'android')
{
Titanium.Android.currentActivity.addEventListener('pause', 
	function()
	{
 		ALmixer.BeginInterruption();
	}
);

Titanium.Android.currentActivity.addEventListener('resume', 
	function()
	{
		ALmixer.EndInterruption();
	}
);
}
else
{
	Titanium.App.addEventListener('pause', 
	function()
	{
 		ALmixer.BeginInterruption();
	}
);

Titanium.App.addEventListener('resume', 
	function()
	{
		ALmixer.EndInterruption();
	}
);


}


})();
