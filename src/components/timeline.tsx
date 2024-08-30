import { collection, doc, getDocs, orderBy, query } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { db } from '../firebase';
import Tweet from './tweet';

export interface ITweet {
  id: string;
  //   photo는 필수값 아님
  photo?: string;
  tweet: string;
  userId: string;
  username: string;
  createdAt: number;
}

const Wrapper = styled.div``;

export default function TimeLine() {
  const [tweets, setTweet] = useState<ITweet>([]);
  //   tweet 불러오기
  const fetchTweets = async () => {
    // query 생성
    const tweetsQuery = query(
      collection(db, 'tweets'),
      //   최신순, 내림차순
      orderBy('createdAt', 'desc')
    );
    // query에 해당하는 문서 가져오기
    const snapshot = await getDocs(tweetsQuery);
    const tweets = snapshot.docs.map((doc) => {
      const { tweet, createdAt, userId, username, photo } = doc.data();
      return {
        tweet,
        createdAt,
        userId,
        username,
        photo,
        id: doc.id,
      };
    });
    setTweet(tweets);
  };
  useEffect(() => {
    fetchTweets();
  }, []);
  return (
    <Wrapper>
      {tweets.map((tweet) => (
        <Tweet key={tweet.id} {...tweet} />
      ))}
    </Wrapper>
  );
}
