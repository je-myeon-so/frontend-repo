// 백엔드 API 연결
// import React, { useState, useEffect } from 'react';
// import styled from 'styled-components';
// import MainLogo from '../assets/logo.png';
// import { BsGrid } from 'react-icons/bs';
// import { FaRegCommentDots, FaUser } from 'react-icons/fa';

// const Result = ({ sessionId, answerId }) => {
//   // API 데이터를 저장할 상태
//   const [feedbackData, setFeedbackData] = useState({
//     answer: { content: "" },
//     feedback: { analysisText: "" }
//   });

//   // API에서 데이터 가져오기
//   useEffect(() => {
//     const fetchFeedbackData = async () => {
//       try {
//         const response = await fetch(`/api/sessions/${sessionId}/answers/${answerId}/analysis`);
//         if (!response.ok) throw new Error("데이터를 가져오는 중 오류 발생");
        
//         const data = await response.json();
//         setFeedbackData({
//           answer: { content: data.answerText },  // 백엔드에서 받은 지원자 답변
//           feedback: { analysisText: data.analysisText }  // 백엔드에서 받은 분석 내용
//         });
//       } catch (error) {
//         console.error("API 호출 오류:", error);
//       }
//     };

//     fetchFeedbackData();
//   }, [sessionId, answerId]); // sessionId, answerId 변경 시 다시 호출

//   return (
//     <PageContainer>
//       <FlexContainer>
//         {/* 사이드바 */}
//         <Sidebar>
//           <Logo>
//             <img src={MainLogo} alt="Je myeon so Logo" />
//           </Logo>
//           <MenuContainer>
//             <MenuItem active={true}>
//               <MenuIcon active={true}><BsGrid size={18} /></MenuIcon>
//               <MenuText active={true}>1번</MenuText>
//             </MenuItem>
//             <MenuItem>
//               <MenuIcon><FaRegCommentDots size={18} /></MenuIcon>
//               <MenuText>2번</MenuText>
//             </MenuItem>
//             <MenuItem>
//               <MenuIcon><FaUser size={18} /></MenuIcon>
//               <MenuText>3번</MenuText>
//             </MenuItem>
//           </MenuContainer>
//         </Sidebar>

//         <MainContent>
//           {/* 질문 */}
//           <Title>Q. 지원자에 대한 1분 자기소개를 해주세요</Title>

//           {/* 사용자의 답변 */}
//           <SectionTitle>답변</SectionTitle>
//           <ContentWrapper>{feedbackData.answer.content || "답변을 불러오는 중..."}</ContentWrapper>

//           {/* 피드백 */}
//           <FeedbackContainer>
//             <SectionTitle>피드백</SectionTitle>
//             <FeedbackSentence>{feedbackData.answer.content || "답변을 불러오는 중..."}</FeedbackSentence>
//             <FeedbackText>{feedbackData.feedback.analysisText || "분석 데이터를 불러오는 중..."}</FeedbackText>
//           </FeedbackContainer>
//         </MainContent>
//       </FlexContainer>
//     </PageContainer>
//   );
// };

// export default Result;

// 스타일 컴포넌트 정의
// const PageContainer = styled.div`
//   min-height: 100vh;
//   background-color: #FFFFFF;
//   color: #333;
//   font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
// `;

// const FlexContainer = styled.div`
//   display: flex;
//   min-height: 100vh;
// `;

// const Sidebar = styled.div`
//   width: 240px;
//   background-color: #F9F9F9;
//   border-right: 1px solid #F9F9F9;
//   padding: 1rem 0.5rem;

//   @media (max-width: 768px) {
//     width: 60px;
//   }
// `;

// const Logo = styled.div`
//   position: absolute;
//   top: 35px;
//   left: 30px;
//   img {
//     height: 30px;
//   }
// `;

// const MenuContainer = styled.div`
//   margin-top: 70px;
// `;
// const MenuItem = styled.div`
//   display: flex;
//   align-items: center;
//   padding: 0.75rem 1rem;
//   border-radius: 8px;
//   margin-bottom: 0.5rem;
//   cursor: pointer;
//   transition: background-color 0.2s;
//   background-color: ${props => props.active ? '#f0f0f5' : 'transparent'};
  
//   &:hover {
//     background-color: ${props => props.active ? '#f0f0f5' : '#f8f8f8'};
//   }
// `;

// const MenuText = styled.span`
//   margin-left: 0.75rem;
//   font-weight: ${props => props.active ? '600' : '400'};
  
//   @media (max-width: 768px) {
//     display: none;
//   }
// `;

// const MenuIcon = styled.div`
//   color: ${props => props.active ? '#4a72ff' : '#777'};
// `;

// const MainContent = styled.div`
//   flex: 1;
//   padding: 1.5rem;
// `;

// const Title = styled.h1`
//   font-size: 1.25rem;
//   font-weight: 600;
//   margin-bottom: 1.5rem;
// `;

// const SectionTitle = styled.h2`
//   font-size: 1.125rem;
//   font-weight: bold;
//   margin-top: 2rem;
//   margin-bottom: 0.75rem;
// `;

// const ContentWrapper = styled.div`
//   background-color: white;
//   border: 1px solid;
//   border-color: #E6E8EC;
//   border-radius: 8px;
//   padding: 1.25rem;
//   margin-bottom: 1.5rem;
//   line-height: 200%;
//   box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
//   white-space: pre-line;
// `;

// const FeedbackContainer = styled.div`

// `;

// // 사용자의 답변 원본
// const FeedbackSentence = styled.div`
//   background-color: #f6f6f6;
//   border-radius: 8px;
//   padding: 1.25rem;
//   margin-bottom: 1.5rem;
//   line-height: 200%;
//   white-space: pre-line;
// `;

// // 사용자의 답변에 대한 피드백 (AI가 생성한)
// const FeedbackText = styled.div`
// `;

import React, { useState } from 'react';
import styled from 'styled-components';
import MainLogo from '../assets/logo.png';
import { BsGrid } from 'react-icons/bs';
import { FaRegCommentDots, FaUser } from 'react-icons/fa';

const Result = () => {
  // 하드코딩된 데이터
  const feedbackData = {
    answer: {
      content: `아, 안녕하세요...! 어... 저는... 풀, 풀스택 개발자로 성장하고 있는 지연우입니다.
      
어... 제가, 음... 사용자 경험을... 최우선으로 고려하면서, 프, 프론트엔드는 React를 쓰고... 어... 백엔드는 Node.js랑 Django를, 음... 활용해서
웹 애플리케이션을 개발, 해왔습니다. 어... 특히, 그... 아! BENTO! 네, BENTO라는 강의 요약 웹 서비스! 네, 그걸 기획하고, 음... 개발을 하면서, 음... 데이터 처리...와, 어... UI/UX 최적화가... 음... 되게, 되게 중요하구나, 하고 느꼈어요.

그리고, 어... 또... xv6! 네! xv6 운영체제 개조 프로젝트를 하면서,
시스템 프로그래밍에 대한, 어... 그... 개념? 이해? 그런 점... 조금 더 넓었던 것 같고요...!

어... 저는, 어... 음... 그... 사용자의 문제를... 기술로 해결하는 거에... 음... 보람을 느끼고...! 어... 새로운 기술도... 음... 빠르게 익히고, 적용하는... 음...
역량... ? 네, 그게, 좀... 있다고 생각합니다. 그래서, 어... 앞으로, 팀과 함께, 음... 성장하면서, 좋은, 아니, 가치 있는...! 그런 서비스를 만들어가고 싶습니다. 어... 아, 네..! 감사합니다...!`
    },
    feedback: {
      answerText: `“ 그리고, 어... 또... xv6! 네! xv6 운영체제 개조 프로젝트를 하면서, 시스템 프로그래밍에 대한, 어... 그... 개념? 이해? 그런 걸... 조금 더 넓혔던 것 같고요...!”`,
      analysisText: `답변에서 자신감 있는 어조와 풍부한 경험 설명이 돋보입니다. 핵심 포인트를 잘 강조했으며, 다만 결론 부분에서 조금 더 명확한 정리가 필요합니다. 전반적으로 잘 구성된 답변입니다.`
    }
  };

  return (
    <PageContainer>
      <FlexContainer>
        {/* 사이드바 */}
        <Sidebar>
          <Logo>
            <img src={MainLogo} alt="Je myeon so Logo" />
          </Logo>
          <MenuContainer>
            <MenuItem active={true}>
              <MenuIcon active={true}><BsGrid size={18} /></MenuIcon>
              <MenuText active={true}>1번</MenuText>
            </MenuItem>
            <MenuItem>
              <MenuIcon><FaRegCommentDots size={18} /></MenuIcon>
              <MenuText>2번</MenuText>
            </MenuItem>
            <MenuItem>
              <MenuIcon><FaUser size={18} /></MenuIcon>
              <MenuText>3번</MenuText>
            </MenuItem>
          </MenuContainer>
        </Sidebar>

        <MainContent>
          {/* 질문 */}
          <Title>Q. 지원자에 대한 1분 자기소개를 해주세요</Title>

          {/* 사용자의 답변 */}
          <SectionTitle>답변</SectionTitle>
          <ContentWrapper>{feedbackData.answer.content}</ContentWrapper>

          {/* 피드백 */}
          <FeedbackContainer>
            <SectionTitle>피드백</SectionTitle>
            <FeedbackSentence>{feedbackData.feedback.answerText}</FeedbackSentence>
            <FeedbackText>{feedbackData.feedback.analysisText}</FeedbackText>
          </FeedbackContainer>
        </MainContent>
      </FlexContainer>
    </PageContainer>
  );
};

export default Result;

///스타일 컴포넌트 정의
const PageContainer = styled.div`
  min-height: 100vh;
  background-color: #FFFFFF;
  color: #333;
  font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
`;

const FlexContainer = styled.div`
  display: flex;
  min-height: 100vh;
`;

const Sidebar = styled.div`
  width: 240px;
  background-color: #F9F9F9;
  border-right: 1px solid #F9F9F9;
  padding: 1rem 0.5rem;

  @media (max-width: 768px) {
    width: 60px;
  }
`;

const Logo = styled.div`
  position: absolute;
  top: 35px;
  left: 30px;
  img {
    height: 30px;
  }
`;

const MenuContainer = styled.div`
  margin-top: 70px;
`;
const MenuItem = styled.div`
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  margin-bottom: 0.5rem;
  cursor: pointer;
  transition: background-color 0.2s, color 0.2s;
  
  background-color: ${({ active }) => (active ? '#f0f0f5' : 'transparent')};

  &:hover {
    background-color: #f0f0f5 !important;
  }
`;

const MenuText = styled.span`
  margin-left: 0.75rem;
  font-weight: ${props => props.active ? '600' : '400'};
  
  @media (max-width: 768px) {
    display: none;
  }
`;

const MenuIcon = styled.div`
  color: ${props => props.active ? '#4a72ff' : '#777'};
`;

const MainContent = styled.div`
  flex: 1;
  padding: 1.5rem;
`;

const Title = styled.h1`
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.125rem;
  font-weight: bold;
  margin-top: 2rem;
  margin-bottom: 0.75rem;
`;

const ContentWrapper = styled.div`
  background-color: white;
  border: 1px solid;
  border-color: #E6E8EC;
  border-radius: 8px;
  padding: 1.25rem;
  margin-bottom: 1.5rem;
  line-height: 200%;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  white-space: pre-line;
`;

const FeedbackContainer = styled.div`

`;

// 사용자의 답변 원본
const FeedbackSentence = styled.div`
  background-color: #f6f6f6;
  border-radius: 8px;
  padding: 1.25rem;
  margin-bottom: 1.5rem;
  line-height: 200%;
  white-space: pre-line;
`;

// 사용자의 답변에 대한 피드백 (AI가 생성한)
const FeedbackText = styled.div`
`;
