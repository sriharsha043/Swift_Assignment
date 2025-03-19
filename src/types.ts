export interface Geo {
    lat: string;
    lng: string;
}

export interface Address {
    street: string;
    suite: string;
    city: string;
    zipcode: string;
    geo: Geo;
}

export interface Company {
    name: string;
    catchPhrase: string;
    bs: string;
}

export interface Comment {
    id: number;
    name: string;
    email: string;
    body: string;
    postId?: number;
}

export interface Post {
    id: number;
    title: string;
    body: string;
    userId?: number;
    comments: Comment[];
}

export interface User {
    id: number;
    name: string;
    username: string;
    email: string;
    address: Address;
    phone: string;
    website: string;
    company: Company;
    posts: Post[];
}
