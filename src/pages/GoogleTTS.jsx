"use client";

import React, { useState } from "react";
import styled from "styled-components";

const API_KEY = process.env.GOOGLE_API_KEY
const API_URL = `https://texttospeech.googleapis.com/v1/text:synthesize?key=${API_KEY}`;

const GoogleTTS = () => {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  const handleTextChange = (event) => {
    setText(event.target.value);
  };

  const synthesizeSpeech = async () => {
    if (!text) {
      alert("텍스트를 입력해주세요.");
      return;
    }
    setLoading(true);
  
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          input: { text },
          voice: { languageCode: "ko-KR", ssmlGender: "FEMALE" },
          audioConfig: { audioEncoding: "MP3" },
        }),
      });
  
      if (!response.ok) {
        throw new Error("Google TTS API 요청 실패");
      }
  
      const data = await response.json();
      const audioContent = data.audioContent;
      if (!audioContent) {
        throw new Error("오디오 변환 실패");
      }
  
      // Base64 -> Blob 변환
      const byteCharacters = atob(audioContent); // Base64를 바이너리 문자열로 변환
      const byteNumbers = new Array(byteCharacters.length).fill(0).map((_, i) => byteCharacters.charCodeAt(i)); 
      const byteArray = new Uint8Array(byteNumbers);
      const audioBlob = new Blob([byteArray], { type: "audio/mp3" });
  
      // window.URL 사용으로 수정
      const audioUrl = window.URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      audio.play();
    } catch (error) {
      console.error("TTS 변환 실패:", error);
      alert("음성 변환에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <Container>
      <Title>Google Speech API - TTS</Title>
      <TextInput
        type="text"
        placeholder="텍스트를 입력하세요..."
        value={text}
        onChange={handleTextChange}
      />
      <SpeakButton onClick={synthesizeSpeech} disabled={loading}>
        {loading ? "변환 중..." : "음성 변환하기"}
      </SpeakButton>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #f9f9f9;
  padding: 20px;
`;

const Title = styled.h1`
  font-size: 24px;
  margin-bottom: 20px;
`;

const TextInput = styled.input`
  width: 80%;
  max-width: 400px;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 5px;
  margin-bottom: 10px;
`;

const SpeakButton = styled.button`
  padding: 10px 20px;
  font-size: 16px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background 0.3s;

  &:hover {
    background-color: #0056b3;
  }

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

export default GoogleTTS;