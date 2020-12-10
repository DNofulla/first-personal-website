import React, { useState } from "react";
import {
  Image,
  Form,
  Button,
  Row,
  Col,
  Card,
  ProgressBar,
} from "react-bootstrap";
import Axios from "axios";

export default function ApiPage() {
  const [search, setSearch] = useState();
  const [pokemonData, setPokemonData] = useState();
  const [error, setError] = useState();

  const getPokemonData = (e) => {
    e.preventDefault();

    if (search !== "" && search !== undefined && search !== null) {
      const pokemonName = search.toLowerCase();

      Axios.get("http://localhost:8080/api/pokemon", {
        params: { pokemonName: pokemonName },
      }).then((res) => {
        console.log(res.data);
        if (!res.data.message) {
          setPokemonData(res.data);
        } else {
          console.log(res.data.message);
          setError("Please Enter a Valid Pokemon Name!");
          alert(error);
        }
      });
    } else {
      setError("Please Enter a Valid Pokemon Name!");
      console.log(error);
      alert(error);
    }
  };

  return (
    <div className="ApiPage">
      <div style={{ marginTop: "20px" }}>
        <Image
          width="550px"
          src="https://external-content.duckduckgo.com/iu/?u=http%3A%2F%2Fpngimg.com%2Fuploads%2Fpokemon_logo%2Fpokemon_logo_PNG3.png&f=1&nofb=1"
        />
      </div>
      <div
        style={{ width: "60%", margin: "auto" }}
        className="SearchBarApiContainer"
      >
        <Form.Group controlId="formBasicSearch">
          <div>
            <Form.Label style={{ color: "white", fontSize: "25px" }}>
              POKEMON SEARCH
            </Form.Label>
          </div>

          <Form.Control
            style={{ width: "80%", float: "left" }}
            type="pokemonName"
            placeholder="Enter Pokemon Name"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Button
            style={{ marginLeft: "2%", width: "15%", float: "left" }}
            variant="primary"
            onClick={getPokemonData}
          >
            Search!
          </Button>
          <Form.Text style={{ width: "80%", color: "white" }}>
            Make sure you check for spelling. Enter pokemon name or pokedex
            index number!
          </Form.Text>
        </Form.Group>
        {!pokemonData ? null : (
          <>
            <div style={{ marginRight: "35px" }}>
              <Row>
                <Col xs={12} md={6}>
                  <Card bg="success" style={{ color: "white" }}>
                    <Card.Header>
                      <h5>{pokemonData.name.toUpperCase()}</h5>
                      <Image
                        width="200px"
                        src={pokemonData.sprites.front_default}
                        alt={pokemonData.name}
                      />
                    </Card.Header>
                    <Card.Body>
                      <h5>Status Type</h5>
                      {pokemonData.types.map((type, key) => (
                        <div key={key}>
                          <span>{type.type.name.toUpperCase()}</span>
                        </div>
                      ))}
                      <h5 style={{ marginTop: "10px" }}>Passive Abilities</h5>
                      {pokemonData.abilities.map((ability, key) => (
                        <div key={key}>
                          <span>{ability.ability.name.toUpperCase()}</span>
                        </div>
                      ))}
                    </Card.Body>
                  </Card>
                </Col>
                <Col xs={12} md={6}>
                  <Card bg="dark" style={{ color: "white" }}>
                    <Card.Body>
                      <h4>Stats</h4>
                      {pokemonData.stats.map((stat, key) => (
                        <div key={key} style={{ margin: "4.5%" }}>
                          <strong>{stat.stat.name.toUpperCase()}</strong>
                          <ProgressBar
                            now={stat.base_stat}
                            max={200}
                            label={stat.base_stat}
                            animated
                            variant="danger"
                          />
                        </div>
                      ))}
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
