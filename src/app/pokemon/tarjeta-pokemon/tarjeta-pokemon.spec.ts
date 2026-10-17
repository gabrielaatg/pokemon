import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TarjetaPokemon } from './tarjeta-pokemon';

describe('TarjetaPokemon', () => {
  let component: TarjetaPokemon;
  let fixture: ComponentFixture<TarjetaPokemon>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TarjetaPokemon],
    }).compileComponents();

    fixture = TestBed.createComponent(TarjetaPokemon);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
