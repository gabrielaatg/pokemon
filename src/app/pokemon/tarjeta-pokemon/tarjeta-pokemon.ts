import { Component, OnInit, inject, Input, signal, EventEmitter, Output } from '@angular/core';
import { PokemonApi } from '../pokemon-api';
import { Pokemon, ReferenciaPokemon } from '../../dominio/pokemon';
@Component({
  selector: 'app-tarjeta-pokemon',
  imports: [],
  templateUrl: './tarjeta-pokemon.html',
  styleUrl: './tarjeta-pokemon.css',
})
export class TarjetaPokemon implements OnInit {
  @Input({required:true}) referencia!: ReferenciaPokemon;
  @Output() seleccionar = new EventEmitter<Pokemon>();
  
  private api = inject(PokemonApi);

  pokemon = signal <Pokemon | null >(null);
  cargando = signal (true);
  error= signal('');
  imagenFallida=signal (false);

  ngOnInit(): void {
    this.cargarPokemon();
  }

  cargarPokemon(): void{
    this.cargando.set(true);
    this.error.set('');
    this.imagenFallida.set(false);

    this.api.buscarPorUrl(this.referencia.url).subscribe({
      next: respuesta =>{
        this.pokemon.set(respuesta);
        this.cargando.set(false);
      },
      error: () =>{
        this.error.set('N se pudo cargar este pokemon');
        this.cargando.set(false);
      }
    });
  }

  obtenerImagen(pokemon: Pokemon): string | null{
    return pokemon.sprites.other['official-artwork'].front_default
    ?? pokemon.sprites.front_default;
  }
}
