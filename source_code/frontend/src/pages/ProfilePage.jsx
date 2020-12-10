import React, { useState, useEffect } from "react";
import { InputGroup, FormControl, Image, Button, Form } from "react-bootstrap";
import "../styles/ProfilePage.css";
import Axios from "axios";
import { useContext } from "react";
import userContext from "../services/userContext";
import { Redirect, useHistory } from "react-router";

export default function ProfilePage() {
  const [description, setDescription] = useState();
  const [profilePicURL, setProfilePicURL] = useState();
  const [profilePicName, setProfilePicName] = useState();
  const [tempPicName, setTempPicName] = useState();
  const [profilePic, setProfilePic] = useState();
  const [tempImgURL, setTempImgURL] = useState();
  const [name, setName] = useState();
  const { userData, setUserData } = useContext(userContext);
  const history = useHistory();

  const awsImageString = "https://daniel-nofulla-bucket.s3.amazonaws.com/";

  useEffect(() => {
    setProfilePicURL(awsImageString + userData.user.image);
    setName(userData.user.name);
    setDescription(userData.user.description);
    setProfilePicName(userData.user.image);
  }, []);

  return (
    <div className="ProfilePage">
      {userData.user ? (
        <div className="innerEditProfileDiv">
          <form>
            <FormControl
              name="username"
              value={userData.user.username}
              aria-label="With textarea"
              style={{ display: "none" }}
            />
            <div className="ProfilePageProfileImage">
              <Image
                style={{
                  backgroundColor: "black",
                  width: "250px",
                  height: "190px",
                }}
                thumbnail
                alt="NO IMAGE SELECTED"
                src={profilePicURL}
              />
              <div className="mt-2">
                <Button type="file" variant="info">
                  <FormControl
                    type="file"
                    aria-label="profilePicture"
                    name="image"
                    accept="/image/png, image/jpeg"
                    onChange={(e) => {
                      if (e.target.files[0]) {
                        setTempPicName(e.target.files[0].name);
                        setProfilePic(e.target.files[0]);
                        setTempImgURL(awsImageString + tempPicName);
                      } else {
                        setProfilePic(userData.user.image);
                        setTempPicName(
                          "https://daniel-nofulla-bucket.s3.amazonaws.com/jdsbfkdjasbfdkjasbfdkjasbfdlasfkjbaslasfasfklbasfkjbas.png"
                        );
                        setTempImgURL(null);
                      }
                    }}
                  />
                </Button>
              </div>

              <div id="ProfilePageName">
                <InputGroup
                  style={{ width: "400px", margin: "auto", marginTop: "10px" }}
                >
                  <InputGroup.Prepend>
                    <InputGroup.Text>Name</InputGroup.Text>
                  </InputGroup.Prepend>
                  <FormControl
                    defaultValue={name}
                    name="name"
                    aria-label="Full Name"
                    style={{ textAlign: "center", resize: "none" }}
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                    }}
                  />
                </InputGroup>
              </div>
            </div>
            <div className="ProfilePageProfileDescription">
              <div className="ProfilePageDesc">
                <InputGroup style={{ height: "325px" }}>
                  <InputGroup.Prepend>
                    <InputGroup.Text>Description</InputGroup.Text>
                  </InputGroup.Prepend>
                  <FormControl
                    defaultValue={description}
                    name="description"
                    as="textarea"
                    aria-label="With textarea"
                    style={{ textAlign: "center", resize: "none" }}
                    value={description}
                    onChange={(e) => {
                      setDescription(e.target.value);
                    }}
                  />
                </InputGroup>
              </div>
              <Button
                type="submit"
                className="mt-3"
                variant="info"
                onClick={(e) => {
                  e.preventDefault();
                  setUserData({
                    token: userData.token,
                    user: {
                      username: userData.user.username,
                      name: name,
                      password: userData.user.password,
                      image: tempPicName,
                      description: description,
                    },
                  });

                  console.log(userData.user);

                  let formData = new FormData();
                  formData.append("image", profilePic);
                  formData.append("username", userData.user.username);
                  formData.append("name", name);
                  formData.append("description", description);
                  formData.append("imageName", tempPicName);

                  Axios.post("http://localhost:8080/updateDetails", formData, {
                    headers: {
                      "Content-Type": "multipart/form-data",
                    },
                  })
                    .then((response) => {
                      console.log(response);
                      history.push("/");
                    })
                    .then((error) => {
                      console.log(error);
                    });
                }}
              >
                Save and Upload Profile Information
              </Button>
            </div>
          </form>
        </div>
      ) : (
        <Redirect to="/login" />
      )}
    </div>
  );
}
