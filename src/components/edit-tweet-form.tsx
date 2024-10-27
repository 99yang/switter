import { useState } from 'react';
import styled from 'styled-components';
import { auth, db, storage } from '../firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from 'firebase/storage';

interface EditTweetFormProps {
  photo?: string;
  tweet: string;
  id: string;
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
}

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 20px;
  background-color: black;
  border: 2px solid white;
  border-radius: 20px;
  font-size: 16px;
  color: white;
  resize: none;
  &:focus {
    outline: none;
    border-color: #8876b3;
  }
`;

const AttachFileButton = styled.label`
  padding: 10px 0px;
  border: 1px solid currentColor;
  border-radius: 20px;
  font-weight: 600;
  font-size: 14px;
  color: #8876b3;
  text-align: center;
  cursor: pointer;
  &:active {
    transform: scale(0.98);
  }
`;

const AttachFileInput = styled.input`
  display: none;
`;

const SubmitBtn = styled.input`
  padding: 10px 0px;
  background-color: #8876b3;
  border: none;
  border-radius: 20px;
  font-size: 14px;
  color: white;
  cursor: pointer;
  &:hover,
  &:active {
    opacity: 0.9;
  }
  &:active {
    transform: scale(0.98);
  }
`;

export default function EditTweetForm({
  photo,
  tweet,
  id,
  setIsEditing,
}: EditTweetFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [editTweet, setEditTweet] = useState(tweet);
  const [editFile, setEditFile] = useState<File | null>(null);

  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditTweet(e.target.value);
  };

  const onEditFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (files && files.length === 1) {
      if (files[0].size > 1000000) {
        alert('The file is too large!');
        return;
      }
      setEditFile(files[0]);
    }
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const user = auth.currentUser;
    if (!user || isLoading || editTweet === '' || editTweet.length > 180)
      return;

    try {
      setIsLoading(true);
      const tweetRef = doc(db, 'tweets', id);

      // 1. Firestore에서 최신 유저 정보를 가져오기
      const userRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userRef);
      let updatedUsername = user.displayName; // 기본 유저네임
      if (userDoc.exists()) {
        updatedUsername = userDoc.data()?.displayName || updatedUsername;
      }

      // 2. 트윗 업데이트: 내용, 최신 유저네임
      await updateDoc(tweetRef, {
        tweet: editTweet,
        username: updatedUsername,
      });

      // 3. 새로운 파일을 업로드하고 기존 파일 삭제
      if (editFile) {
        if (photo) {
          const originRef = ref(storage, `tweets/${user.uid}/${id}`);
          await deleteObject(originRef);
        }
        const locationRef = ref(storage, `tweets/${user.uid}/${id}`);
        const result = await uploadBytes(locationRef, editFile);
        const url = await getDownloadURL(result.ref);
        await updateDoc(tweetRef, {
          photo: url,
        });
      }

      setEditTweet('');
      setEditFile(null);
      setIsEditing(false);
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form onSubmit={onSubmit}>
      <TextArea
        required
        rows={5}
        maxLength={180}
        onChange={onChange}
        value={editTweet}
      />
      <AttachFileButton htmlFor={`editFile${id}`}>
        {editFile ? 'Photo added ✅' : photo ? 'Change photo' : 'Add photo'}
      </AttachFileButton>
      <AttachFileInput
        onChange={onEditFileChange}
        id={`editFile${id}`}
        type="file"
        accept="image/*"
      />
      <SubmitBtn
        type="submit"
        value={isLoading ? 'Editing...' : 'Edit Tweet'}
      />
    </Form>
  );
}
