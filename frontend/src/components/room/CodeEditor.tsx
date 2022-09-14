import React from 'react';
import { Stack, TextField, Typography } from '@mui/material';

function CodeEditor() {
  const codeEditorPlaceholder = '/* Insert your code here */';

  return (
    <Stack spacing={2}>
      <Typography variant={'h3'} marginBottom={'2rem'}>
        Code Editor
      </Typography>
      <TextField
        placeholder={codeEditorPlaceholder}
        multiline
        rows={20}
      ></TextField>
    </Stack>
  );
}

export default CodeEditor;
