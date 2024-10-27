// #5.0 user avatar
import { styled } from 'styled-components';
import { auth, db, storage } from '../firebase';
import { useEffect, useState } from 'react';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { updateProfile } from 'firebase/auth';
import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  where,
  writeBatch,
} from 'firebase/firestore';
import { ITweet } from '../components/timeline';
import Tweet from '../components/tweet';

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 20px;
`;
const AvatarUpload = styled.label`
  width: 80px;
  overflow: hidden;
  height: 80px;
  border-radius: 50%;
  background-color: #8876b3;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  svg {
    width: 50px;
  }
`;
const AvatarImg = styled.img`
  width: 100%;
`;
const AvatarInput = styled.input`
  display: none;
`;
const Name = styled.span`
  font-size: 22px;
`;

const Tweets = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const EditNameContainer = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 10px;
`;

const ChangeNameInput = styled.input`
  padding: 10px 20px;
  border-radius: 50px;
  border: none;
  width: 100%;
  font-size: 16px;
`;

const StyledButton = styled.button`
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  background-color: #8876b3;
  color: white;
  font-size: 16px;
  cursor: pointer;
  &:hover {
    background-color: #6d5a9d;
  }
  &:active {
    transform: scale(0.98);
  }
`;

const CancelButton = styled(StyledButton)`
  background-color: tomato;
  &:hover {
    background-color: #d32f2f;
  }
`;

export default function Profile() {
  const user = auth.currentUser;
  const [avatar, setAvatar] = useState(user?.photoURL);
  const [tweets, setTweets] = useState<ITweet[]>([]);
  const [name, setName] = useState(user?.displayName || '');
  const [editName, setEditName] = useState(false);
  const onAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (!user) return;
    if (files && files.length === 1) {
      const file = files[0];
      const locationRef = ref(storage, `avatars/${user?.uid}`);
      const result = await uploadBytes(locationRef, file);
      const avatarUrl = await getDownloadURL(result.ref);
      setAvatar(avatarUrl);
      await updateProfile(user, {
        photoURL: avatarUrl,
      });
    }
  };
  // #5.1 user timelines 사용자 트윗을 가져오는 함수
  const fetchTweets = async () => {
    const tweetQuery = query(
      collection(db, 'tweets'),
      // where에는 3개의 인자가 필요하며, 1번은 doc의 field, 2번은 연산자 3번은 원하는 조건
      // 데이터를 필터링하려면 firestore에 해당 정보를 주어야함. (브라우저 console창에서 설정창 링크)
      where('userId', '==', user?.uid),
      orderBy('createdAt', 'desc'),
      limit(25)
    );

    const snapshot = await getDocs(tweetQuery);
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
    setTweets(tweets);
  };
  useEffect(() => {
    fetchTweets();
  }, []);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };
  const toggleEditName = () => setEditName(!editName);
  const updateTweetsUsername = async (newUsername: string) => {
    const batch = writeBatch(db);
    const tweetQuery = query(
      collection(db, 'tweets'),
      where('userId', '==', user?.uid)
    );

    const snapshot = await getDocs(tweetQuery);
    snapshot.docs.forEach((doc) => {
      const tweetRef = doc.ref;
      batch.update(tweetRef, { username: newUsername });
    });
    await batch.commit(); // Firestore에 변경사항 커밋
  };

  const updateName = async () => {
    if (!user) return;
    await updateProfile(user, {
      displayName: name,
    });

    await updateTweetsUsername(name); // 유저네임 업데이트
    window.location.reload();
    setEditName(false); // 수정 모드 종료
  };

  return (
    <Wrapper>
      <AvatarUpload htmlFor="avatar">
        {avatar ? (
          <AvatarImg src={avatar} />
        ) : (
          <svg
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path d="M10 8a3 3 0 100-6 3 3 0 000 6zM3.465 14.493a1.23 1.23 0 00.41 1.412A9.957 9.957 0 0010 18c2.31 0 4.438-.784 6.131-2.1.43-.333.604-.903.408-1.41a7.002 7.002 0 00-13.074.003z" />
          </svg>
        )}
      </AvatarUpload>
      <AvatarInput
        onChange={onAvatarChange}
        id="avatar"
        type="file"
        accept="image/*"
      />
      <Name>{user?.displayName ? user.displayName : 'Anonymous'}</Name>
      {editName ? (
        <EditNameContainer>
          <ChangeNameInput
            type="text"
            placeholder="Enter Name"
            value={name}
            onChange={handleNameChange}
          />
          <StyledButton onClick={updateName}>Update</StyledButton>
          <CancelButton onClick={toggleEditName}>Cancel</CancelButton>
        </EditNameContainer>
      ) : (
        <StyledButton onClick={toggleEditName}>Change Name</StyledButton>
      )}

      <Tweets>
        {tweets.map((tweet) => (
          <Tweet key={tweet.id} {...tweet} />
        ))}
      </Tweets>
    </Wrapper>
  );
}
