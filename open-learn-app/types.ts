export interface Badge {
    id: string;
    name: string;
    description: string;
    icon: string;
}

export interface ProgressResponse {
    message: string;
    newLevel: number | null;
    awardedBadges: Badge[];
}

export interface LessonProgressInfo {
    id: string;
}

export interface LessonInfo {
    id: string;
    title: string;
    order: number;
    progress: LessonProgressInfo[];
}

export interface ModuleInfo {
    id: string;
    title: string;
    order: number;
    lessons: LessonInfo[];
}

export interface CourseInfo {
    id: string;
    title: string;
    slug: string;
    description: string | null;
    level: string;
    category: string;
    modules: ModuleInfo[];
}

export interface LessonDetails {
    id: string;
    title: string;
    order: number;
    content: string | null;
    moduleId: string;
}

export interface LessonApiResponse {
    lesson: LessonDetails;
    course: CourseInfo;
}

export type CourseDetailApiResponse = CourseInfo | null