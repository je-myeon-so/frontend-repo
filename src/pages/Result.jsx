// // 백엔드 API 연결
import React, {useState, useEffect} from 'react';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';
import MainLogo from '../assets/logo.png';
import {BsGrid} from 'react-icons/bs';
import {FaRegCommentDots, FaUser} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';


// 스타일 컴포넌트 정의

const Result = () => {

  // 에러 타입에 따른 색상 매핑
  const errorColors = {
    "필러 단어": "#FFF4B5", // 연한 노랑
    "전문성 부족": "#FFDDC1", // 연한 빨강 (코랄)
    "문법적 오류": "#B3D9FF", // 연한 파랑 (하늘색)
    "질문과 불일치": "#ead8ee", // 연한 분홍
    "발음 실수": "#ffb7b7", // 연한 주황
  };

  const location = useLocation();
  const userid = location.state?.username || "user2";

  const [feedbackData, setFeedbackData] = useState({analysis_result:{analysis:[]}, original_answer: "", question: ""});
  const [activeQuestion, setActiveQuestion] = useState(1);
  const [username, setUsername] = useState(userid);
  const [searchUser, setSearchUser] = useState("");

  const navigate = useNavigate();
 
   // 기본값 설정
  console.log('page load username:', userid);
  

  const getFeedbackData = async (user, questionnum) => {
    try {
      const response = await fetch(`http://3.35.220.161:8080/api/result/answer/${questionnum}/feedback?username=${user}`)
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          setFeedbackData(data);
        });
    } catch (error) {
      console.error('피드백 데이터를 가져오는 데 실패했습니다:', error);
    }
  };

  useEffect(() => {
    setActiveQuestion(1);
    getFeedbackData(username, 1);
  }, []);

  if (!feedbackData) {
    return <div>Loading...</div>;
  }

  // 원본 답변과 피드백 데이터 가져오기
  const { question, original_answer, analysis_result} = feedbackData;

  const highlightedAnswer = analysis_result.analysis.reduce((text, {error_text, error_type}) => {
    const color = errorColors[error_type] || "#FFC0C0"; // 기본 색상 (오렌지)
    const highlight = `<span style="background-color: ${color}; padding: 2px 4px; border-radius: 4px;">${error_text}</span>`;
    return text.replaceAll(error_text, highlight);
  }, original_answer);

  const handleSearch = () => {
    if (searchUser.trim() !== "") {
      setUsername(searchUser.trim());
      getFeedbackData(searchUser, 1);
    }
  };

  return (
    <PageContainer>
      <FlexContainer>
        {/* 사이드바 */}
        <Sidebar>
          <Logo
            onClick={() => navigate("/")}
          >
            <img src={MainLogo} alt="Je myeon so Logo"/>
          </Logo>
          <MenuContainer>
            <MenuItem
              active={activeQuestion === 1}
              onClick={() => {
                setActiveQuestion(1);
                getFeedbackData(username, 1);
              }}
            >
              {/*<MenuIcon active={activeQuestion === 1}><BsGrid size={18}/></MenuIcon>*/}
              <MenuText active={activeQuestion === 1}>1번 질문</MenuText>
            </MenuItem>
            <MenuItem
              active={activeQuestion === 2}
              onClick={() => {
                setActiveQuestion(2);
                getFeedbackData(username, 2);
              }}
            >
              {/*<MenuIcon active={activeQuestion === 2}><FaRegCommentDots size={18}/></MenuIcon>*/}
              <MenuText active={activeQuestion === 2}>2번 질문</MenuText>
            </MenuItem>
            <MenuItem
              active={activeQuestion === 3}
              onClick={() => {
                setActiveQuestion(3);
                getFeedbackData(username, 3);
              }}
            >
              {/*<MenuIcon active={activeQuestion === 3}><FaUser size={18}/></MenuIcon>*/}
              <MenuText active={activeQuestion === 3}>3번 질문</MenuText>
            </MenuItem>
          </MenuContainer>
        </Sidebar>

        <MainContent>
          {/* 사용자 검색 */}
          <SearchContainer>
            <div>
            <SearchInput
              type="text"
              value={searchUser}
              onChange={(e) => setSearchUser(e.target.value)}
              placeholder="사용자명을 입력하세요..."
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
            <SearchButton onClick={handleSearch}>검색</SearchButton>
            </div>

            <HomeButton onClick={() => navigate("/")}>🏠 홈으로</HomeButton>
          </SearchContainer>

          {/* 질문 */}
          <Title>{username} 님의 면접 결과</Title>
          <Title>Q. {question}</Title>

          {/* 사용자의 답변 */}
          <SectionTitle>답변</SectionTitle>
          <ContentWrapper dangerouslySetInnerHTML={{__html: highlightedAnswer}}/>

          {/* 피드백 */}
          <FeedbackContainer>
            <ErrorLegend>
              {Object.entries(errorColors).map(([type, color]) => (
                <LegendItem key={type}>
                  <LegendColor style={{ backgroundColor: color }} />
                  <LegendText>{type}</LegendText>
                </LegendItem>
              ))}
            </ErrorLegend>
            <FeedBackWrapper>

            <SectionTitle>피드백</SectionTitle>
            {analysis_result.analysis.map((item, index) => (
              <FeedbackItem key={index}>
                <ErrorText>- {item.error_text}</ErrorText>
                <Feedback>{item.feedback}</Feedback>
                <Suggestion>💡 {item.suggestion}</Suggestion>
              </FeedbackItem>
            ))}
            </FeedBackWrapper>
          </FeedbackContainer>
        </MainContent>
      </FlexContainer>
    </PageContainer>
  );
};

export default Result;


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
    transition: background-color 0.2s;
    background-color: ${props => props.active ? '#f0f0f5' : 'transparent'};

    &:hover {
        background-color: ${props => props.active ? '#f0f0f5' : '#f8f8f8'};
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
    margin-top: 1.5rem;
    margin-bottom: 1.5rem;
`;

const SectionTitle = styled.h2`
    font-size: 1.125rem;
    font-weight: bold;
    //margin-top: 2rem;
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

const FeedbackItem = styled.div`
    padding-left: 10px;
    margin-bottom: 15px;
`;


const ErrorText = styled.p`
    font-weight: bold;
    color: red;
`;

const Feedback = styled.p`
    color: #333;
`;

const Suggestion = styled.p`
    color: #2c7be5;
`;

const SearchContainer = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-end: 3rem;
    margin-bottom: 1rem;
`;

const SearchInput = styled.input`
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
`;

const SearchButton = styled.button`
  padding: 0.5rem 1rem;
  margin-left: 0.5rem;
  background-color: #4a72ff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;

  &:hover {
    background-color: #3b5ccc;
  }
`;

const FeedBackWrapper = styled.div`
    gap: 10px;
    margin-bottom: 1rem;
    padding: 10px;
    background-color: #f9f9f9;
    border-radius: 8px;
    border: 1px solid #ddd;
`;

const ErrorLegend = styled.div`
    display: flex;
    gap: 10px;
    padding: 10px;
    background-color: #FFFFFF;
    margin-bottom: 1rem;
    border-radius: 8px;
    //border: 1px solid #ddd;
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
`;

const LegendColor = styled.div`
  width: 16px;
  height: 16px;
  border-radius: 4px;
  margin-right: 8px;
`;

const LegendText = styled.span`
  font-size: 0.9rem;
  color: #333;
`;

const HomeButton = styled.button`
  padding: 0.5rem 1rem;
  margin-left: 0.5rem;
  background-color: #28a745; /* 녹색 */
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  
  &:hover {
    background-color: #218838;
  }
`;