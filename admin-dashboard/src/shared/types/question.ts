export type QuestionType = 'MULTIPLE_CHOICE' | 'TRUE_FALSE' | 'SHORT_ANSWER';

export interface Option {
    id?: string;
    text: string;
    isCorrect: boolean;
}

export interface Question {
    id?: string;
    text: string;
    type: QuestionType;
    difficulty: 'easy' | 'medium' | 'hard';
    options: Option[];
}