import React, { useState, useEffect } from 'react';
import { Stack, TextField, Typography } from '@mui/material';
import { Socket } from 'socket.io-client';

type CodeEditorProps = {
  socket: Socket;
};

function CodeEditor(props: CodeEditorProps) {
  const { socket } = props;

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

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    socket.emit('typedCode', {
      text: e.target.value,
      socketId: socket.id,
    });
    setTypedCode(e.target.value);
  };

  useEffect(() => {
    socket.on('typedCode', (data: { text: string; socketId: string }) => {
      if (data.socketId === socket.id) return;
      console.log(data.text);
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
