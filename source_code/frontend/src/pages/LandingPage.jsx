import Axios from "axios";
import React, { useEffect, useState, useContext } from "react";
import { Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import userContext from "../services/userContext";

export default function LandingPage() {
  const [users, setUsers] = useState([]);
  const { userData, setUserData } = useContext(userContext);

  useEffect(() => {
    Axios.get("http://localhost:8080/")
      .then((res) => {
        console.log(res.data);
        setUsers(res.data);
      })
      .then((err) => {});
  }, []);

  return (
    <div className="LandingPage">
      <h1 style={{ color: "white", marginTop: "40px" }}>ALL USERS</h1>
      <div className="LandingPageInnerContainer">
        <Table
          style={{ width: "40%", margin: "auto" }}
          striped
          bordered
          hover
          variant="dark"
        >
          <thead>
            <tr>
              <th>#</th>
              <th colSpan="2">Username</th>
            </tr>
          </thead>
          {users.length !== 0 ? (
            <tbody>
              {users.map((data, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td colSpan="2">
                    <Link
                      to={`/profile/view/${data._id}`}
                      style={{ color: "white" }}
                    >
                      {data.username}
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          ) : (
            <tbody>
              <tr>
                <td>1</td>
                <td colSpan="2">NO USERS</td>
              </tr>
            </tbody>
          )}
        </Table>
      </div>
    </div>
  );
}
