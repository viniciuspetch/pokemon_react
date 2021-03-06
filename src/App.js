import React from "react";
import "./App.css";
import { useState } from "react";

import { pokemonList } from "./PokeList.js";
import Cookies from "universal-cookie";

import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import ListGroup from "react-bootstrap/ListGroup";
import Collapse from "react-bootstrap/Collapse";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";
import InputGroup from "react-bootstrap/InputGroup";
import Card from "react-bootstrap/Card";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";

function PokemonImage(props) {
  if (props.pokemon) {
    return (
      <img src={props.pokemon.sprites.front_default} alt="Pokémon sprite" />
    );
  }
  return <p>No Pokémon found</p>;
}

class SearchForm extends React.Component {
  constructor(props) {
    super(props);
    this.handleInput = this.handleInput.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleInput(e) {
    e.preventDefault();
    let pokemonName = e.target.pokemonName.value;
    this.props.onInput(pokemonName);
  }

  handleChange(e) {
    e.preventDefault();
    let pokemonName = e.target.value;
    this.props.onChange(pokemonName);
  }

  render() {
    return (
      <Form onSubmit={this.handleInput}>
        <Form.Group as={Row} controlId="formSearch">
          <Form.Label column sm={12}>
            Enter Pokémon name or nº and press "Search":
          </Form.Label>
          <InputGroup>
            <Form.Control
              type="text"
              name="pokemonName"
              onChange={this.handleChange}
            />
            <InputGroup.Append>
              <Button variant="primary" type="submit">
                Search
              </Button>
            </InputGroup.Append>
          </InputGroup>
        </Form.Group>
      </Form>
    );
  }
}

function PokemonName(props) {
  if (!props.pokemon) {
    return null;
  }
  let url_prefix = "https://bulbapedia.bulbagarden.net/wiki/";
  let url_suffix = "_(Pokémon)";
  let name_uppercased =
    props.pokemon.name[0].toUpperCase() + props.pokemon.name.slice(1);
  return (
    <div>
      <a href={url_prefix + name_uppercased + url_suffix}>
        nº {props.pokemon.id} - {name_uppercased}
      </a>
    </div>
  );
}

class PokemonDataTab extends React.Component {
  constructor(props) {
    super(props);

    this.getAbilities = this.getAbilities.bind(this);
    this.getTypes = this.getTypes.bind(this);
  }

  getAbilities() {
    let abilitiesList = [];
    if (this.props.pokemon) {
      abilitiesList = this.props.pokemon.abilities.map((ability, index) => {
        let url_prefix = "https://bulbapedia.bulbagarden.net/wiki/";
        let url_suffix = "_(Ability)";
        let name_fixed = ability.ability.name
          .split("-")
          .map((part) => part[0].toUpperCase() + part.slice(1))
          .join(" ");

        return (
          <ListGroup.Item
            action
            key={index.toString()}
            href={url_prefix + name_fixed.replace(" ", "_") + url_suffix}
            className="fakeLink"
          >
            {name_fixed + (ability.is_hidden ? " (Hidden)" : "")}
          </ListGroup.Item>
        );
      });
    }

    return abilitiesList.reverse();
  }

  getTypes() {
    let typesList = [];
    if (this.props.pokemon) {
      typesList = this.props.pokemon.types.map((type, index) => {
        let url_prefix = "https://bulbapedia.bulbagarden.net/wiki/";
        let url_suffix = "_(type)";
        let name_fixed =
          type.type.name[0].toUpperCase() + type.type.name.slice(1);

        return (
          <ListGroup.Item
            action
            key={index.toString()}
            href={url_prefix + name_fixed + url_suffix}
            className="fakeLink"
          >
            {name_fixed}
          </ListGroup.Item>
        );
      });
    }

    return typesList.reverse();
  }

  render() {
    return (
      <Row>
        <Col>
          <ListGroup>{this.getAbilities()}</ListGroup>
        </Col>
        <Col>
          <ListGroup>{this.getTypes()}</ListGroup>
        </Col>
      </Row>
    );
  }
}

function PokemonSpeciesDataTab(props) {
  if (!props.pokemon) {
    return null;
  }
  return (
    <>
      <hr />
      <p>Gender Rate: {props.pokemon.gender_rate}</p>
      <p>Capture Rate: {props.pokemon.capture_rate}</p>
      <p>Base Happiness: {props.pokemon.base_happiness}</p>
      {props.pokemon.is_baby ? <p>Is a baby Pokémon</p> : ""}
      <p>Growth Rate: {props.pokemon.growth_rate.name}</p>
    </>
  );
}

function PokemonStatsTab(props) {
  if (!props.pokemon) {
    return null;
  }
  return (
    <>
      <p style={{ margin: "5px 0" }}>HP: {props.pokemon.stats[5].base_stat}</p>
      <div
        className="statbox"
        style={{ width: props.pokemon.stats[5].base_stat }}
      ></div>
      <p style={{ margin: "5px 0" }}>
        Attack: {props.pokemon.stats[4].base_stat}
      </p>
      <div
        className="statbox"
        style={{ width: props.pokemon.stats[4].base_stat }}
      ></div>
      <p style={{ margin: "5px 0" }}>
        Defense: {props.pokemon.stats[3].base_stat}
      </p>
      <div
        className="statbox"
        style={{ width: props.pokemon.stats[3].base_stat }}
      ></div>
      <p style={{ margin: "5px 0" }}>
        Special Attack: {props.pokemon.stats[2].base_stat}
      </p>
      <div
        className="statbox"
        style={{ width: props.pokemon.stats[2].base_stat }}
      ></div>
      <p style={{ margin: "5px 0" }}>
        Special Defense: {props.pokemon.stats[1].base_stat}
      </p>
      <div
        className="statbox"
        style={{ width: props.pokemon.stats[1].base_stat }}
      ></div>
      <p style={{ margin: "5px 0" }}>
        Speed: {props.pokemon.stats[0].base_stat}
      </p>
      <div
        className="statbox"
        style={{ width: props.pokemon.stats[0].base_stat }}
      ></div>
    </>
  );
}

function MovesetCard(props) {
  return (
    <Card className="movesetCard">
      <Card.Body>
        <Card.Title>{props.title}</Card.Title>
        <hr />
        <Card.Text>{props.text}</Card.Text>
      </Card.Body>
    </Card>
  );
}

function PokemonMovesetTab(props) {
  if (!props.pokemon) {
    return null;
  }
  let moveset_machine = [];
  let moveset_levelup = [];
  let moveset_egg = [];
  let moveset_other = [];
  for (let i in props.pokemon.moves) {
    let move = props.pokemon.moves[i];
    if (move.version_group_details[0].move_learn_method.name === "machine") {
      moveset_machine.push(move);
    } else if (move.version_group_details[0].move_learn_method.name === "egg") {
      moveset_egg.push(move);
    } else if (
      move.version_group_details[0].move_learn_method.name === "level-up"
    ) {
      moveset_levelup.push(move);
    } else {
      moveset_other.push(move);
    }
  }
  let list_levelup = moveset_levelup
    .map((item) =>
      item.move.name
        .split("-")
        .map((a) => a[0].toUpperCase() + a.slice(1))
        .join(" ")
    )
    .join(", ");
  let list_machine = moveset_machine
    .map((item) =>
      item.move.name
        .split("-")
        .map((a) => a[0].toUpperCase() + a.slice(1))
        .join(" ")
    )
    .join(", ");
  let list_egg = moveset_egg
    .map((item) =>
      item.move.name
        .split("-")
        .map((a) => a[0].toUpperCase() + a.slice(1))
        .join(" ")
    )
    .join(", ");
  let list_other = moveset_other
    .map((item) =>
      item.move.name
        .split("-")
        .map((a) => a[0].toUpperCase() + a.slice(1))
        .join(" ")
    )
    .join(", ");

  return (
    <>
      <MovesetCard title={"Level-up"} text={list_levelup} />
      <MovesetCard title={"TMs and HMs"} text={list_machine} />
      <MovesetCard title={"Egg moves"} text={list_egg} />
      <MovesetCard title={"Other means"} text={list_other} />
    </>
  );
}

function PokemonList(props) {
  const [open, setOpen] = useState(false);
  var pokemonListRender = props.pokemonList.map((pokemon, index) => {
    return (
      <Col
        xs="6"
        sm="4"
        md="3"
        key={index.toString()}
        style={{ margin: "0px", padding: "5px" }}
      >
        <ListGroup.Item
          className="fakeLink"
          action
          style={{ margin: "0px", padding: "10px" }}
          onClick={() => {
            props.handleChange(pokemon);
            props.handleInput(pokemon);
          }}
        >
          {pokemon}
        </ListGroup.Item>
      </Col>
    );
  });

  return (
    <>
      <Row
        className="justify-content-md-center"
        style={{ margin: "0 0 20px 0" }}
      >
        <Col>
          <Button
            onClick={() => setOpen(!open)}
            aria-controls="example-collapse-text"
            aria-expanded={open}
          >
            Show/Hide Pokémon List
          </Button>
        </Col>
      </Row>
      <Collapse in={open}>
        <div style={{ margin: "0 5px 20px" }}>
          <Row>{pokemonListRender}</Row>
          <Button onClick={() => props.handleChange("")}>Reset</Button>
        </div>
      </Collapse>
    </>
  );
}

function setPrevSearch(pokemonName) {
  verifyPrevSearch();
  const cookies = new Cookies();
  let prevSearchList = cookies.get("prevSearchList");
  if (!prevSearchList) {
    console.log("here");
  }
  for (let i = 4; i > 0; i--) {
    if (prevSearchList[i - 1]) {
      prevSearchList[i] = prevSearchList[i - 1];
    }
  }
  prevSearchList[0] = pokemonName;
  cookies.set("prevSearchList", prevSearchList);
  console.log(prevSearchList);
}

function verifyPrevSearch() {
  const cookies = new Cookies();
  if (!cookies.get("prevSearchList")) {
    cookies.set("prevSearchList", []);
  }
}

function PageHeader() {
  return (
    <Navbar bg="light" variant="light">
      <Navbar.Brand>Pokémon Info - React</Navbar.Brand>
      <Nav>
        <Nav.Link href="#home">Home</Nav.Link>
        <Nav.Link href="#features">About</Nav.Link>
      </Nav>
    </Navbar>
  );
}

function PageFooter() {
  return (
    <div className="footer">
      <div>
        Powered by <a href="https://reactjs.org/"> React.js</a>
      </div>
      <div style={{ margin: "0 20px" }}>
        Data by <a href="https://pokeapi.co/"> pokeapi.co</a>
      </div>
      <div>May 2020</div>
    </div>
  );
}

function getPrevSearch() {
  verifyPrevSearch();
  const cookies = new Cookies();
  return cookies.get("prevSearchList");
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pokemonName: "",
      searchResult: "",
      pokemon: null,
      currTab: 1,
      pokemonNumber: null,
      pokemonList: this.filterPokemonList(""),
    };
    this.handleInput = this.handleInput.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.searchPokemon = this.searchPokemon.bind(this);
    this.setTab = this.setTab.bind(this);
    this.getPreviousPokemon = this.getPreviousPokemon.bind(this);
    this.getNextPokemon = this.getNextPokemon.bind(this);
  }

  componentDidMount() {
    this.filterPokemonList();
  }

  filterPokemonList(pokemonName) {
    let rawList = [];
    for (let key in pokemonList) {
      rawList = rawList.concat(pokemonList[key]);
    }
    return rawList.filter((item) => item.toLowerCase().includes(pokemonName));
  }

  handleInput(pokemonName) {
    if (pokemonName) {
      pokemonName = pokemonName.toLowerCase().trim();
    }
    this.searchPokemon(pokemonName);
  }

  handleChange(pokemonName) {
    if (pokemonName) {
      pokemonName = pokemonName.toLowerCase().trim();
    }
    this.setState({
      pokemonName: pokemonName,
      pokemonList: this.filterPokemonList(pokemonName),
    });
  }

  searchPokemon(pokemonName) {
    console.log(pokemonName);
    if (pokemonName) {
      console.log("pokemonName is valid");
      if (!isNaN(pokemonName)) {
        console.log("It's a number");
        pokemonName = parseInt(pokemonName);
      } else {
        console.log("It's a word");
        pokemonName = pokemonName.toLowerCase();
      }
    } else {
      return null;
    }
    console.log("Pokemon searched: " + pokemonName);
    if (
      isNaN(pokemonName) &&
      !this.state.pokemonList.find((name) => {
        return name.toLowerCase().trim() === pokemonName.toLowerCase().trim();
      })
    ) {
      console.log("Search blocked by list");
      return null;
    }
    // Set new Pokémon search on memory
    setPrevSearch(pokemonName);
    // Search Pokémon
    this.setState({ pokemon: null });
    const Pokedex = require("pokeapi-js-wrapper");
    const P = new Pokedex.Pokedex();
    let self = this;
    P.getPokemonByName(pokemonName)
      .then(function (response) {
        console.log(response);
        self.setState({
          pokemon: response,
          pokemonNumber: response.game_indices[0].game_index,
        });
      })
      .catch(function (error) {
        self.setState({ pokemon: null });
      });
    P.getPokemonSpeciesByName(pokemonName).then(function (response) {
      console.log(response);
      self.setState({
        pokemonSpecies: response,
      });
    });
  }

  getPreviousPokemon() {
    this.searchPokemon(this.state.pokemonNumber - 1);
  }

  getNextPokemon() {
    this.searchPokemon(this.state.pokemonNumber + 1);
  }

  setTab(e) {
    this.setState({
      currTab: parseInt(e.target.value),
    });
  }

  render() {
    let lastPokemons = Object.values(getPrevSearch())
      .reverse()
      .map((origValue, index) => {
        var value;
        if (typeof origValue == "string") {
          value = origValue[0].toUpperCase() + origValue.slice(1);
        }
        if (typeof origValue == "number") {
          value = <i>{"Pokémon nº " + origValue}</i>;
          origValue = origValue.toString();
        }
        return (
          <ListGroup.Item
            className="fakeLink"
            action
            onClick={() => {
              this.handleChange(origValue);
              this.handleInput(origValue);
            }}
            key={index}
          >
            {value}
          </ListGroup.Item>
        );
      });
    // Set scroll buttons
    let scrollButtons = null;
    if (this.state.pokemon) {
      scrollButtons = (
        <ButtonGroup aria-label="Previous and next Pokémon">
          <Button onClick={this.getPreviousPokemon}>Previous</Button>
          <Button onClick={this.getNextPokemon}>Next</Button>
        </ButtonGroup>
      );
    } else {
      scrollButtons = (
        <ButtonGroup aria-label="Previous and next Pokémon">
          <Button disabled>Previous</Button>
          <Button disabled>Next</Button>
        </ButtonGroup>
      );
    }

    return (
      <div className="App">
        <PageHeader />
        <Container className="body">
          <ListGroup>{lastPokemons}</ListGroup>
          <Row
            className="justify-content-md-center"
            style={{ margin: "10px 0" }}
          >
            <SearchForm
              onChange={this.handleChange}
              onInput={this.handleInput}
            />
          </Row>
          <PokemonList
            pokemonList={this.state.pokemonList}
            handleChange={this.handleChange}
            handleInput={this.handleInput}
          />
          {scrollButtons}
          <PokemonName
            pokemon={this.state.pokemon}
            style={{ margin: "10px 0" }}
          />
          <PokemonImage pokemon={this.state.pokemon} />
          <Tabs defaultActiveKey="stats" style={{ marginBottom: "10px" }}>
            <Tab eventKey="stats" title="Stats">
              <PokemonStatsTab pokemon={this.state.pokemon} />
            </Tab>
            <Tab eventKey="data" title="Data">
              <PokemonDataTab pokemon={this.state.pokemon} />
              <PokemonSpeciesDataTab pokemon={this.state.pokemonSpecies} />
            </Tab>
            <Tab eventKey="moveset" title="Moveset">
              <PokemonMovesetTab pokemon={this.state.pokemon} />
            </Tab>
          </Tabs>
        </Container>
        <PageFooter />
      </div>
    );
  }
}

export default App;
