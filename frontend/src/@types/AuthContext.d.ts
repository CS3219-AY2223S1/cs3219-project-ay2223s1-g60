import React from "react";

export type AuthContextType = {
    data: any;
    login: (username: string, password:string) => any;
};

export interface AuthContextProps {
    data: any;
    login: (username: string, password:string) => any;
}