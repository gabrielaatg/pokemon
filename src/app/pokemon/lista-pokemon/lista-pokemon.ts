import { Component, Input, OnChanges, inject, signal} from '@angular/core';

import { FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';

import { Router } from '@angular/router';

import { PokemonApi } from '../pokemon-api';
import { Pokemon, ReferenciaPokemon } from '../../dominio/pokemon';
import { TarjetaPokemon } from '../tarjeta-pokemon/tarjeta-pokemon';

@Component({
  selector: 'app-lista-pokemon',
  imports: [TarjetaPokemon, ReactiveFormsModule],
  templateUrl: './lista-pokemon.html',
  styleUrl: './lista-pokemon.css'
})
export class ListaPokemon implements OnChanges {
  @Input() q?: string;

  private api = inject(PokemonApi);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  titulo = 'Catálogo de Pokémon';

  pokemones = signal<ReferenciaPokemon[]>([]);
  total = signal(0);
  cargando = signal(true);
  error = signal('');

  formulario = this.fb.nonNullable.group({
    busqueda: [
      '',
      [Validators.required, Validators.pattern(/\S/)]
    ]
  });

  ngOnChanges(): void {
    this.formulario.patchValue({
      busqueda: this.q ?? ''
    });

    this.cargarPokemones();
  }

  buscar(): void {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }

    const texto = this.formulario.getRawValue()
      .busqueda.trim().toLowerCase();

    if (texto === this.q) {
      this.cargarPokemones();
      return;
    }

    this.router.navigate(['/pokemon'], {
      queryParams: { q: texto }
    });
  }

  cargarPokemones(): void {
    this.cargando.set(true);
    this.error.set('');

    const texto = this.q?.trim().toLowerCase();

    if (texto) {
      this.api.buscarPorIdONombre(texto).subscribe({
        next: pokemon => {
          this.pokemones.set([
            {
              name: pokemon.name,
              url: `https://pokeapi.co/api/v2/pokemon/${pokemon.id}/`
            }
          ]);

          this.total.set(1);
          this.cargando.set(false);
        },
        error: e => {
          this.pokemones.set([]);
          this.total.set(0);

          this.error.set(
            e.status === 404
              ? 'No existe un Pokémon con ese nombre o ID.'
              : 'No se pudo realizar la búsqueda. Revisa tu conexión.'
          );

          this.cargando.set(false);
        }
      });

      return;
    }

    this.api.listarTodos().subscribe({
      next: respuesta => {
        this.pokemones.set(respuesta.results);
        this.total.set(respuesta.count);
        this.cargando.set(false);
      },
      error: () => {
        this.error.set(
          'No se pudo cargar el catálogo. Revisa tu conexión.'
        );
        this.cargando.set(false);
      }
    });
  }

  verTodos(): void {
    this.formulario.reset();

    if (!this.q) {
      this.cargarPokemones();
      return;
    }

    this.router.navigate(['/pokemon']);
  }

  verDetalle(pokemon: Pokemon): void {
    this.router.navigate(['/pokemon', pokemon.id], {
      queryParams: { q: this.q }
    });
  }
}