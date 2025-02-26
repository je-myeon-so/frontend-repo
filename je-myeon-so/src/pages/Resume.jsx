import React from 'react';
import styled from 'styled-components';

const Resume = () => {
  return (
    <Container>
      <LeftSection>
        <Title>Jemyeonso</Title>
        <Subtitle>"제대로 된 면접을 소개합니다"</Subtitle>
      </LeftSection>
      <RightSection>
        <AddButton>
          <PlusIcon>+</PlusIcon>
          <ButtonText>이력서(.pdf) 업로드</ButtonText>
        </AddButton>
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
  background-color: #F9F9F9;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 20px;
`;

const RightSection = styled.div`
  flex: 1;
  background-color: #FFFFFF;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Title = styled.h1`
  font-family: 'vitro';
  font-size: 48px;
  font-weight: 700;
  color: #6042FF;
`;

const Subtitle = styled.p`
  font-size: 18px;
  color: #5F5F5F;
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
  background-color: #6042FF;
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

export default Resume;
