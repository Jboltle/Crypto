// useApiWebsocket.ts
import { useState } from "react";

const  keyValues = () => {
  const [api, setApi] = useState("");
  const [websocket, setWebSocket] = useState("");
  const [isLoaded, setLoaded] = useState(false);

  const handleApiChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setApi(`https://frequent-soft-thunder.solana-mainnet.quiknode.pro/${event.target.value}`);
  };

  const handleWebsocketChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setWebSocket(`wss://frequent-soft-thunder.solana-mainnet.quiknode.pro/${event.target.value}`);
  };

  return {
    api,
    websocket,
    isLoaded,
    setLoaded,
    handleApiChange,
    handleWebsocketChange
  };
};

export default keyValues;

