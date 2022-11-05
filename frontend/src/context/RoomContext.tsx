import React, { createContext, useState, useContext, useEffect } from 'react';
import { Room, RoomModel } from '../@types/RoomContext';
import { URL_HISTORY_SVC, URI_ROOM_SVC } from '../configs';
import { useSnackbar } from './SnackbarContext';
import { requests } from '../utils/api-request';
import { getTokens, useUser } from './UserContext';
import { ChatModel } from '../components/room/chat/ChatModel';
import {
  defaultQuestion,
  QuestionModel,
} from '../components/room/QuestionModel.d';
import { useSockets } from './SocketContext';
import { useNavigate } from 'react-router-dom';

export const defaultRoom: Room = {
  readOnly: false,
  code: '',
  language: '',
  chats: [],
  question: defaultQuestion,
  roomId: '',
};

export const defaultRoomModel: RoomModel = {
  user1: '',
  user2: '',
  difficulty: '',
  sessionInfo: {},
  question: {},
};

const RoomContext = createContext({
  room: defaultRoom,
  saveHistory: () => {},
  setCode: (code: string) => {},
  setLanguage: (language: string) => {},
  appendChat: (chat: ChatModel) => {},
  setChats: (chats: ChatModel[]) => {},
  setRoomId: (roomId: string) => {},
  setQuestion: (question: QuestionModel) => {},
  setReadOnly: (readOnly: boolean) => {},
});

export function RoomProvider({ children }: { children: React.ReactNode }) {
  const [readOnly, setReadOnly] = useState(false);
  const [code, setCode] = useState<string>('');
  const [language, setLanguage] = useState<string>('');
  const [roomId, setRoomId] = useState<string>('');
  const [chats, setChats] = useState<ChatModel[]>([]);
  const [room, setRoom] = useState<RoomModel>(defaultRoomModel);
  const [question, setQuestion] = useState<QuestionModel>(defaultQuestion);

  const snackbar = useSnackbar();
  const user = useUser();
  const navigate = useNavigate();
  const { roomSocket } = useSockets();
  const { token } = getTokens();

  const getRoom = async () => {
    return requests
      .get(URI_ROOM_SVC, `/?roomId=${roomId}`)
      .then((resp) => {
        if (resp.status !== 201)
          throw new Error('Something went wrong when getting the room!');
        setRoom(resp.data);
        return resp.data;
      })
      .catch((err) => {
        snackbar.setError(err.toString());
      });
  };

  const saveHistory = async () => {
    return getRoom().then((room) => {
      let headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      };
      const body = {
        username1: user.username,
        username2: room.user1 == user.username ? room.user2 : room.user1,
        code: { code, language },
        question: question,
        roomId: roomId,
        chats: chats,
      };
      return requests
        .postWithHeaders(URL_HISTORY_SVC, `/${user.username}`, body, {
          headers,
        })
        .then((resp) => {
          if (resp.status !== 201) throw new Error(resp.statusText);
          snackbar.setSuccess('History saved!');
          roomSocket.emit('delete-room', { room: roomId });
          navigate('/match');
        })
        .catch((err) => {
          snackbar.setError(err.toString());
        });
    });
  };

  const appendChat = (chat: ChatModel) => setChats([...chats, chat]);

  return (
    <RoomContext.Provider
      value={{
        room: {
          readOnly,
          question,
          code,
          language,
          roomId,
          chats,
        },
        saveHistory,
        setCode,
        setLanguage,
        setQuestion,
        setChats,
        appendChat,
        setRoomId,
        setReadOnly,
      }}
    >
      {children}
    </RoomContext.Provider>
  );
}

const useRoom = () => useContext(RoomContext);

export { useRoom };
