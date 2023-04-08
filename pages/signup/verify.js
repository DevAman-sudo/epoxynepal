import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import axios from "axios";

export default function Verify() {
  const router = useRouter();
  const [message, setMessage] = useState("Verifying email...");

  useEffect(() => {
    const verifyEmail = async () => {
      const token = router.query.token;
      if (!token) {
        setMessage("Invalid token.");
        return;
      }
      setMessage("Please wait...");

      const userName = Cookies.get("user_name");
      const userEmail = Cookies.get("user_email");
      const userKey = Cookies.get("user_key");
      const userToken = Cookies.get("verification_token");

      if (token === userToken) {
        try {
          const response = await axios.post("/api/users/createuser", {
            userName,
            userEmail,
            userKey
          });

          setMessage(response.data.message);
          Cookies.remove("user_key")
          Cookies.remove("verification_token")
          router.push('/login?message=registration successful')

        } catch (error) {
          console.log(error)
          setMessage("An error occurred while verifying email.");
        }
      } else {
        setMessage("Token not valid.");
      }
    };

    verifyEmail();
  }, [router.query.token]);

  return (
    <div className="w-full h-auto p-8 flex flex-col justify-center items-center tracking-widest text-3xl">
      <h1>Email Verification</h1>
      <p>{message} ... </p>
    </div>
  );
}
