import React, { useState, useEffect } from 'react';
import { Stack, TextField, Typography } from '@mui/material';
import { io } from 'socket.io-client';
import { URL_COLLABORATION_SVC } from '../../configs';

function CodeEditor() {
  const socket = io(URL_COLLABORATION_SVC);

  const [typedCode, setTypedCode] = useState('');

  const codeEditorPlaceholder = '/* Insert your code here */';

  const handleTyping = (e: React.KeyboardEvent<HTMLElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();

      const target = e.target as HTMLInputElement;

      const { value } = target;

      const startPos = target.selectionStart || 0;
      const endPos = target.selectionEnd || 0;
      const tab = '    ';

      target.value =
        value.substring(0, startPos) + tab + value.substring(endPos);

      target.selectionStart = startPos + tab.length;
      target.selectionEnd = startPos + tab.length;
    }
  };

  const handleChange = async (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTypedCode(e.target.value);
    socket.emit('typedCode', {
      text: e.target.value,
      socketId: socket.id,
    });
  };

  useEffect(() => {
    socket.on('typedCode', (data: { text: string; socketId: string }) => {
      if (data.socketId === socket.id) return;
      setTypedCode(data.text);
    });
  }, [socket, typedCode]);

  return (
    <Stack spacing={2}>
      <Typography variant={'h3'} marginBottom={'2rem'}>
        Code Editor
      </Typography>
      <TextField
        inputProps={{ style: { fontFamily: '"Roboto Mono"' } }}
        placeholder={codeEditorPlaceholder}
        value={typedCode}
        onChange={handleChange}
        multiline
        rows={20}
        onKeyDown={handleTyping}
      ></TextField>
    </Stack>
  );
}

export default CodeEditor;
