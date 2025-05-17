export class ResponseDto<T> {
  constructor(
    public readonly status: number,
    public readonly success: boolean,
    public readonly message: string,
    public readonly data: T,
  ) {}
} 