import React from "react"
import { createRoot } from "react-dom/client"
import App from "./App"
import { ThirdwebProvider } from "thirdweb/react"
import "./index.css"

import { SocialTokenContextProvider } from "./context/context"
createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThirdwebProvider>
      <SocialTokenContextProvider>
        <div className="no-scrollbar">
          <App />
        </div>
      </SocialTokenContextProvider>
    </ThirdwebProvider>
  </React.StrictMode>,
)
