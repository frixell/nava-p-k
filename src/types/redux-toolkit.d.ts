declare module '@reduxjs/toolkit' {
  export type PayloadAction<P = any> = { type: string; payload: P };
  export function configureStore(options: any): any;
  export function createSlice(options: any): { actions: Record<string, (...args: any[]) => any>; reducer: any };
  export function createAsyncThunk<Returned = any, ThunkArg = void>(
    typePrefix: string,
    payloadCreator: (arg: ThunkArg, thunkAPI?: any) => Promise<Returned> | Returned
  ): (arg: ThunkArg) => any;
}
