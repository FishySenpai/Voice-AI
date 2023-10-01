import React, { useState, useEffect, useRef } from "react";
import WaveSurfer from "wavesurfer.js";
import test from "./assets/test.mp3";
function AudioPlayer({ audioSrc }) {
  const [audio] = useState(new Audio(audioSrc));
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1); // Initial volume set to maximum (1)
  const [volumeSliderVisible, setVolumeSliderVisible] = useState(false);
  const progressRef = useRef(null);
  const volumeInputRef = useRef(null);

  useEffect(() => {
    // Set up event listeners
    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("durationchange", handleDurationChange);
    audio.addEventListener("ended", handleAudioEnded);

    // Clean up event listeners on unmount
    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("durationchange", handleDurationChange);
      audio.removeEventListener("ended", handleAudioEnded);
    };
  }, [audio]);

  useEffect(() => {
    // Add scroll event listener to adjust volume with scroll
    const handleScroll = (e) => {
      const delta = e.deltaY;
      if (delta > 0) {
        // Scroll down to decrease volume
        setVolume((prevVolume) => Math.max(0, prevVolume - 0.1));
      } else {
        // Scroll up to increase volume
        setVolume((prevVolume) => Math.min(1, prevVolume + 0.1));
      }
    };

    volumeInputRef.current.addEventListener("wheel", handleScroll);
  }, []);

  const handleTimeUpdate = () => {
    setCurrentTime(audio.currentTime);
  };

  const handleDurationChange = () => {
    setDuration(audio.duration);
  };

  const handleAudioEnded = () => {
    setIsPlaying(false);
  };

  const togglePlayPause = () => {
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
      2,
      "0"
    )}`;
  };

  const handleSeek = (event) => {
    const seekTime =
      (event.nativeEvent.offsetX / progressRef.current.offsetWidth) * duration;
    audio.currentTime = seekTime;
    setCurrentTime(seekTime);
  };

  const calculateProgressBarWidth = () => {
    return (currentTime / duration) * 100 + "%";
  };

  const handleVolumeChange = (event) => {
    const newVolume = parseFloat(event.target.value);
    audio.volume = newVolume;
    setVolume(newVolume);
  };

  const handleDownload = () => {
    // Trigger the download of the audio file
    const a = document.createElement("a");
    a.href = audioSrc;
    a.download = "audio.mp3";
    a.click();
  };
  const handleVolumeIconHover = () => {
    setVolumeSliderVisible(true);
  };

  const handleVolumeIconMouseLeave = () => {
    setVolumeSliderVisible(false);
  };
  const wavesurfer = WaveSurfer.create({
    container: "#waveform",
    waveColor: "#4F4A85",
    progressColor: "#383351",
    url: {test},
  });
  return (
    <div className="audio-player relative">
      <div className="flex flex-row">
        <div className="volume-btn">
          <button className="reset-btn " onClick={togglePlayPause}>
            {isPlaying ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="30px"
                viewBox="0 0 320 512"
              >
                <path d="M48 64C21.5 64 0 85.5 0 112V400c0 26.5 21.5 48 48 48H80c26.5 0 48-21.5 48-48V112c0-26.5-21.5-48-48-48H48zm192 0c-26.5 0-48 21.5-48 48V400c0 26.5 21.5 48 48 48h32c26.5 0 48-21.5 48-48V112c0-26.5-21.5-48-48-48H240z" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="30px"
                viewBox="0 0 384 512"
              >
                <path d="M73 39c-14.8-9.1-33.4-9.4-48.5-.9S0 62.6 0 80V432c0 17.4 9.4 33.4 24.5 41.9s33.7 8.1 48.5-.9L361 297c14.3-8.7 23-24.2 23-41s-8.7-32.2-23-41L73 39z" />
              </svg>
            )}
          </button>
        </div>
        
        <div ref={progressRef} className="progress-bar" onClick={handleSeek}>
          <div
            className="progress"
            style={{ width: calculateProgressBarWidth() }}
          />
        </div>
        <div
          className="flex flex-col relative volume"
          onMouseEnter={handleVolumeIconHover}
          onMouseLeave={handleVolumeIconMouseLeave}
        >
          <div
            className={`volume-container ${
              volumeSliderVisible ? "visible" : "hidden"
            }`}
          >
            <input
              ref={volumeInputRef}
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={handleVolumeChange}
              className="volume-slider"
            />
          </div>
          <div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="20px"
              viewBox="0 0 640 512"
            >
              <path d="M533.6 32.5C598.5 85.3 640 165.8 640 256s-41.5 170.8-106.4 223.5c-10.3 8.4-25.4 6.8-33.8-3.5s-6.8-25.4 3.5-33.8C557.5 398.2 592 331.2 592 256s-34.5-142.2-88.7-186.3c-10.3-8.4-11.8-23.5-3.5-33.8s23.5-11.8 33.8-3.5zM473.1 107c43.2 35.2 70.9 88.9 70.9 149s-27.7 113.8-70.9 149c-10.3 8.4-25.4 6.8-33.8-3.5s-6.8-25.4 3.5-33.8C475.3 341.3 496 301.1 496 256s-20.7-85.3-53.2-111.8c-10.3-8.4-11.8-23.5-3.5-33.8s23.5-11.8 33.8-3.5zm-60.5 74.5C434.1 199.1 448 225.9 448 256s-13.9 56.9-35.4 74.5c-10.3 8.4-25.4 6.8-33.8-3.5s-6.8-25.4 3.5-33.8C393.1 284.4 400 271 400 256s-6.9-28.4-17.7-37.3c-10.3-8.4-11.8-23.5-3.5-33.8s23.5-11.8 33.8-3.5zM301.1 34.8C312.6 40 320 51.4 320 64V448c0 12.6-7.4 24-18.9 29.2s-25 3.1-34.4-5.3L131.8 352H64c-35.3 0-64-28.7-64-64V224c0-35.3 28.7-64 64-64h67.8L266.7 40.1c9.4-8.4 22.9-10.4 34.4-5.3z" />
            </svg>
          </div>
        </div>
        <div className="time">
          {formatTime(currentTime)} / {formatTime(duration)}
        </div>
        <button className="download-btn" onClick={handleDownload}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="20px"
            viewBox="0 0 512 512"
          >
            <path d="M288 32c0-17.7-14.3-32-32-32s-32 14.3-32 32V274.7l-73.4-73.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l128 128c12.5 12.5 32.8 12.5 45.3 0l128-128c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L288 274.7V32zM64 352c-35.3 0-64 28.7-64 64v32c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V416c0-35.3-28.7-64-64-64H346.5l-45.3 45.3c-25 25-65.5 25-90.5 0L165.5 352H64zm368 56a24 24 0 1 1 0 48 24 24 0 1 1 0-48z" />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default AudioPlayer;
