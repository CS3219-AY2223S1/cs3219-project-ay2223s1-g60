import React, { useState } from 'react';
import {
  Button,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import * as monaco from 'monaco-editor';
import Editor from '@monaco-editor/react';
import TimerModal from '../modal/TimerModal';
import { useNavigate } from 'react-router-dom';
import MatchLeftDialog from '../modal/MatchLeftDialog';
import { useSockets } from '../../context/SocketContext';

const MONACO_OPTIONS: monaco.editor.IEditorConstructionOptions = {
  autoIndent: 'full',
  hideCursorInOverviewRuler: true,
  matchBrackets: 'always',
  wordWrap: 'on',
  wordWrapColumn: 80,
  codeLens: false,
  colorDecorators: true,
  minimap: {
    enabled: false,
  },
  suggest: {
    showFields: false,
    showFunctions: false,
  },
  quickSuggestions: false,
  scrollbar: {
    useShadows: false,
    verticalScrollbarSize: 4,
  },
  scrollBeyondLastLine: false,
  readOnly: false,
};

function CodeEditor(props: { room: string }) {
  const { collabSocket: socket, roomSocket } = useSockets();
  const { room } = props;

  const [typedCode, setTypedCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [editorOptions, setEditorOptions] = useState(MONACO_OPTIONS);
  const [openDialog, setOpenDialog] = useState(false);

  roomSocket.on('match-left', () => setOpenDialog(true));

  const navigate = useNavigate();
  const leaveRoom = () => {
    roomSocket.emit('delete-room', { room: room });
    navigate('/match');
  };

  const handleChange = (
    value: string | undefined,
    e: monaco.editor.IModelContentChangedEvent
  ) => {
    if (!value) return;
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
          extendSec={300}
          onTimeUp={() =>
            setEditorOptions({ ...MONACO_OPTIONS, readOnly: true })
          }
          onExtend={() =>
            roomSocket.emit('extend-time', { room, seconds: 300 })
          }
        />
      </Stack>
      <Editor
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
      <MatchLeftDialog open={openDialog} />
    </Stack>
  );
}

export default CodeEditor;
