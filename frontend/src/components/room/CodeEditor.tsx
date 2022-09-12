import React from 'react';
import { Box, Stack, TextField, Typography } from '@mui/material';

function CodeEditor() {
  const codeEditorPlaceholder = '/* Insert your code here */';

  return (
    <Box display={'flex'} flexDirection={'column'} padding={'4rem'}>
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
    </Box>
  );
}

export default CodeEditor;
