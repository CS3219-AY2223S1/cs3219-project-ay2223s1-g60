import React from 'react';
import { Stack, TextField, Typography } from '@mui/material';

function CodeEditor() {
  const codeEditorPlaceholder = '/* Insert your code here */';

  const handleTyping = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();

      const { value } = e.target;

      const startPos = e.target.selectionStart || 0;
      const endPos = e.target.selectionEnd || 0;
      const tab = '    ';

      e.target.value =
        value.substring(0, startPos) + tab + value.substring(endPos);

      e.target.selectionStart = startPos + tab.length;
      e.target.selectionEnd = startPos + tab.length;
    }
  };

  return (
    <Stack spacing={2}>
      <Typography variant={'h3'} marginBottom={'2rem'}>
        Code Editor
      </Typography>
      <TextField
        inputProps={{ style: { fontFamily: '"Roboto Mono"' } }}
        placeholder={codeEditorPlaceholder}
        multiline
        rows={20}
        onKeyDown={handleTyping}
      ></TextField>
    </Stack>
  );
}

export default CodeEditor;
