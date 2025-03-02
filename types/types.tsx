export interface Todo {
  title: string;
  completed: boolean;
  _id: string;
}

export enum Theme {
  LIGHT = 'light',
  DARK = 'dark',
  SYSTEM = 'system'
}
