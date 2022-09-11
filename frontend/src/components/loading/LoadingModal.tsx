import React from "react";
import {Dialog, Stack, Box, Button, CircularProgress, DialogTitle} from "@mui/material";
import {io} from "socket.io-client";

type LoadingModalProps = {
    open: boolean;
    closeModal: () => void;
    difficulty: number;
}

const LoadingModal: React.FC<LoadingModalProps> = (props) => {
    const {open, closeModal, difficulty} = props;
    const socket = io("http://localhost:8001");

    // test variables
    const userId = 2;

    socket.on("connect", () => {
        console.log(`${socket.id} is trying to connect`);

        socket.emit("find-match", { userId, socketId: socket.id, difficulty })

        // timeout
        const countDown = setTimeout(() => {
            socket.disconnect();
            closeModal();
        }, 30000);

        // Server notifies client that a match is found
        socket.on("found-match", () => {
            console.log("found match!");
            clearTimeout(countDown);
            socket.disconnect();
            closeModal();
            // redirect to room page
        })
    });

    const cleanUp = () => {

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

                    <Button variant="contained" onClick={closeModal}>
                        Cancel
                    </Button>
                </Stack>
            </Box>
        </Dialog>
    );
}

export default LoadingModal;