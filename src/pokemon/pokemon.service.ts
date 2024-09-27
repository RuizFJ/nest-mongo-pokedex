import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { Pokemon } from './entities/pokemon.entity';
import { isValidObjectId, Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { PaginationDto } from '../common/dto/pagination.dto';

@Injectable()
export class PokemonService {
  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,
  ) {}

  async create(createPokemonDto: CreatePokemonDto) {
    createPokemonDto.name = createPokemonDto.name.toLocaleLowerCase();
    try {
      const pokemon = await this.pokemonModel.create(createPokemonDto);
      return pokemon;
    } catch (error) {
      this.handleException(error);
    }
  }

  findAll(PaginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = PaginationDto;
    
    return this.pokemonModel.find().limit(limit).skip(offset);
  }

  async findOne(term: string) {
    //Adaptamos el metodo para que reciba id, No y nombre
    let pokemon: Pokemon;

    if (!isNaN(+term)) {
      // Comprueba si no es un NaN
      pokemon = await this.pokemonModel.findOne({ no: term });

    } else if (isValidObjectId(term)) {   //Comprueba si es un id de mongo
      pokemon = await this.pokemonModel.findById(term);
    } else {
      pokemon = await this.pokemonModel.findOne({
        name: term.toLowerCase().trim(),
      });
    }
    if (!pokemon)
      throw new NotFoundException(
        `Pokemon with id, name or No: ${term} not found`,
      );

    return pokemon;
  }

  async update(term: string, updatePokemonDto: UpdatePokemonDto) {
    const pokemon = await this.findOne(term);
    if (updatePokemonDto.name) {
      updatePokemonDto.name = updatePokemonDto.name.toLowerCase().trim();
    }

    try {
      await pokemon.updateOne(updatePokemonDto, { new: true });

    } catch (error) {

      this.handleException(error);
      
    }

    return { ...pokemon.toJSON(), ...updatePokemonDto };
  }

  async remove(id: string) {
    
    const {deletedCount} = await this.pokemonModel.deleteOne({ _id: id});

    if(deletedCount === 0) throw new BadRequestException(`Pokemon with id: ${id} not found`);

    return deletedCount
  }

  private handleException(error:any){
    if (error.code === 11000) {
      throw new BadRequestException(
        `Pokemon exist in db ${JSON.stringify(error.keyValue)}`,
      );
    }
    console.log(error);
    throw new InternalServerErrorException(
      `Can't update Pokemon - Check server logs`,
    );
  }
}
