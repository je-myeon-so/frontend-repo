import React, { useState } from 'react';
import styled from 'styled-components';

const Resume = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('');

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type === 'application/pdf') {
      setSelectedFile(file);
    } else {
      alert('PDF 파일만 업로드 가능합니다.');
      setSelectedFile(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert('업로드할 PDF 파일을 선택해주세요.');
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      setUploadStatus('업로드 중...');
      //TO-DO: AI 서버 만들면 URL 바꾸기
      const response = await fetch('https://your-ai-server.com/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      setUploadStatus(`업로드 완료: ${data.message}`);
    } catch (error) {
      console.error('업로드 실패:', error);
      setUploadStatus('업로드 실패. 다시 시도해주세요.');
    }
  };

  return (
    <Container>
      <LeftSection>
        <Title>Jemyeonso</Title>
        <Subtitle>"제대로 된 면접을 소개합니다"</Subtitle>
      </LeftSection>
      <RightSection>
        <input
          type="file"
          accept="application/pdf"
          onChange={handleFileChange}
          style={{ display: 'none' }}
          id="file-upload"
        />
        <AddButton onClick={() => document.getElementById('file-upload').click()}>
          <PlusIcon>+</PlusIcon>
          <ButtonText>이력서(.pdf) 업로드</ButtonText>
        </AddButton>
        {selectedFile && <FileName>{selectedFile.name}</FileName>}
        {selectedFile && <UploadButton onClick={handleUpload}>업로드</UploadButton>}
        {uploadStatus && <UploadStatus>{uploadStatus}</UploadStatus>}
      </RightSection>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  width: 100vw;
  height: 100vh;
`;

const LeftSection = styled.div`
  flex: 2;
  background-color: #f9f9f9;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 20px;
`;

const RightSection = styled.div`
  flex: 1;
  background-color: #ffffff;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 10px;
`;

const Title = styled.h1`
  font-family: 'vitro';
  font-size: 48px;
  font-weight: 700;
  color: #6042ff;
`;

const Subtitle = styled.p`
  font-size: 18px;
  color: #5f5f5f;
  margin-top: 10px;
`;

const AddButton = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
`;

const PlusIcon = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background-color: #6042ff;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 40px;
  margin-bottom: 10px;
  transition: background-color 0.3s;

  &:hover {
    background-color: #4f35d8;
  }
`;

const ButtonText = styled.p`
  font-size: 14px;
  color: #666;
`;

const FileName = styled.p`
  font-size: 14px;
  color: #333;
  margin-top: 10px;
`;

const UploadButton = styled.button`
  padding: 10px 20px;
  background-color: #6042ff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #4f35d8;
  }
`;

const UploadStatus = styled.p`
  font-size: 14px;
  color: #666;
  margin-top: 10px;
`;

export default Resume;
