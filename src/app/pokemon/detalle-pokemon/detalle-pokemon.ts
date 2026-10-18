import {
  Component,
  Input,
  OnChanges,
  inject,
  signal,
  ChangeDetectionStrategy,
} from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { PokemonApi } from '../pokemon-api';
import { Pokemon } from '../../dominio/pokemon';
@Component({
  selector: 'app-detalle-pokemon',
  imports: [RouterLink],
  templateUrl: './detalle-pokemon.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './detalle-pokemon.css',
})
export class DetallePokemon implements OnChanges {
  @Input() id = '';
  @Input() q?: string;

  private api = inject(PokemonApi);

  pokemon = signal<Pokemon | null>(null);
  cargando = signal(true);
  error = signal('');
  imagenFallida = signal(false);

  ngOnChanges(): void {
    this.cargarPokemon();
  }

  cargarPokemon(): void {
    this.cargando.set(true);
    this.error.set('');
    this.pokemon.set(null);
    this.imagenFallida.set(false);

    this.api.buscarPorIdONombre(this.id).subscribe({
      next: (respuesta) => {
        this.pokemon.set(respuesta);
        this.cargando.set(false);
      },
      error: (e) => {
        if (e.status === 404) {
          this.error.set('El Pokémon solicitado no existe.');
        } else if (e.status === 0) {
          this.error.set('No hay conexión con el servidor.');
        } else {
          this.error.set('No se pudo cargar el Pokémon.');
        }

        this.cargando.set(false);
      },
    });
  }

  obtenerImagen(pokemon: Pokemon): string | null {
    return pokemon.sprites.other['official-artwork'].front_default ?? pokemon.sprites.front_default;
  }
}
