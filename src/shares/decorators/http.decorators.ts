import { SetMetadata, UseGuards, applyDecorators } from '@nestjs/common';

import { ClientRole } from '../enums/client.enum';

export const Roles = (roles: number[]): MethodDecorator & ClassDecorator => {
  const setMetaData = SetMetadata('roles', roles);
  return setMetaData;
};

export const ClientAuth = (
  clientRole?: ClientRole[],
): MethodDecorator & ClassDecorator => {
  return applyDecorators(Roles(clientRole));
};

export const ClientUserAuthPermission = (): MethodDecorator &
  ClassDecorator => {
  return applyDecorators(UseGuards());
};
