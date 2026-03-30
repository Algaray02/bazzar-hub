import { useState } from "react";
import QRCode from "qrcode";

export function useQrCode() {
  const [qrState, setQrState] = useState({
    isOpen: false,
    type: "",
    code: "",
    dataUrl: "",
  });

  const generateQr = async (type, code) => {
    try {
      const dataUrl = await QRCode.toDataURL(code || "INVALID-CODE", {
        width: 400,
        margin: 2,
        color: {
          dark: "#000000",
          light: "#FFFFFF",
        },
      });
      setQrState({ isOpen: true, type, code, dataUrl });
    } catch (err) {
      console.error(err);
    }
  };

  const closeQr = () => {
    setQrState((prev) => ({ ...prev, isOpen: false }));
  };

  return { qrState, generateQr, closeQr };
}