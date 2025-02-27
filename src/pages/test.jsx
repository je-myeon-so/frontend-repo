import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import AiInterviewerGif from '../assets/AI_Interviewer.gif';
import MainLogo from '../assets/logo.png';
import { Link } from 'react-router-dom';

const Interview = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [timer, setTimer] = useState(180);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const timerIntervalRef = useRef(null);

  useEffect(() => {
    if (isRecording && timer > 0) {
      timerIntervalRef.current = setInterval(() => {
        setTimer((prevTime) => {
          if (prevTime <= 1) {
            handleRecordToggle();
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
      startRecording();
      setIsRecording(true);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const options = { mimeType: 'audio/webm;codecs=opus' };
      const recorder = new MediaRecorder(stream, options);
      const chunks = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.push(e.data);
        }
      };

      recorder.onstop = async () => {
        const audioBlob = new Blob(chunks, { type: recorder.mimeType });
        await uploadRecording(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      recorder.start();
      setMediaRecorder(recorder);
    } catch (error) {
      console.error('Error accessing microphone:', error);
      setIsRecording(false);
      alert('마이크 접근에 실패했습니다. 마이크 권한을 확인해주세요.');
    }
  };

  const uploadRecording = async (blob) => {
    const formData = new FormData();
    formData.append('file', blob, 'recording.webm');

    try {
      const response = await fetch('http://3.36.152.238:8080/upload', {
        method: 'POST',
        body: formData,
        mode: 'cors',
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
      });
      if (!response.ok) {
        throw new Error('서버 업로드 실패');
      }
      console.log('파일 업로드 성공');
    } catch (error) {
      console.error('파일 업로드 중 오류 발생:', error);
    }
  };

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
          <RecordButtonContainer>
            <RecordButton isRecording={isRecording} onClick={handleRecordToggle}>
              {isRecording ? '중지' : '녹음 시작'}
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

const ControlsSection = styled.div`
  width: 400px;
  flex:1;
  padding: 40px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const RecordButtonContainer = styled.div`
  display: flex;
  justify-content: center;
`;

const RecordButton = styled.button`
  width: 100px;
  height: 50px;
  background-color: ${props => props.isRecording ? '#ff4d4d' : '#6042ff'};
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 16px;
  cursor: pointer;
  transition: background 0.3s;
  &:hover {
    background-color: ${props => props.isRecording ? '#cc0000' : '#402cbf'};
  }
`;

export default Interview;
