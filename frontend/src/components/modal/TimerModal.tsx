import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Socket } from 'socket.io-client';
import useCountDown from '../hooks/useCountDown';

function TimerModal(props: { socket: Socket; seconds: number; room: string }) {
  const navigate = useNavigate();
  const { socket, seconds, room } = props;
  const currTime = useCountDown(seconds);

  useEffect(() => {
    console.log(room);
    if (currTime <= 0) {
      socket.emit('delete-room', { room: room });
      socket.disconnect();
      navigate('/match');
    }
  }, [currTime]);

  return <div>{currTime}</div>;
}

export default TimerModal;
