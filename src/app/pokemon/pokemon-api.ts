import { HttpClient } from '@angular/common/http';
import { Service, inject } from '@angular/core';
import { Observable, switchMap, of, tap } from 'rxjs';
import { TarjetaPokemon } from './tarjeta-pokemon/tarjeta-pokemon';
import { CatalogoPokemon } from '../dominio/pokemon';
import { Pokemon } from '../dominio/pokemon';

@Service()
export class PokemonApi {
  private http = inject(HttpClient);

  private url = 'https://pokeapi.co/api/v2/pokemon/';

  private cache = new Map<string, Pokemon>();
  listarTodos(): Observable<CatalogoPokemon> {
    return this.http.get<CatalogoPokemon>(this.url).pipe(
      switchMap(respuesta =>
        this.http.get<CatalogoPokemon>(this.url, {
          params: {
            limit: respuesta.count
          }
        })
      )
    );
  }

  private guardarEnCache(pokemon: Pokemon): void {
    this.cache.set(pokemon.name, pokemon);
    this.cache.set(String(pokemon.id), pokemon);

    const url = `${this.url}${pokemon.id}/`;
    this.cache.set(url, pokemon);
  }

  buscarPorIdONombre(valor: string): Observable<Pokemon> {
    const busqueda = valor.trim().toLowerCase();
    const guardado = this.cache.get(busqueda);

    if (guardado) {
      return of(guardado);
    }

    return this.http.get<Pokemon>(
      `${this.url}${encodeURIComponent(busqueda)}/`
    ).pipe(
      tap(pokemon => this.guardarEnCache(pokemon))
    );
  }

  buscarPorUrl(url: string): Observable<Pokemon> {
    const guardado = this.cache.get(url);

    if (guardado) {
      return of(guardado);
    }

    return this.http.get<Pokemon>(url).pipe(
      tap(pokemon => {
        this.guardarEnCache(pokemon);
        this.cache.set(url, pokemon);
      })
    );
  }
}

