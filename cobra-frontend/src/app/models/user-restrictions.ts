import { EPermission } from 'src/app/models/role';

export class UserRestrictions {
  userId: string;
  permissionDeniedCode: EPermission;
}