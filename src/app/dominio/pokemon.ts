export interface ReferenciaPokemon {
    name: string;
    url: string;
}

export interface CatalogoPokemon {
    count: number;
    results: ReferenciaPokemon[];
}

export interface ImagenesPokemon {
    front_default: string | null;
    other: {
        'official-artwork': {
        front_default: string | null;
        };
    };
}

export interface TipoPokemon {
    slot: number;
    type: {
        name: string;
    };
}

export interface HabilidadPokemon {
    ability: {
        name: string;
    };
    is_hidden: boolean;
}

export interface EstadisticaPokemon {
    base_stat: number;
    stat: {
        name: string;
    };
}

export interface Pokemon {
    id: number;
    name: string;
    height: number;
    weight: number;
    sprites: ImagenesPokemon;
    types: TipoPokemon[];
    abilities: HabilidadPokemon[];
    stats: EstadisticaPokemon[];
}