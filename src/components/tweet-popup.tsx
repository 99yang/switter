import React from 'react';
import styled from 'styled-components';

const PopupOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const PopupScreen = styled.div`
  background: black;
  padding: 20px;
  border: 2px solid #8876b3;
  border-radius: 8px;
  width: 70%; /* 원하는 너비 설정 */
  max-width: 600px; /* 최대 너비 설정 */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  height: 90%;
  display: flex;
  flex-direction: column;
  justify-content: space-between; /* 요소 간의 간격 조정 */
`;

const TweetUsername = styled.div`
  color: white;
  padding-bottom: 10px; /* 간격 조정 */
`;

const TweetSpace = styled.div`
  color: white;
  border: 2px solid #9b92b3;
  border-radius: 8px;
  height: 100%;
  padding: 15px; /* 상하좌우 공백 추가 */
  margin-bottom: 20px; /* 다른 요소와의 간격 조정 */
`;

const TweetDate = styled.div`
  color: grey;
  padding-bottom: 20px; /* 간격 조정 */
`;

const CloseButton = styled.button`
  background: #8876b3;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 10px;
  cursor: pointer;
  margin-top: 20px; /* 아래쪽 여백 */
`;

const TweetImage = styled.img`
  width: 100%; /* 전체 너비에 맞춤 */
  height: auto; /* 비율에 맞춰 높이 자동 조절 */
  max-height: 400px; /* 최대 높이 설정 (필요에 따라 조절 가능) */
  object-fit: cover; /* 이미지 비율에 맞게 잘라내기 */
  border-radius: 5px; /* 모서리 둥글게 */
  margin: 20px 0; /* 위아래 여백 */
`;

interface TweetPopupProps {
  tweet: { tweet: string; username: string; createdAt: number; photo?: string };
  onClose: () => void;
}

const TweetPopup: React.FC<TweetPopupProps> = ({ tweet, onClose }) => {
  return (
    <PopupOverlay>
      <PopupScreen>
        <TweetUsername>{tweet.username}</TweetUsername>
        {tweet.photo && <TweetImage src={tweet.photo} alt="Tweet" />}
        <TweetSpace>{tweet.tweet}</TweetSpace>
        <TweetDate>{new Date(tweet.createdAt).toLocaleString()}</TweetDate>
        <CloseButton onClick={onClose}>닫기</CloseButton>
      </PopupScreen>
    </PopupOverlay>
  );
};

export default TweetPopup;
