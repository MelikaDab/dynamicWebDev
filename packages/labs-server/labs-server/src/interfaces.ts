export interface ImageDocument {
  _id: string;
  src: string;
  name: string;
  author: string;
  likes: number;
}

export interface AuthorDocument {
  _id: string;
  name: string;
}

export interface ImageWithAuthor {
    _id: string;
    src: string;
    name: string;
    likes: number;
    author: {
        name: string;
    } | null;
}