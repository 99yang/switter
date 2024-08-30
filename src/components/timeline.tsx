import {
  collection,
  doc,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
} from 'firebase/firestore';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { db } from '../firebase';
import Tweet from './tweet';
import { Unsubscribe } from 'firebase/auth';

export interface ITweet {
  id: string;
  //   photo는 필수값 아님
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
`;

export default function TimeLine() {
  const [tweets, setTweet] = useState<ITweet>([]);
  //   tweet 불러오기

  useEffect(() => {
    let unsubscribe: Unsubscribe | null = null;
    const fetchTweets = async () => {
      // query 생성
      const tweetsQuery = query(
        collection(db, 'tweets'),
        // 최신순, 내림차순
        orderBy('createdAt', 'desc'),
        // 비용절약
        limit(25)
      );
      // query에 해당하는 문서 가져오기
      // const snapshot = await getDocs(tweetsQuery);
      // const tweets = snapshot.docs.map((doc) => {
      //   const { tweet, createdAt, userId, username, photo } = doc.data();
      //   return {
      //     tweet,
      //     createdAt,
      //     userId,
      //     username,
      //     photo,
      //     id: doc.id,
      //   };
      // });

      // getDocs 대신 onSnapshot 사용하기
      // 문서를 한번만 가져오는 대신 쿼리에 리스너 추가, 생성 편집 삭제등 변경시 필요한 데이터 추출해 map배열로 만듦
      // onSnapshot() = 이벤트리스너 연결
      unsubscribe = await onSnapshot(tweetsQuery, (snapshot) => {
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
      });
    };
    fetchTweets();
    return () => {
      // useEffect hook teardown cleanup, 다른화면일때 이벤트 리스너x
      unsubscribe && unsubscribe();
    };
  }, []);
  return (
    <Wrapper>
      {tweets.map((tweet) => (
        <Tweet key={tweet.id} {...tweet} />
      ))}
    </Wrapper>
  );
}
