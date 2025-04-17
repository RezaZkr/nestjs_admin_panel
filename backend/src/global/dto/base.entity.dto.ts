export class BaseEntityDto {
  constructor(partial: Partial<any>) {
    Object.assign(this, partial);
  }
}
