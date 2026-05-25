import { applyDecorators } from '@nestjs/common';
import {
  ClassConstructor,
  Transform,
  Type,
  plainToClass,
} from 'class-transformer';
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
  validateSync,
} from 'class-validator';
import { writeFileSync } from 'fs';
import { EnvOptions, IEnvData } from './decorator.interfaces';

const envData: { [key: string]: string } = {};
function EnvExample({
  type,
  required,
  addToExample = true,
}: IEnvData): PropertyDecorator {
  return (target: any, property: string | symbol) => {
    if (!addToExample) return;
    const str = [type, required ? 'required' : 'optional']
      .filter((el) => el)
      .join('-');
    envData[property as string] = `<${str}>`;
  };
}

export class EnvDecorators {
  static Int(data?: EnvOptions) {
    return applyDecorators(
      data?.required ? IsDefined() : IsOptional(),
      IsInt({ each: data?.isArray }),
      Type(() => Number),
      EnvExample({
        type: 'int',
        required: data?.required,
        addToExample: data?.addToExample,
      }),
    );
  }

  static Number(data?: EnvOptions) {
    return applyDecorators(
      data?.required ? IsDefined() : IsOptional(),
      IsNumber(data?.numOpt, { each: data?.isArray }),
      Type(() => Number),
      EnvExample({
        type: 'number',
        required: data?.required,
        addToExample: data?.addToExample,
      }),
    );
  }

  static String(data?: EnvOptions) {
    return applyDecorators(
      data?.required ? IsDefined() : IsOptional(),
      IsString({ each: data?.isArray }),
      EnvExample({
        type: 'string',
        required: data?.required,
        addToExample: data?.addToExample,
      }),
    );
  }

  static Email(data?: EnvOptions) {
    return applyDecorators(
      data?.required ? IsDefined() : IsOptional(),
      IsEmail({}, { each: data?.isArray }),
      EnvExample({
        type: 'email',
        required: data?.required,
        addToExample: data?.addToExample,
      }),
    );
  }

  static Phone(data?: EnvOptions) {
    return applyDecorators(
      data?.required ? IsDefined() : IsOptional(),
      IsPhoneNumber(),
      EnvExample({
        type: 'phone',
        required: data?.required,
        addToExample: data?.addToExample,
      }),
    );
  }

  static Enum(data?: EnvOptions) {
    return applyDecorators(
      data?.required ? IsDefined() : IsOptional(),
      IsEnum(data?.enumType, { each: data?.isArray }),
      EnvExample({
        type: 'enum',
        required: data?.required,
        addToExample: data?.addToExample,
      }),
    );
  }

  static Date(data?: EnvOptions) {
    return applyDecorators(
      data?.required ? IsDefined() : IsOptional(),
      IsDate({ each: data?.isArray }),
      Type(() => Date),
      EnvExample({
        type: 'date',
        required: data?.required,
        addToExample: data?.addToExample,
      }),
    );
  }

  static Boolean(data?: EnvOptions) {
    return applyDecorators(
      data?.required ? IsDefined() : IsOptional(),
      IsBoolean({ each: data?.isArray }),
      Transform((o) =>
        typeof o.value == 'string'
          ? o.value?.toLocaleLowerCase() == 'true'
          : o.value,
      ),
      EnvExample({
        type: 'boolean',
        required: data?.required,
        addToExample: data?.addToExample,
      }),
    );
  }

  static init<T extends object>(cls: ClassConstructor<T>) {
    const data = plainToClass(cls, process.env);
    const err = validateSync(data, {
      whitelist: true,
    });
    if (err.length) {
      const errors = err
        .flatMap((el) => Object.values(el.constraints!))
        .join('\n');
      throw new Error('ENV VALIDATION ERRORS:\n' + errors);
    }
    return data;
  }

  static PrintEnvExample(fileName = '.env.example') {
    writeFileSync(
      fileName,
      Object.keys(envData)
        .map((key) => `${key}=${envData[key]}`)
        .join('\n'),
    );
  }
}
