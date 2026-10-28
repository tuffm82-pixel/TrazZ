/* Original, locally synthesized TrazZ soundtrack. No downloads or external audio. */
(function(root){
 'use strict';
 function create(options={}){
  const Audio=options.AudioContext||root.AudioContext||root.webkitAudioContext;
  const repeat=options.setInterval||root.setInterval?.bind(root),cancel=options.clearInterval||root.clearInterval?.bind(root);
  let context,master,timer=null,enabled=true,scene='menu',world=0,next=0,step=0;
  const active=new Set();
  const notes=[0,7,12,10,7,3,10,7,0,7,15,12,10,7,3,7];
  function tone(midi,at,duration,volume,type='triangle'){
   const voice=context.createOscillator(),gain=context.createGain();
   voice.type=type;voice.frequency.setValueAtTime(440*Math.pow(2,(midi-69)/12),at);
   gain.gain.setValueAtTime(0,at);gain.gain.linearRampToValueAtTime(volume,at+.018);
   gain.gain.exponentialRampToValueAtTime(.0001,at+duration);
   voice.connect(gain);gain.connect(master);active.add(voice);voice.start(at);voice.stop(at+duration+.03);
   voice.onended=()=>{active.delete(voice);voice.disconnect();gain.disconnect()};
  }
  function schedule(){
   if(!context||context.state!=='running')return;
   if(next<context.currentTime-.2)next=context.currentTime+.04;
   const beat=60/(scene==='game'?108:84)/2;
   while(next<context.currentTime+.15){
    const bar=Math.floor(step/16)%4,rootNote=[45,41,48,43][bar]+(scene==='game'?world%3:0);
    tone(rootNote+24+notes[step%16],next,beat*.85,scene==='game'?.07:.045,'sine');
    if(step%4===0)tone(rootNote,next,beat*3.4,.09);
    if(step%16===0){tone(rootNote+12,next,beat*14,.035,'sine');tone(rootNote+19,next,beat*14,.025,'sine');}
    if(scene==='game'&&step%4===0)tone(30,next,.13,.12,'sine');
    next+=beat;step++;
   }
  }
  function stop(){
   for(const voice of active){try{voice.stop()}catch{}}active.clear();
   if(timer!==null){cancel(timer);timer=null;}
   if(context){master.gain.cancelScheduledValues(context.currentTime);master.gain.setValueAtTime(0,context.currentTime);context.suspend()?.catch(()=>{});}
  }
  function play(mode='menu',planet=0){
   if(!enabled||!Audio||!repeat)return;
   scene=mode;world=planet;
   try{
    if(!context){context=new Audio();master=context.createGain();master.gain.value=0;master.connect(context.destination);}
    master.gain.cancelScheduledValues(context.currentTime);master.gain.setValueAtTime(master.gain.value,context.currentTime);master.gain.linearRampToValueAtTime(.38,context.currentTime+.25);
    if(timer===null){next=context.currentTime+.04;context.resume()?.catch(()=>{});schedule();timer=repeat(schedule,25);}
   }catch{stop();}
  }
  return{play,stop,setEnabled(value){enabled=!!value;if(!enabled)stop();},get playing(){return timer!==null;}};
 }
 const api={create};root.TrazZMusic=api;if(typeof module!=='undefined')module.exports=api;
})(typeof window!=='undefined'?window:globalThis);
