export interface ImageDocument {
  _id: string;
  src: string;
  name: string;
  author: string;
  likes: number;
}


export interface UserDocument {
  _id: string;
  username: string;
  email: string;
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