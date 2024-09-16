import { useEffect, useState } from "react";
import loading from "../../assets/512.gif";

export function Loading() {
  const [dots, setDots] = useState("");
  useEffect(() => {
    const interval = setInterval(
      () => setDots((dots) => (dots.length < 3 ? `${dots}.` : ".")),
      1000
    );
    return () => {
      clearInterval(interval);
    };
  }, []);
  return (
    <div>
      <img src={loading} alt="loading" />
      <div className="flex flex-col items-center md:flex-row md:justify-center md:text-xl">
        <p>Waiting for Server to Respond</p>
        <p className="w-7 text-start">{dots}</p>
      </div>
    </div>
  );
}
