import React, { useState } from 'react';
import {
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
} from '@mui/material';
import { Socket } from 'socket.io-client';
import * as monaco from 'monaco-editor';
import MonacoEditor from 'react-monaco-editor';
import TimerModal from '../modal/TimerModal';

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
};

function CodeEditor(props: { socket: Socket; timer: Socket; room: string }) {
  const { socket, timer, room } = props;
  const [typedCode, setTypedCode] = useState('');
  const [language, setLanguage] = useState('javascript');

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

  return (
    <Stack
      spacing={2}
      sx={{ flexGrow: '1', padding: '1rem', maxHeight: '100%' }}
    >
      <Stack
        style={{
          width: '100%',
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}
      >
        <FormControl sx={{ width: '200px' }} size='small'>
          <InputLabel>Language</InputLabel>
          <Select
            value={language}
            labelId='language'
            id='language'
            label='Language'
            onChange={(e: SelectChangeEvent) => setLanguage(e.target.value)}
          >
            {monaco.languages
              .getLanguages()
              .map((language: monaco.languages.ILanguageExtensionPoint, i) => (
                <MenuItem value={language.id} key={i}>
                  {language.id
                    .substring(0, 1)
                    .toLocaleUpperCase()
                    .concat(language.id.substring(1))}
                </MenuItem>
              ))}
          </Select>
        </FormControl>
        <TimerModal seconds={90} />
      </Stack>
      <MonacoEditor
        width='100%'
        height='100%'
        language={language}
        theme='vs'
        value={typedCode}
        options={MONACO_OPTIONS}
        onChange={handleChange}
      />
    </Stack>
  );
}

export default CodeEditor;
