import { useEffect } from "react";

const PaymanConnect = () => {
  useEffect(() => {
    // Check if the script is already added to prevent duplicates
    if (document.querySelector('script[src="https://app.paymanai.com/js/pm.js"]')) {
      return;
    }

    const script = document.createElement("script");
    script.src = "https://app.paymanai.com/js/pm.js";
    script.dataset.clientId = import.meta.env.VITE_PAYMAN_CLIENT_ID;
    script.dataset.scopes = "read_balance,read_list_payees,read_list_transactions,write_create_payee,write_send_payment";
    
    // Use the correct redirect URI for the current environment
    const redirectUri = window.location.origin.includes('localhost')
      ? 'http://localhost:5173/oauth-callback'
      : 'https://giftagent.vercel.app/oauth-callback';
      
    script.dataset.redirectUri = redirectUri;
    script.dataset.target = "#payman-connect";
    script.dataset.darkMode = "false";
    script.dataset.styles = JSON.stringify({ borderRadius: "8px", fontSize: "14px" });
    script.async = true;

    document.body.appendChild(script);

    return () => {
      // Clean up the script when the component unmounts
      const existingScript = document.querySelector('script[src="https://app.paymanai.com/js/pm.js"]');
      if (existingScript) {
        document.body.removeChild(existingScript);
      }
    };
  }, []);

  return <div id="payman-connect"></div>;
};

export default PaymanConnect;