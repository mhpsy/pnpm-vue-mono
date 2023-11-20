export type ResDataNormal<T> = null | T;
export interface IResData<T = any> {
    code: number;
    data: ResDataNormal<T>;
    msg: string;
    status?: number;
}
