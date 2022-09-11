import React from "react";
import {Dialog, Stack, Box, Button, CircularProgress, DialogTitle} from "@mui/material";
import {io} from "socket.io-client";

type LoadingModalProps = {
    open: boolean;
    closeModal: () => void;
    userId: number;
    difficulty: number;
}

const LoadingModal: React.FC<LoadingModalProps> = (props) => {
    const {open, closeModal, difficulty, userId} = props;
    const socket = io("http://localhost:8001");

    // timeout
    const startCountDown = () => setTimeout(() => {
        socket.disconnect();
        closeModal();
    }, 30000);

    socket.on("connect", () => {
        console.log(`${socket.id} is trying to connect`);

        socket.emit("find-match", { userId, socketId: socket.id, difficulty })
        startCountDown();

        // Server notifies client that a match is found
        socket.on("found-match", () => {
            console.log("found match!");
            clearTimeout(startCountDown());
            socket.disconnect();
            closeModal();
            //TODO: redirect to room page
        })
    });

    const cleanUp = () => {
        clearTimeout(startCountDown());
        socket.disconnect();
        closeModal();
    }

    return (
        <Dialog
            open={open}
        >
            <DialogTitle>
                Finding match...
            </DialogTitle>

            <Box sx={{ width: 400, height: 180 }}>
                <Stack sx={{ height: "100%" }} justifyContent="space-around" alignItems="center">
                    <CircularProgress size={60} />

                    <Button variant="contained" onClick={cleanUp}>
                        Cancel
                    </Button>
                </Stack>
            </Box>
        </Dialog>
    );
}

export default LoadingModal;