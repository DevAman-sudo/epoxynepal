import Router, { useRouter } from "next/router";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import Loading from "../../components/Loading";

const profile = () => {
  const [loading, setLoading] = useState(true);

  // verify user
  async function getAuth() {
    const token = Cookies.get("token");

    if (!token) {
      Router.push({
        pathname: "/login",
        query: { message: "Token Invalid" },
      });
    } else {
      try {
        const response = await fetch(`/api/middleware/auth?token=${token}`, {
          method: "POST",
        });
        
        
        if (!response.ok) {
          Router.push({
            pathname: "/login",
            query: { message: "Token Invalid" },
          });
        }
      } catch (error) {
        Router.push({
          pathname: "/login",
          query: { message: "Token Expired" },
        });
      }
    }
  }
  getAuth();

  const router = useRouter();
  const [userId, setUserId] = useState("");
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const userID = router.query.userId;

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`/api/users?id=${userID}`, {
          method: "POST",
        });

        if (!response.ok) {
          throw new Error("Error fetching user data");
        }

        const data = await response.json();

        setUserId(data._id);
        setUserName(data.name);
        setUserEmail(data.email);
      } catch (error) {
        console.log(error.message);
      }
    };

    if (userID) {
      fetchUserData();
    }
  }, [userID]);

  // handle logout
  const handleLogout = () => {
    Cookies.remove("token");
    Cookies.remove("user_id");
    Cookies.remove("isAdmin");
    Router.push("/");
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setLoading(false);
    }, 3000);

    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <div className="my-8">
      {/* loading page  */}
      {loading ? <Loading /> : null}

      <div className="flex w-full h-auto text-gray-700 mt-8">
        <h1 className="mt-auto font-bold float-left m-4 text-3xl">
          My Account
        </h1>
        <a
          onClick={handleLogout}
          className="ml-auto m-4 mt-auto cursor-pointer"
        >
          <p className=" font-bold  underline">log out</p>
        </a>
      </div>
      {/* body  */}
      <div className="lg:flex justify-evenly m-4">
        {/* account details  */}
        <div>
          <h1 className="text-2xl tracking-widest my-1">Account details</h1>
          <p className="text-gray-600 tracking-wider my-1">{userId}</p>
          <p className="text-gray-600 tracking-wider my-1">{userName}</p>
          <p className="text-gray-600 tracking-wider my-1">{userEmail}</p>
        </div>
        {/* order history   */}
        <div className="mt-8 md:mt-0">
          <h1 className="text-2xl tracking-widest my-1">Order History</h1>
          <p className="text-gray-600 tracking-wider my-1">
            You haven't placed any orders yet.
          </p>
        </div>
      </div>
    </div>
  );
};

export default profile;
