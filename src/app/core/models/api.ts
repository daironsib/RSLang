export interface IUser {
  name: string,
  email: string,
  password: string
}

export interface IUserLS {
  id: string,
  name: string
}

export interface IRegister {
  email: string,
  id: string,
  name: string
}

export interface ILogin {
  message: string,
  name: string,
  refreshToken: string,
  token: string,
  userId: string,
}

export interface IWord {
  id: string,
  group: number,
  page: number,
  word: string,
  image: string,
  audio: string,
  audioMeaning: string,
  audioExample: string,
  textMeaning: string,
  textExample: string,
  transcription: string,
  textExampleTranslate: string,
  textMeaningTranslate: string,
  wordTranslate: string
}

export interface IFilterResponse {
  paginatedResults: IWord[],
  totalCount: [];
}

export interface IUserWords {
  id: string,
  wordId: string,
  difficulty: string,
  optional: object
}

export interface IStatistics {
  learnedWords: number,
  optional: object
}

export interface ISettings {
  wordsPerDay: number,
  optional: object
}
