import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // ✅ 페이지 이동을 위해 추가
import styled from 'styled-components';

const Resume = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('');
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate(); // ✅ 페이지 이동 함수

  function checkExistData(value, dataName) {
    if (value === "") {
      alert(dataName + " 입력해주세요");
      return false;
    }
    return true;
  }

  // 회원가입 (예제 코드)
  const handleSignUp = async () => {
    if (!checkExistData(username, "아이디를 ")) return;
    if (!checkExistData(password, "비밀번호를 ")) return;
  
    const requestData = { username, password };
  
    try {
      const response = await fetch("http://3.35.220.161:8080/api/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });
  
      if (!response.ok) {
       console.log(username);
        if (response.status === 400) {
          alert("가입 실패: 중복된 username");
        } else {
          setMessage("서버 오류 발생");
        }
        return;
      }
  
      console.log("가입 성공!");
      setMessage(`${username}님 환영합니다!`);
      window.sessionStorage.setItem(username, password);
    } catch (error) {
      console.error("Error:", error);
      setMessage("네트워크 오류 발생");
    }
  };

  // 파일 유형 PDF로 제한
  const handleFileChange = (event) => {
    const selectedfile = event.target.files[0];
    if (selectedfile && selectedfile.type === 'application/pdf') {
      setSelectedFile(selectedfile);
    } else {
      alert('PDF 파일만 업로드 가능합니다.');
      setSelectedFile(null);
    }
  };

  // 파일 업로드
  const handleUpload = async () => {
    if (!selectedFile) {
      alert('업로드할 PDF 파일을 선택해주세요.');
      return;
    }
  
    const formData = new FormData();
    formData.append('username', username); // 실제 사용자 이름을 동적으로 넣어야 함
    formData.append('file', selectedFile);
  
    try {
      setUploadStatus('업로드 중...');
  
      const response = await fetch("http://3.35.220.161:8080/api/upload/file", {
        method: 'POST',
        body: formData,
      });
  
      if (!response.ok) {
        throw new Error(`서버 응답 오류: ${response.status}`);
      }
  
      const data = await response.json();
      console.log('업로드 결과:', data);
  
      setUploadStatus(`업로드 완료! 질문: ${JSON.stringify(data.question)}, 답변: ${JSON.stringify(data.answer)}`);

      // 업로드 성공하면 "/interview" 페이지로 이동, 그 페이지로 username 전달
      navigate("/interview", {state: {username}});
      console.log('state username', username);
      
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
        <InputContainer>
        <UserIdInput 
          type='id' 
          placeholder='ID'
          value={username}
          onChange={(e) => setUsername(e.target.value)}/>
        <UserPwInput 
          type='password' 
          placeholder='PW'
          value={password}
          onChange={(e) => setPassword(e.target.value)}/>
        <SubmitBtn onClick={handleSignUp}>Sign In</SubmitBtn>
        {message && <Message success={message.includes("환영합니다")}>{message}</Message>}
        </InputContainer>
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

const Message = styled.p`

`;

const InputContainer = styled.div`

`;
const UserIdInput = styled.input`
  border: 1px gray solid;
  border-radius: 3px;
`;
const UserPwInput = styled.input`
  border: 1px gray solid;
  border-radius: 3px;
  margin-left: 10px;
`;

const SubmitBtn = styled.button`
  margin-left: 10px;
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
