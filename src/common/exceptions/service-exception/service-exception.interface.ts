import { IServiceExceptionCategory } from "./exception-category.type";

export interface IServiceException<T> {
  message: string;
  code?: string;
  category?: IServiceExceptionCategory;
  details?: T;
}
