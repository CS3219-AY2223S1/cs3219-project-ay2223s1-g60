import React, { useState } from 'react';
import {
  Button,
  CircularProgress,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import * as monaco from 'monaco-editor';
import Editor from '@monaco-editor/react';
import TimerModal from '../modal/TimerModal';
import MatchLeftDialog from '../modal/MatchLeftDialog';
import { useSockets } from '../../context/SocketContext';
import { useRoom } from '../../context/RoomContext';

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

function CodeEditor() {
  const { collabSocket: socket, roomSocket } = useSockets();
  const {
    room: { roomId, language, code, readOnly },
    setCode,
    setLanguage,
    saveHistory,
  } = useRoom();

  const [editorOptions, setEditorOptions] = useState({
    ...MONACO_OPTIONS,
  });
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(false);

  roomSocket.on('match-left', () => setOpenDialog(true));

  const leaveRoom = () => {
    setLoading(true);
    saveHistory();
  };

  const handleChange = (
    value: string | undefined,
    e: monaco.editor.IModelContentChangedEvent
  ) => {
    if (!value) return;
    setCode(value);
    socket.emit('typedCode', {
      text: value,
      socketId: socket.id,
      room: roomId,
    });
  };

  socket.on(
    'typedCode',
    (data: { text: string; socketId: string; room: string }) => {
      if (data.socketId === socket.id) return;
      setCode(data.text);
    }
  );

  socket.on('set-language', ({ language }) => setLanguage(language));

  const SelectLanguages = () => (
    <FormControl sx={{ width: '200px' }} size='small'>
      <InputLabel>Language</InputLabel>
      <Select
        value={language}
        id='language'
        name='language'
        label='Language'
        disabled={readOnly}
        onChange={(e) =>
          socket.emit('set-language', {
            language: e.target.value,
            room: roomId,
          })
        }
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
        {!readOnly && (
          <TimerModal
            extendSec={300}
            onTimeUp={() =>
              setEditorOptions({ ...MONACO_OPTIONS, readOnly: true })
            }
            onExtend={() =>
              roomSocket.emit('extend-time', { room: roomId, seconds: 300 })
            }
          />
        )}
      </Stack>
      <Editor
        language={language}
        value={code}
        options={{ ...editorOptions, readOnly: readOnly }}
        onChange={handleChange}
      />
      {!readOnly && (
        <>
          <Button
            variant='outlined'
            sx={{ width: 'max-content', alignSelf: 'flex-end' }}
            onClick={leaveRoom}
          >
            {loading && <CircularProgress size={18} sx={{ mr: 1 }} />}
            Leave room
          </Button>
        </>
      )}

      <MatchLeftDialog open={openDialog} />
    </Stack>
  );
}

export default CodeEditor;
