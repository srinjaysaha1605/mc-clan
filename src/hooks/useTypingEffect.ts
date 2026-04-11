import { useState, useEffect } from "react";

export const useTypingEffect = (text: string, speed: number = 20, start: boolean = true) => {
  const [displayedText, setDisplayedText] = useState("");
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    if (!start) return;
    
    let index = 0;
    setDisplayedText("");
    setIsFinished(false);

    const interval = setInterval(() => {
      if (index < text.length) {
        setDisplayedText((prev) => prev + text.charAt(index));
        index++;
      } else {
        setIsFinished(true);
        clearInterval(interval);
      }
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed, start]);

  return { displayedText, isFinished };
};
