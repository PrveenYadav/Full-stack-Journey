import React from "react";
import { useParams } from "react-router";

function User() {
    const {userid} =  useParams()
    return (
       <div className="p-4 text-3xl text-center">Hi User : {userid}</div>
    )
}

export default User