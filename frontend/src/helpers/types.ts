// global fronent types for models
import type { User } from '../../../backend/src/models/user';
import type { ErrorLog } from '../../../backend/src/models/ErrorLog';
//
//
export type TUser = User & { _id: string };
export type TErrorLog = ErrorLog & { timestamp: string; _id: string };

// export type { DescT };
