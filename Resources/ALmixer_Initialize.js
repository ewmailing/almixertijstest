
var almixerproxy = require('co.lanica.almixer');

var s_JSALmixerDataChannelTable = {}

almixerproxy.addEventListener('ALmixerSoundPlaybackFinished', 
	function(e)
	{
		
  Ti.API.info("addEventListener name is "+e.name);
//  Ti.API.info("handle is "+e.handle);
  Ti.API.info("addEventListener channel is "+e.channel);
  Ti.API.info("addEventListener source is "+e.source);
  Ti.API.info("addEventListener completed is "+e.completed);

	var which_channel = e.channel;
	var saved_table = s_JSALmixerDataChannelTable[which_channel];
	  Ti.API.info("addEventListener saved_table is "+saved_table);

	var callback_function = saved_table.onComplete;
	var sound_handle = saved_table.soundHandle;
	var event_table =
	{
		name:"audio",
		type:"completed",
		channel:which_channel,
		source:e.source,
		completed:e.completed,
		handle:saved_table.soundHandle,
	};

	// We can now free our saved reference
	s_JSALmixerDataChannelTable[which_channel] = null;
	
	// Invoke user callback
	if(null != callback_function)
	{
		callback_function(event_table);
		event_table = null;
		callback_function = null;
	}
	event_table = null;

});


function JSALmixerPlaySound(sound_handle, options_table)
{
	  Ti.API.info("JSALmixerPlaySound called ");

	var which_channel = -1;
	var num_loops = 0;
	var duration = -1;
	var on_complete = null;
	if(null != options_table)
	{
		if(null != options_table.channel)
		{
			which_channel = options_table.channel;
		}
		if(null != options_table.loops)
		{
			num_loops = options_table.loops;
		}
		if(null != options_table.duration)
		{
			duration = options_table.duration;
		}
		if(null != options_table.onComplete)
		{
			on_complete = options_table.onComplete;
		}
		
	}
//	  Ti.API.info("PlayChannelTimed call on channel:" + which_channel + " sound_handle:" + sound_handle);

	var playing_channel = ALmixer.PlayChannelTimed(which_channel, sound_handle, num_loops, duration);
	// Do only if playing succeeded
	if(playing_channel > -1)
	{
		// Save the sound_handle to solve two binding problems.
		// Problem 1: Garbage collection. The object looks like it disappears and resurrects later.
		// We can't let the garbage collector collect the object while it is playing.
		// So we need keep a strong reference around.
		// Note: The sound could be playing on multiple channels, so we need to make sure we cover that case.
		// Problem 2: ALmixer_Data for callbacks. Currently it is not clear how to get the ALmixer_Data pointer
		// back to Javascript in a form that is usable using the Titanium callback system since it doesn't handle
		// pointers and doesn't know anything about SWIG.
		// The solution to both problems is to keep a global table mapping channels to sound_handles.
		// For each playing channel, we hold a reference to the sound which keeps the object alive 
		// (and handles the multiple channel case). 
		// In the callback, we can retrieve the data by looking up the channel which solves the pointer problem.
		// Problem 3: We would also like to make the API nicer for Javascript and let people pass in anonymous callback functions for each channel.
		// This table structure will let us also keep around their callback.
		s_JSALmixerDataChannelTable[playing_channel] = { soundHandle:sound_handle, onComplete:options_table.onComplete };
	}
//		  Ti.API.info("PlayChannelTimed playing on channel:" + playing_channel);

	return playing_channel;

}

ALmixer.Play = JSALmixerPlaySound;



