import {
  BadRequestException,
  ValidationError,
  ValidationPipe,
} from '@nestjs/common';

type ValidationErrorResponse = {
  field: string;
  errors: string[];
};

function formatErrors(errors: ValidationError[]): ValidationErrorResponse[] {
  return errors.flatMap((error) => {
    const currentErrors: ValidationErrorResponse[] = error.constraints
      ? [
          {
            field: error.property,
            errors: Object.values(error.constraints),
          },
        ]
      : [];

    const childrenErrors = error.children?.length
      ? formatErrors(error.children)
      : [];

    return [...currentErrors, ...childrenErrors];
  });
}

export const appValidationPipe = new ValidationPipe({
  whitelist: true,
  forbidNonWhitelisted: true,
  transform: true,
  exceptionFactory: (errors: ValidationError[]) => {
    return new BadRequestException({
      message: 'Error de validación',
      errors: formatErrors(errors),
    });
  },
});
