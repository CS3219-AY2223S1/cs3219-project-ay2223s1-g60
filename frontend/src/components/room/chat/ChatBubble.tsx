import React from 'react';
import { Box, Typography } from '@mui/material';
import { grey } from '@mui/material/colors';
import { ChatModel } from './ChatModel.d';

const ChatBubble = (props: { chat: ChatModel; isSelf: boolean }) => {
  const { chat, isSelf } = props;

  return (
    <Box
      sx={{
        backgroundColor: `${isSelf ? 'transparent' : 'primary.main'}`,
        borderRadius: '16px',
        width: 'fit-content',
        display: 'flex',
        border: `${isSelf ? '1px solid' : 'none'}`,
        borderColor: isSelf ? grey[400] : 'none',
        alignSelf: `${isSelf ? 'flex-start' : 'flex-end'}`,
      }}
      paddingX={'1rem'}
      paddingY={'0.5rem'}
    >
      <Typography sx={{ textAlign: `${isSelf ? 'right' : 'left'}` }}>
        {chat.text}
      </Typography>
    </Box>
  );
};

export default ChatBubble;
