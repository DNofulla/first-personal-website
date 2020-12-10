import React, { useState, useEffect } from "react";
import "../styles/HomePage.css";
import { Image } from "react-bootstrap";
import Axios from "axios";
import { useParams } from "react-router";
import { useContext } from "react";
import userContext from "../services/userContext";

export default function HomePage() {
  const { profileId } = useParams();
  const [allUserData, setAllUserData] = useState();
  const { userData, setUserData } = useContext(userContext);

  const awsImageString = "https://daniel-nofulla-bucket.s3.amazonaws.com/";

  useEffect(() => {
    console.log(profileId);
    Axios.get("http://localhost:8080/findUserById", {
      params: {
        id: profileId,
      },
    })
      .then((response) => {
        setAllUserData(response.data);
      })
      .then((error) => {
        console.log(error);
      });
  }, []);

  return (
    <div className="HomePage">
      <div className="innerHomePageContainer">
        {allUserData ? (
          <>
            <div className="HomePageProfileImage">
              <Image
                style={{
                  backgroundColor: "black",
                  width: "250px",
                  height: "190px",
                }}
                thumbnail
                src={`${awsImageString}${allUserData.image}`}
                alt="Alternate Image"
              />
              <div id="HomePageName">{allUserData.name}</div>
            </div>
            <div className="HomePageProfileDescription">
              <div className="HomePageDesc">{allUserData.description}</div>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}
