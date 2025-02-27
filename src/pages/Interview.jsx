"use client";

// pages/InterviewPage.tsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import AiInterviewerGif from '../assets/AI_Interviewer.gif';
import MainLogo from '../assets/logo.png';

// 질문 3번이 나오도록
const MAX_RECORDINGS = 3;

const Interview = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [timer, setTimer] = useState(180);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [audioChunks, setAudioChunks] = useState([]);
  const [recordings, setRecordings] = useState([]);
  const [recordingCount, setRecordingCount] = useState(0);
  const timerIntervalRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    textToSpeech(); // 페이지 로드 시 자동 실행
  }, []);

  function textToSpeech() {
    let text = document.getElementById("questionText").innerText;
    let speech = new SpeechSynthesisUtterance();
    speech.text = text;
    speech.lang = "ko-KR"; // 한국어 설정
    speech.volume = 1;
    speech.rate = 1;
    speech.pitch = 1;
    
    // 사용 가능한 한국어 음성을 선택 (옵션)
    let voices = window.speechSynthesis.getVoices();
    let koreanVoice = voices.find(voice => voice.lang === "ko-KR");
    if (koreanVoice) {
        speech.voice = koreanVoice;
    }
    
    window.speechSynthesis.speak(speech);
  }

  // 음성 목록을 로드한 후 실행되도록 처리
  window.speechSynthesis.onvoiceschanged = function() {
    textToSpeech(); // 음성이 변경되면 실행
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

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

  const handleRecordToggle = () => {
    if (isRecording) {
      if (mediaRecorder) {
        mediaRecorder.stop();
      }
      setIsRecording(false);
    } else {
      if (recordingCount < MAX_RECORDINGS) {
        startRecording();
        setIsRecording(true);
      }
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks = [];

      recorder.ondataavailable = (e) => {
        chunks.push(e.data);
      };

      recorder.onstop = () => {
        const audioBlob = new Blob(chunks, { type: 'audio/wav' });
        setRecordings((prev) => [...prev, audioBlob]);
        downloadRecording(audioBlob, recordings.length + 1);
        stream.getTracks().forEach(track => track.stop());
        
        if (recordingCount + 1 < MAX_RECORDINGS) {
          setRecordingCount(recordingCount + 1);
          setTimer(180);
          setTimeout(() => startRecording(), 1000);
        } else {
          setIsRecording(false);
          navigate('/result');
        }
      };

      recorder.start();
      setMediaRecorder(recorder);
      setAudioChunks([]);
    } catch (error) {
      console.error('Error accessing microphone:', error);
      setIsRecording(false);
    }
  };

  const downloadRecording = (blob, index) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = `interview-recording-${index}.wav`;
    document.body.appendChild(a);
    a.click();
    URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  const timerPercentage = (timer / 180) * 100;
  const circumference = 2 * Math.PI * 80;
  const dashOffset = circumference * (1 - timerPercentage / 100);

  return (
    <Container>
      <Content>
        <InterviewerSection>
          <Logo>
            <img src={MainLogo} alt='Je myeon so Logo'/>
          </Logo>
          <InnerContainer>
          <InterviewerVideo>
            <img src={AiInterviewerGif} alt="AI Interviewer" />
            <QuestionText id='questionText' onClick={textToSpeech}>지원자 본인의 자기소개를 1분동안 해보세요.</QuestionText>
          </InterviewerVideo>
          </InnerContainer>
        </InterviewerSection>
        <ControlsSection>
          <TimerContainer>
            <svg width="170" height="170" viewBox="0 0 170 170">
              <circle cx="85" cy="85" r="80" fill="none" stroke="#EEEEEE" strokeWidth="10" />
              <circle cx="85" cy="85" r="80" fill="none" stroke="#6042ff" strokeWidth="10" strokeDasharray={circumference} strokeDashoffset={dashOffset} transform="rotate(-90 85 85)" />
              <text x="85" y="90" textAnchor="middle" dominantBaseline="middle" fontSize="34" fontWeight="bold" fill="#000">{formatTime(timer)}</text>
            </svg>
          </TimerContainer>
          <RecordButtonContainer>
            <RecordButton isRecording={isRecording} onClick={handleRecordToggle} disabled={recordingCount >= MAX_RECORDINGS}>
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"></path>
                <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                <line x1="12" y1="19" x2="12" y2="22"></line>
              </svg>
            </RecordButton>
          </RecordButtonContainer>
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

const InnerContainer = styled.div``;
const QuestionText = styled.p``;
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
  margin-top: 270px;
`;

const RecordButtonContainer = styled.div`
  margin-bottom: 270px;
  display: flex;
  justify-content: center;
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
