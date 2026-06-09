import { applyDecorators } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
  IsDefined,
  IsEmail,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsPhoneNumber,
  IsString,
  IsStrongPassword,
  Max,
  MaxLength,
  Min,
  MinLength,
  Validate,
  ValidateNested,
} from 'class-validator';
import { DecoratorOptions } from './decorator.interfaces';

export class BodyDecorators {
  static Int({
    required = false,
    isArray = false,
    defaultValue,
    minimum: minimun,
    maximum,
  }: DecoratorOptions = {}) {
    const decorators: PropertyDecorator[] = [
      ApiProperty({
        required: required,
        type: Number,
        isArray: isArray,
        default: defaultValue,
        minimum: minimun,
        maximum: maximum,
      }),
      required ? IsDefined() : IsOptional(),
      IsInt({ each: isArray }),
    ];
    if (minimun) decorators.push(Min(minimun));
    if (maximum) decorators.push(Max(maximum));
    return applyDecorators(...decorators);
  }

  static Number({
    required = false,
    isArray = false,
    defaultValue,
    minimum: minimun,
    maximum,
    numOpt = {},
  }: DecoratorOptions = {}) {
    const decorators: PropertyDecorator[] = [
      ApiProperty({
        required: required,
        type: Number,
        isArray: isArray,
        default: defaultValue,
        minimum: minimun,
        maximum: maximum,
      }),
      required ? IsDefined() : IsOptional(),
      IsNumber(numOpt, { each: isArray }),
    ];
    if (minimun) decorators.push(Min(minimun));
    if (maximum) decorators.push(Max(maximum));
    return applyDecorators(...decorators);
  }

  static String({
    required = false,
    isArray = false,
    defaultValue,
    maxLength,
    minLength,
  }: DecoratorOptions = {}) {
    const decorators: PropertyDecorator[] = [
      ApiProperty({
        required: required,
        type: String,
        isArray: isArray,
        default: defaultValue,
        maxLength: maxLength,
        minLength: minLength,
      }),
      required ? IsDefined() : IsOptional(),
      IsString({ each: isArray }),
    ];
    if (maxLength) decorators.push(MaxLength(maxLength));
    if (minLength) decorators.push(MinLength(minLength));
    return applyDecorators(...decorators);
  }

  static Password({
    required = false,
    isArray = false,
    defaultValue,
    maxLength,
    minLength,
  }: DecoratorOptions = {}) {
    return applyDecorators(
      ApiProperty({
        required: required,
        type: String,
        isArray: isArray,
        default: defaultValue,
        maxLength: maxLength,
        minLength: minLength,
      }),
      required ? IsDefined() : IsOptional(),
      IsStrongPassword(),
    );
  }

  static Email({
    required = false,
    isArray = false,
    defaultValue,
  }: DecoratorOptions = {}) {
    return applyDecorators(
      ApiProperty({
        required: required,
        type: String,
        isArray: isArray,
        default: defaultValue,
      }),
      required ? IsDefined() : IsOptional(),
      IsEmail({}, { each: isArray }),
    );
  }

  static Phone({
    required = false,
    isArray = false,
    defaultValue,
  }: DecoratorOptions = {}) {
    return applyDecorators(
      ApiProperty({
        required: required,
        type: String,
        isArray: isArray,
        default: defaultValue,
      }),
      required ? IsDefined() : IsOptional(),
      IsPhoneNumber(),
    );
  }

  static Enum({
    required = false,
    isArray = false,
    defaultValue,
    enumType,
  }: DecoratorOptions = {}) {
    return applyDecorators(
      ApiProperty({
        required: required,
        enum: enumType,
        isArray: isArray,
        default: defaultValue,
      }),
      required ? IsDefined() : IsOptional(),
      IsEnum(enumType, { each: isArray }),
    );
  }

  static Date({
    required = false,
    isArray = false,
    defaultValue,
  }: DecoratorOptions = {}) {
    return applyDecorators(
      ApiProperty({
        required: required,
        type: Date,
        isArray: isArray,
        default: defaultValue,
      }),
      required ? IsDefined() : IsOptional(),
      IsDate({ each: isArray }),
      Type(() => Date),
    );
  }

  static Boolean({
    required = false,
    isArray = false,
    defaultValue,
  }: DecoratorOptions = {}) {
    return applyDecorators(
      ApiProperty({
        required: required,
        type: Boolean,
        isArray: isArray,
        default: defaultValue,
      }),
      required ? IsDefined() : IsOptional(),
      IsBoolean({ each: isArray }),
    );
  }

  static ValidateNested({
    required = false,
    isArray = false,
    defaultValue,
  }: DecoratorOptions = {}) {
    return applyDecorators(
      ApiProperty({
        required: required,
        type: Boolean,
        isArray: isArray,
        default: defaultValue,
      }),
      required ? IsDefined() : IsOptional(),
      ValidateNested(),
    );
  }
}
