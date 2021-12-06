import { useEffect, useState } from "react";

export default function RequireWeb3(
  Component: JSX.Element,
  shouldRenderAction: boolean = true
): JSX.Element {
  const [hasWeb3, setHasWeb3] = useState<Boolean>(false);

  useEffect(() => {
    // @ts-ignore
    setHasWeb3(!!window.ethereum);
  }, []);

  const requestConnection = async () => {
    // @ts-ignore next-block
    if (window.ethereum) {
      // @ts-ignore
      await window.ethereum.enable();
      setHasWeb3(true);
    }
  };

  if (!hasWeb3) {
    if (!shouldRenderAction) {
      return null;
    }

    return <button onClick={() => requestConnection()}>Login</button>;
  }

  return Component;
}
