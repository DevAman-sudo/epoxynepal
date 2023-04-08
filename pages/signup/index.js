import React from "react";
import SignUp from "../../components/Register.jsx";
import Cookies from "js-cookie";
import Router from "next/router.js";

const signup = ()  => {
  // if (isAuthenticated) {
  //   const userID = Cookies.get('user_id');
  //   Router.push(`/profile/${userID}`);
  // } 
    return (
      <div>
        <SignUp />
      </div>
    );
  
};

export default signup;
