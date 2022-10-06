import React from 'react';
import { Box, Typography } from '@mui/material';
import { ChatModel } from '../../../models/ChatModel';

const ChatBubble = (props: { chat: ChatModel; isSelf: boolean }) => {
  const { chat, isSelf } = props;

  return (
    <Box
      sx={{
        backgroundColor: `${isSelf ? 'primary.main' : 'secondary.main'}`,
        borderRadius: '16px',
        width: 'fit-content',
        display: 'flex',
        alignSelf: `${isSelf ? 'flex-end' : 'flex-start'}`,
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
