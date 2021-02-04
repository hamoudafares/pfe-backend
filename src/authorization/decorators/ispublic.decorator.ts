import { SetMetadata } from '@nestjs/common';

//decorator used to make a route public with global Auth on
//@Public() => no need authentication to access the route
export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
