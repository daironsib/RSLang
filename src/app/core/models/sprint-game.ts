export interface SprintGameWord {
    word: string,
    translation: string,
    correctTranslation: string,
    transcription: string
}

export interface SprintGameWordStatistic {
    word: string,
    isCorrectAnswer: boolean,
    translation: string,
    transcription: string
}