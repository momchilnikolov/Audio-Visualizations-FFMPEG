import React, { useState, useEffect } from 'react';
import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";
const ffmpeg = createFFmpeg({log: true});
export function Home() {
  const [ready, setReady] = useState(false);
  const [audioProcessed, setAudioProcessed] = useState(false);
  const [audio, setAudio] = useState();
  const [consoleOutput, setConsoleOutput] = useState();
  const load = async () => {
      await ffmpeg.load();
      setReady(true);
      console.stdlog = console.log.bind(console);
       //enable console output to our page to see process status
      console.log = function(){
        setConsoleOutput(arguments);
        console.stdlog.apply(console, arguments);
      }
    }

    const showWaveForm = async ()=>{
      setReady(false);
      ffmpeg.FS("writeFile", "result.mp3", await fetchFile(audio));
      //file output is limited to 10MB for faster processing
      await ffmpeg.run('-i', 'result.mp3','-fs','10M','-filter_complex', 'showwaves=mode=line', 'output.mp4');
      const data = ffmpeg.FS('readFile', 'output.mp4');
      const url = URL.createObjectURL(new Blob([data.buffer], { type: 'video/mpeg' }));
      setAudio(url);
      setAudioProcessed(true);
      setReady(true);
    }
    const showVisualization = async ()=>{
      setReady(false);
      ffmpeg.FS("writeFile", "result.mp3", await fetchFile(audio));
      await ffmpeg.run('-i', 'result.mp3','-fs','10M','-filter_complex', 'showcqt', 'output.mp4')
      const data = ffmpeg.FS('readFile', 'output.mp4');
      const url = URL.createObjectURL(new Blob([data.buffer], { type: 'video/mpeg' }));
      setAudio(url);
      setAudioProcessed(true);
      setReady(true);
    }
    const vectorScope = async ()=>{
      setReady(false);
      ffmpeg.FS("writeFile", "result.mp3", await fetchFile(audio));
      await ffmpeg.run('-i', 'result.mp3','-fs','10M','-filter_complex', 'avectorscope', 'output.mp4')
      const data = ffmpeg.FS('readFile', 'output.mp4');
      const url = URL.createObjectURL(new Blob([data.buffer], { type: 'video/mpeg' }));
      setAudio(url);
      setAudioProcessed(true);
      setReady(true);
    }
    useEffect(()=>{
      load();
    }, []);
    // const cancelProcessing = () => {
    //    ffmpeg.FS()
    //   setAudioProcessed(false);
    //   setReady(true);
    // }
    return ready ? (
      <div className="App">
      { !audio&& <span>Please, select an audio file such as mp3 or wav.</span>}
        <p>
        Audio Input:<input type="file" onChange={(e) => setAudio(e.target.files?.item(0))} />
        </p>

        <h1>Video Operations</h1>
        <p><button className="m-1 btn-default" onClick={audio && showWaveForm}>WaveForm Visualize</button>
        <button className="m-1 btn-default" onClick={audio && showVisualization}>CQT Visualize</button>
        <button className="m-1 btn-default" onClick={audio && vectorScope}>Vector Scope</button></p>
        <p> 
        { audioProcessed && <video controls width="800" src={audio} ></video>}
        </p>
        
      </div>
    ) : (<div><p>{consoleOutput}</p></div>) ;
  
}