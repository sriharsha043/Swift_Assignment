import { MongoClient, Collection } from 'mongodb';
import { User, Post, Comment } from './types';

const url = 'mongodb://localhost:27017';
const dbName = 'node_assignment';

export class Database {
    private client: MongoClient;
    private static instance: Database;

    private constructor() {
        this.client = new MongoClient(url);
    }

    static async getInstance(): Promise<Database> {
        if (!Database.instance) {
            Database.instance = new Database();
            await Database.instance.connect();
        }
        return Database.instance;
    }

    private async connect() {
        try {
            await this.client.connect();
            console.log('Connected to MongoDB');
        } catch (error) {
            console.error('Failed to connect to MongoDB:', error);
            throw error;
        }
    }

    get users(): Collection<User> {
        return this.client.db(dbName).collection('users');
    }

    get posts(): Collection<Post> {
        return this.client.db(dbName).collection('posts');
    }

    get comments(): Collection<Comment> {
        return this.client.db(dbName).collection('comments');
    }

    async close() {
        await this.client.close();
    }
}
