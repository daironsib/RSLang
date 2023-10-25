export interface SprintGameWord {
    wordId: string,
    word: string,
    translation: string,
    correctTranslation: string,
    transcription: string,
    audio: string
}

export interface SprintGameWordStatistic {
    wordId: string,
    word: string,
    isCorrectAnswer: boolean,
    translation: string,
    transcription: string,
    audio: string
}
