export interface Course {
    id: string;
    title: string;
    slug: string;
    description: string;
    level: 'beginner' | 'intermediate' | 'advanced';
    category: string;
    publishedAt: string | null;
    imageUrl: string;
}