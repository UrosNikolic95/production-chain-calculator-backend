import { Type } from '@nestjs/common';
import { IsNumberOptions } from 'class-validator';

export interface EnvOptions {
  required?: boolean;
  isArray?: boolean;
  numOpt?: IsNumberOptions;
  enumType?: any;
  addToExample?: boolean;
}

export interface DecoratorOptions {
  required?: boolean;
  maxLength?: number;
  minLength?: number;
  isArray?: boolean;
  numOpt?: IsNumberOptions;
  enumType?: any;
  defaultValue?: any;
  minimun?: number;
  maximum?: number;
}

export interface IEnvData {
  addToExample?: boolean;
  type?: string;
  required?: boolean;
}
