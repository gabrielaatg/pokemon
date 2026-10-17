import { Routes } from '@angular/router';
import { ListaPokemon } from './pokemon/lista-pokemon/lista-pokemon';
import { DetallePokemon } from './pokemon/detalle-pokemon/detalle-pokemon';
export const routes: Routes = [
  { path: '', redirectTo: 'pokemon', pathMatch: 'full' },
  { path: 'pokemon', component: ListaPokemon },
  { path: 'pokemon/:id', component: DetallePokemon },
  {path: '**', redirectTo: 'pokemon' }
];
