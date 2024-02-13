import { CheckCircle, Copy } from "lucide-react";
import { useEffect, useState } from "react";

export const CopyButton = ({text}: {text: string}) => {
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const copyText = () => {
    setIsCopied((c) => !c);
    navigator.clipboard.writeText(text);
  };
  useEffect(() => {
    if (isCopied) {
      let tmr = setTimeout(() => setIsCopied(false), 1 * 1000);
      return () => {
        clearTimeout(tmr);
      };
    }
  }, [isCopied]);

  const style = "w-5 h-5 cursor-pointer"
  if (isCopied) {
    return <CheckCircle className={style} />
  }
  return (
    <Copy onClick={copyText} className={style} />
  )
}