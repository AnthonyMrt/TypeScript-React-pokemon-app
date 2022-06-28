import Pokemon from "../models/pokemon";
import POKEMONS from "../models/mock-pokemon";

export default class PokemonService {
  static pokemons: Pokemon[] = POKEMONS;

  static isDev =
    !process.env.NODE_ENV || process.env.NODE_ENV === "development";

  static getPokemons(): Promise<Pokemon[]> {
    return fetch("http://localhost:3001/pokemons")
      .then((response) => response.json())
      .catch((error) => this.handleError(error));
  }

  static getPokemon(id: number): Promise<Pokemon | null> {
    return fetch(`http://localhost:3001/pokemons/${id}`)
      .then((response) => response.json())
      .then((data) => (this.isEmpty(data) ? null : data))
      .catch((error) => this.handleError(error));
  }

  static updatePokemon(pokemon: Pokemon): Promise<Pokemon> {
    return fetch(`http://localhost:3001/pokemons/${pokemon.id}`, {
      method: "PUT",
      body: JSON.stringify(pokemon),
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => response.json())
      .catch((error) => this.handleError(error));
  }

  static deletePokemon(pokemon: Pokemon): Promise<{}> {
    return fetch(`http://localhost:3001/pokemons/${pokemon.id}`, {
      method: "DELETE",
      headers: { "Content-type": "application/json" },
    })
      .then((response) => response.json())
      .catch((error) => this.handleError(error));
  }

  static addPokemon(pokemon: Pokemon): Promise<Pokemon> {
    delete pokemon.created;

    if (this.isDev) {
      return fetch(`http://localhost:3001/pokemons`, {
        method: "POST",
        body: JSON.stringify(pokemon),
        headers: { "Content-Type": "application/json" },
      })
        .then((response) => response.json())
        .catch((error) => this.handleError(error));
    }

    return new Promise((resolve) => {
      this.pokemons.push(pokemon);
      resolve(pokemon);
    });
  }

  static searchPokemon(term: string): Promise<Pokemon[]> {
    return fetch(`http://localhost:3001/pokemons?q=${term}`)
      .then((response) => response.json())
      .catch((error) => this.handleError(error));
  }

  static isEmpty(data: Object): boolean {
    return Object.keys(data).length === 0;
  }

  static handleError(error: Error): void {
    console.log(error);
  }
}
