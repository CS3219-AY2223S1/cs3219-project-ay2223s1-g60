import React from 'react';
import { Button, Divider, Stack, Typography } from '@mui/material';

function CodingQuestion() {
  return (
    <Stack
      spacing={2}
      style={{
        width: '400px',
        padding: '1rem 2rem',
        justifyContent: 'space-between',
        maxHeight: '100%',
      }}
    >
      <Typography variant='h4'>Question Title</Typography>
      <Typography variant='subtitle1'>Difficulty</Typography>
      <Divider />
      <Typography style={{ flex: 1, overflow: 'scroll', paddingRight: '1rem' }}>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Mollitia
        voluptatibus officia cupiditate voluptatem nisi consectetur. Assumenda
        optio quis non, ad distinctio sed porro similique ipsam tempora ducimus
        deleniti atque. Deleniti? Lorem ipsum dolor sit amet consectetur
        adipisicing elit. Quibusdam incidunt sunt quod ad velit debitis a, quis,
        adipisci explicabo eveniet nostrum molestiae recusandae nesciunt veniam
        consectetur nihil tenetur mollitia beatae. Lorem ipsum dolor sit amet
        consectetur adipisicing elit. Ut aliquam unde veniam quam eum
        accusantium facilis maiores, laborum, voluptates magnam non atque,
        laudantium officia! Voluptatibus dolor harum delectus voluptates ex.
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Officiis eos
        cum optio nemo officia ullam eaque quisquam beatae unde ut, sint esse
        tempora incidunt laborum, voluptatum id possimus ipsam excepturi. Lorem
        ipsum dolor sit amet consectetur adipisicing elit. Esse excepturi optio
        consequuntur numquam natus delectus laborum? Placeat omnis eos
        dignissimos quia ducimus. Eius beatae quod sunt sit dolorem! Corrupti,
        cupiditate.
      </Typography>
      <Button variant='contained'>Next Question</Button>
    </Stack>
  );
}

export default CodingQuestion;
