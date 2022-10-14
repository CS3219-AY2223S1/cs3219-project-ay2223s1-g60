import React, { useState } from 'react';
import {
  Button,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { Socket } from 'socket.io-client';
import * as monaco from 'monaco-editor';
import MonacoEditor from 'react-monaco-editor';
import TimerModal from '../modal/TimerModal';
import { useNavigate } from 'react-router-dom';

const MONACO_OPTIONS: monaco.editor.IEditorConstructionOptions = {
  autoIndent: 'full',
  quickSuggestions: true,
  quickSuggestionsDelay: 100,
  hideCursorInOverviewRuler: true,
  matchBrackets: 'always',
  wordWrap: 'on',
  wordWrapColumn: 80,
  codeLens: true,
  colorDecorators: true,
  minimap: {
    enabled: false,
  },
  scrollbar: {
    useShadows: false,
    verticalScrollbarSize: 4,
  },
  scrollBeyondLastLine: false,
};

function CodeEditor(props: {
  socket: Socket;
  roomSocket: Socket;
  room: string;
}) {
  const { socket, roomSocket, room } = props;
  const [typedCode, setTypedCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [editorOptions, setEditorOptions] = useState(MONACO_OPTIONS);

  const handleChange = (
    value: string,
    e: monaco.editor.IModelContentChangedEvent
  ) => {
    setTypedCode(value);
    socket.emit('typedCode', {
      text: value,
      socketId: socket.id,
      room: room,
    });
  };

  socket.on(
    'typedCode',
    (data: { text: string; socketId: string; room: string }) => {
      if (data.socketId === socket.id) return;
      setTypedCode(data.text);
    }
  );

  const navigate = useNavigate();
  const leaveRoom = () => {
    roomSocket.emit('delete-room', { room: room });
    roomSocket.disconnect();
    navigate('/match');
  };

  const SelectLanguages = () => (
    <FormControl sx={{ width: '200px' }} size='small'>
      <InputLabel>Language</InputLabel>
      <Select
        value={language}
        id='language'
        name='language'
        label='Language'
        onChange={(e) => setLanguage(e.target.value)}
      >
        {monaco.languages.getLanguages().map((language, i) => (
          <MenuItem value={language.id} key={i}>
            {language.id.charAt(0).toUpperCase().concat(language.id.slice(1))}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );

  return (
    <Stack
      spacing={2}
      sx={{
        flexGrow: '1',
        padding: '1rem',
        maxHeight: '100%',
        position: 'relative',
      }}
    >
      <Stack
        style={{
          width: '100%',
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}
      >
        <SelectLanguages />
        <TimerModal
          seconds={90}
          onTimeUp={() =>
            setEditorOptions({ ...MONACO_OPTIONS, readOnly: true })
          }
        />
      </Stack>
      <MonacoEditor
        language={language}
        value={typedCode}
        options={editorOptions}
        onChange={handleChange}
      />
      <Button
        variant='outlined'
        sx={{ width: 'max-content', alignSelf: 'flex-end' }}
        onClick={leaveRoom}
      >
        Leave room
      </Button>
    </Stack>
  );
}

export default CodeEditor;
