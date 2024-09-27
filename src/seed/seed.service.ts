import { Injectable } from '@nestjs/common';
import { PokeResponse } from './interfaces/poke-response.interface';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
import { AxiosAdapter } from 'src/common/adapters/axios.adapter';


@Injectable()
export class SeedService {
 // constructor(private readonly pokemonService: PokemonService) {}

 constructor(
  @InjectModel(Pokemon.name)
  private readonly pokemonModel: Model<Pokemon>,
  private readonly http : AxiosAdapter,
) {}
  

  async executeSEED(){
    await this.pokemonModel.deleteMany({});
    
    const pokemons:{no:number,name:string}[] = [];

    const data = await this.http.get<PokeResponse>('https://pokeapi.co/api/v2/pokemon?limit=650')
    data.results.forEach(({name, url}) => { //desestructuramos el objeto por name y url
      // cortamos la url por el caracter /
      const segments = url.split('/');
      // obtenemos el penultimo segmento que es el numero del pokemon
      const no = +segments[segments.length - 2];
      
      pokemons.push({no, name});
      

    });
    await this.pokemonModel.insertMany(pokemons);
    
    return 'Seed executed';
  }
}
