import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import AiInterviewerGif from '../assets/AI_Interviewer.gif';
import MainLogo from '../assets/logo.png';
import { Link } from 'react-router-dom';

const Interview = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [timer, setTimer] = useState(180); // 3 minutes in seconds
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [audioChunks, setAudioChunks] = useState([]);
  const [recordingURL, setRecordingURL] = useState(null);
  const timerIntervalRef = useRef(null);

  // Format time as MM:SS
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Start/stop timer
  useEffect(() => {
    if (isRecording && timer > 0) {
      timerIntervalRef.current = setInterval(() => {
        setTimer((prevTime) => {
          if (prevTime <= 1) {
            handleRecordToggle(); // Stop recording when timer reaches 0
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    } else {
      clearInterval(timerIntervalRef.current);
    }

    return () => clearInterval(timerIntervalRef.current);
  }, [isRecording, timer]);

  // Handle recording toggle
  const handleRecordToggle = () => {
    if (isRecording) {
      // Stop recording
      if (mediaRecorder) {
        mediaRecorder.stop();
      }
      setIsRecording(false);
    } else {
      // Start recording
      startRecording();
      setIsRecording(true);
    }
  };

  // Start recording function
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      // 여기서 오디오 형식을 명시적으로 지정
      const options = { 
        mimeType: 'audio/webm;codecs=opus', 
        audioBitsPerSecond: 128000 
      };
      
      // 브라우저 호환성 체크
      let recorder;
      if (MediaRecorder.isTypeSupported('audio/webm;codecs=opus')) {
        recorder = new MediaRecorder(stream, options);
      } else if (MediaRecorder.isTypeSupported('audio/mp4')) {
        recorder = new MediaRecorder(stream, { mimeType: 'audio/mp4' });
      } else {
        recorder = new MediaRecorder(stream);
      }
      
      const chunks = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.push(e.data);
        }
      };

      recorder.onstop = () => {
        const audioBlob = new Blob(chunks, { type: recorder.mimeType });
        const url = URL.createObjectURL(audioBlob);
        setRecordingURL(url);
        
        // 로컬 저장을 위한 파일 형식 결정
        const fileExtension = recorder.mimeType.includes('webm') ? 'webm' : 
                             recorder.mimeType.includes('mp4') ? 'm4a' : 'wav';
        
        // 자동 다운로드
        saveRecording(audioBlob, fileExtension);
        
        // 스트림 정리
        stream.getTracks().forEach(track => track.stop());
      };

      recorder.start(100); // 100ms 간격으로 데이터 수집
      setMediaRecorder(recorder);
      setAudioChunks([]);
    } catch (error) {
      console.error('Error accessing microphone:', error);
      setIsRecording(false);
      alert('마이크 접근에 실패했습니다. 마이크 권한을 확인해주세요.');
    }
  };

  // Save recording to local device
  const saveRecording = (blob, fileExtension) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = `interview-recording.${fileExtension}`;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 100);
  };

  // Calculate timer percentage for the circle
  const timerPercentage = (timer / 180) * 100;
  const circumference = 2 * Math.PI * 80; // Circle radius is 80
  const dashOffset = circumference * (1 - timerPercentage / 100);

  return (
    <Container>
      <Content>
        <InterviewerSection>
          <Logo>
            <img src={MainLogo} alt='Je myeon so Logo'/>
          </Logo>
          <InterviewerVideo>
            <img src={AiInterviewerGif} alt="AI Interviewer" />
          </InterviewerVideo>
        </InterviewerSection>
        <ControlsSection>
          <TimerContainer>
            <svg width="170" height="170" viewBox="0 0 170 170">
              <circle
                cx="85"
                cy="85"
                r="80"
                fill="none"
                stroke="#EEEEEE"
                strokeWidth="10"
              />
              <circle
                cx="85"
                cy="85"
                r="80"
                fill="none"
                stroke="#6042ff"
                strokeWidth="10"
                strokeDasharray={circumference}
                strokeDashoffset={dashOffset}
                transform="rotate(-90 85 85)"
              />
              <text
                x="85"
                y="90"
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="34"
                fontWeight="bold"
                fill="#000"
              >
                {formatTime(timer)}
              </text>
            </svg>
          </TimerContainer>
          <RecordButtonContainer>
            <RecordButton isRecording={isRecording} onClick={handleRecordToggle}>
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"></path>
                <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                <line x1="12" y1="19" x2="12" y2="22"></line>
              </svg>
            </RecordButton>
          </RecordButtonContainer>
          
          {recordingURL && (
            <PreviewSection>
              <h3>녹음된 오디오</h3>
              <audio controls src={recordingURL}></audio>
            </PreviewSection>
          )}
        </ControlsSection>
      </Content>
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  min-height: 100vh;
  background-color: white;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
  border-radius: 20px;
  overflow: hidden;
`;

const Content = styled.div`
  display: flex;
  height: 100vh;
`;

const Logo = styled.div`
  position: absolute;
  top: 35px;
  left: 30px;
  img {
    height: 30px;
  }
`;

const InterviewerSection = styled.div`
  flex: 2;
  background-color: #F9F9F9;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 20px;
`;

const InterviewerVideo = styled.div`
  width: 100%;
  max-width: 600px;
  height: auto;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const ControlsSection = styled.div`
  width: 400px;
  flex:1;
  padding: 40px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
`;

const TimerContainer = styled.div`
  margin-top: 200px;
`;

const RecordButtonContainer = styled.div`
  margin: 40px 0;
  display: flex;
  justify-content: center;
`;

const PreviewSection = styled.div`
  width: 100%;
  text-align: center;
  margin-bottom: 200px;
  
  h3 {
    margin-bottom: 10px;
    color: #333;
  }
  
  audio {
    width: 100%;
    margin-top: 10px;
  }
`;

const RecordButton = styled.button`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background-color: white;
  border: 2px solid ${props => props.isRecording ? '#ff4d4d' : '#ddd'};
  color: ${props => props.isRecording ? '#ff4d4d' : '#333'};
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
  
  &:hover {
    transform: scale(1.05);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.15);
  }
  
  &:focus {
    outline: none;
  }
`;

export default Interview;