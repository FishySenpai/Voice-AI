import React, { useState, useEffect, useRef } from "react";

function AudioPlayer({ audioSrc }) {
  const [audio] = useState(new Audio(audioSrc));
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1); // Initial volume set to maximum (1)

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

    return () => {
      volumeInputRef.current.removeEventListener("wheel", handleScroll);
    };
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

  return (
    <div className="audio-player">
      <div className="flex flex-row">
        <button className="reset-btn" onClick={togglePlayPause}>
          {isPlaying ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="30"
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
        <div ref={progressRef} className="progress-bar" onClick={handleSeek}>
          <div
            className="progress"
            style={{ width: calculateProgressBarWidth() }}
          />
        </div>
        <div className="volume-container">
          <input
            ref={volumeInputRef}
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onInput={handleVolumeChange}
            className="volume-slider"
          />
        </div>
        <div className="time">
          {formatTime(currentTime)} / {formatTime(duration)}
        </div>
        <button className="reset-btn" onClick={handleDownload}><svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512"><path d="M288 32c0-17.7-14.3-32-32-32s-32 14.3-32 32V274.7l-73.4-73.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l128 128c12.5 12.5 32.8 12.5 45.3 0l128-128c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L288 274.7V32zM64 352c-35.3 0-64 28.7-64 64v32c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V416c0-35.3-28.7-64-64-64H346.5l-45.3 45.3c-25 25-65.5 25-90.5 0L165.5 352H64zm368 56a24 24 0 1 1 0 48 24 24 0 1 1 0-48z"/></svg></button>
      </div>
    </div>
  );
}

export default AudioPlayer;
