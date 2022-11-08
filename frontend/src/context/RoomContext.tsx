import React, { createContext, useState, useContext } from 'react';
import { Room, RoomModel } from '../@types/RoomContext';
import { useSnackbar } from './SnackbarContext';
import { useUser } from './UserContext';
import { ChatModel } from '../components/room/chat/ChatModel';
import {
  defaultQuestion,
  QuestionModel,
} from '../components/room/QuestionModel.d';
import { useSockets } from './SocketContext';
import { useNavigate } from 'react-router-dom';
import APIHistory from '../utils/api-history';
import APIRoom from '../utils/api-room';

export const defaultRoom: Room = {
  readOnly: false,
  code: '',
  language: '',
  chats: [],
  question: defaultQuestion,
  roomId: '',
};

export const defaultRoomModel: RoomModel = {
  user1: { user_id: '', username: '' },
  user2: { user_id: '', username: '' },
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
  const [question, setQuestion] = useState<QuestionModel>(defaultQuestion);

  const snackbar = useSnackbar();
  const user = useUser();
  const navigate = useNavigate();
  const { roomSocket, collabSocket } = useSockets();

  const saveHistory = () => {
    return APIRoom.getRoom(roomId)
      .then((resp) => {
        if (resp.status !== 201)
          throw new Error('Something went wrong when getting the room!');

        const room = resp.data;

        if (!user.user_id || !user.username) return;
        const history = {
          user1: { user_id: user.user_id, username: user.username },
          user2: room.user1.user_id == user.user_id ? room.user2 : room.user1,
          code: { code, language },
          question: question,
          roomId: roomId,
          chats: chats,
        };

        APIHistory.createHistory(history, user.user_id).then((resp) => {
          if (resp.status !== 201) throw new Error(resp.statusText);
          snackbar.setSuccess('History saved!');
          roomSocket.emit('delete-room', { room: roomId });
          collabSocket.emit('delete-room', { room: roomId });
          navigate('/match');
        });
      })
      .catch((err) => {
        snackbar.setError(err.toString());
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
