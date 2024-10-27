import {
  collection,
  limit,
  onSnapshot,
  orderBy,
  query,
} from 'firebase/firestore';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { db } from '../firebase';
import Tweet from './tweet';
import TweetPopup from './tweet-popup';
import { Unsubscribe } from 'firebase/auth';

export interface ITweet {
  id: string;
  photo?: string;
  tweet: string;
  userId: string;
  username: string;
  createdAt: number;
}

const Wrapper = styled.div`
  display: flex;
  gap: 10px;
  flex-direction: column;
  overflow-y: auto;
  &::-webkit-scrollbar {
    display: none;
  }
`;

export default function TimeLine() {
  const [tweets, setTweet] = useState<ITweet[]>([]);
  const [selectedTweet, setSelectedTweet] = useState<ITweet | null>(null); // 선택된 트윗 상태

  const handleTweetClick = (tweet: ITweet) => {
    setSelectedTweet(tweet); // 클릭된 트윗을 설정
  };

  const closePopup = () => {
    setSelectedTweet(null); // 팝업 닫기
  };

  useEffect(() => {
    let unsubscribe: Unsubscribe | null = null;
    const fetchTweets = async () => {
      const tweetsQuery = query(
        collection(db, 'tweets'),
        orderBy('createdAt', 'desc'),
        limit(25)
      );

      unsubscribe = await onSnapshot(tweetsQuery, (snapshot) => {
        const tweets = snapshot.docs.map((doc) => {
          const { tweet, createdAt, userId, username, photo } = doc.data();
          return {
            tweet,
            createdAt,
            userId,
            username: username || 'Unknown User',
            photo,
            id: doc.id,
          };
        });
        setTweet(tweets);
      });
    };
    fetchTweets();
    return () => {
      unsubscribe && unsubscribe();
    };
  }, []);

  return (
    <Wrapper>
      {tweets.map((tweet) => (
        <div key={tweet.id} onClick={() => handleTweetClick(tweet)}>
          <Tweet {...tweet} />
        </div>
      ))}

      {selectedTweet && (
        <TweetPopup tweet={selectedTweet} onClose={closePopup} />
      )}
    </Wrapper>
  );
}
