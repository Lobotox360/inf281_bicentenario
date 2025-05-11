"use client";
import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";

export default function Scanner({ onScanSuccess }) {
  const qrRef = useRef(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const scanner = new Html5Qrcode("qr-reader");

    scanner.start(
      { facingMode: "environment" },
      {
        fps: 10,
        qrbox: { width: 250, height: 250 },
      },
      (decodedText) => {
        scanner.stop().then(() => {
          onScanSuccess(decodedText);
        });
      },
      (scanError) => {
        // Puedes loguearlo si quieres
      }
    ).catch((err) => {
      setError("Error al iniciar el escáner: " + err);
    });

    return () => {
      scanner.stop().catch(() => {});
    };
  }, [onScanSuccess]);

  return (
    <div>
      <div id="qr-reader" ref={qrRef} style={{ width: "100%" }}></div>
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
}
