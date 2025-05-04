import React, { useEffect, useState } from "react";
import { useLoaderData } from "react-router";

function Github() {
    const data = useLoaderData()

    /*
    const [data, setData] = useState([])
    useEffect(() => {
        fetch('https://api.github.com/users/PrveenYadav')
        // fetch('https://api.github.com/users/hiteshchoudhary')
        .then(response => response.json())
        .then(data => {
            console.log(data)
            setData(data);
        })
    }, [])
    */

    return (
        <div className="text-black text-3xl p-8 flex justify-center items-center font-semibold">
            <img className="mr-5 rounded-lg " src={data.avatar_url} alt="Git Picture" width={300}/>
            <div className="info">
                Name: {data.name} <br />
                Followers: {data.followers}  <br />
                Repos: {data.public_repos} <br />
                Bio: {data.bio}
            </div>
        </div>
    )
}

export default Github

//You can write this in another file : good practice
export const githubInfoLoader = async() => {
    const response = await fetch('https://api.github.com/users/PrveenYadav')
    return response.json();
}