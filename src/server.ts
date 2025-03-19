import { createServer, IncomingMessage, ServerResponse } from 'http';
import { Database } from './db';
import { User, Post, Comment } from './types';


const PORT = 3000;

async function fetchFromJsonPlaceholder(endpoint: string) {
    const response = await fetch(`https://jsonplaceholder.typicode.com${endpoint}`);
    return await response.json();
}

async function handleLoad(res: ServerResponse) {
    try {
        const db = await Database.getInstance();
        
        // Fetch users, posts, and comments
        const users: User[] = await fetchFromJsonPlaceholder('/users');
        const posts: Post[] = await fetchFromJsonPlaceholder('/posts');
        const comments: Comment[] = await fetchFromJsonPlaceholder('/comments');

        // Process and store data
        const processedUsers = users.slice(0, 10).map(user => ({
            ...user,
            posts: posts
                .filter(post => post.userId === user.id)
                .map(post => ({
                    ...post,
                    comments: comments.filter(comment => comment.postId === post.id)
                }))
        }));

        // Clear existing data
        await db.users.deleteMany({});
        await db.posts.deleteMany({});
        await db.comments.deleteMany({});

        // Insert new data
        await db.users.insertMany(processedUsers);

        res.writeHead(200);
        res.end();
    } catch (error) {
        console.error('Error in /load:', error);
        res.writeHead(500);
        res.end(JSON.stringify({ error: 'Internal Server Error' }));
    }
}

async function handleGetUser(userId: string, res: ServerResponse) {
    try {
        const db = await Database.getInstance();
        const user = await db.users.findOne({ id: parseInt(userId) });

        if (!user) {
            res.writeHead(404);
            res.end(JSON.stringify({ error: 'User not found' }));
            return;
        }

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(user));
    } catch (error) {
        console.error('Error in GET /users/:userId:', error);
        res.writeHead(500);
        res.end(JSON.stringify({ error: 'Internal Server Error' }));
    }
}

async function handleDeleteAllUsers(res: ServerResponse) {
    try {
        const db = await Database.getInstance();
        await db.users.deleteMany({});
        res.writeHead(200);
        res.end();
    } catch (error) {
        console.error('Error in DELETE /users:', error);
        res.writeHead(500);
        res.end(JSON.stringify({ error: 'Internal Server Error' }));
    }
}

async function handleDeleteUser(userId: string, res: ServerResponse) {
    try {
        const db = await Database.getInstance();
        const result = await db.users.deleteOne({ id: parseInt(userId) });

        if (result.deletedCount === 0) {
            res.writeHead(404);
            res.end(JSON.stringify({ error: 'User not found' }));
            return;
        }

        res.writeHead(200);
        res.end();
    } catch (error) {
        console.error('Error in DELETE /users/:userId:', error);
        res.writeHead(500);
        res.end(JSON.stringify({ error: 'Internal Server Error' }));
    }
}

async function handlePutUser(req: IncomingMessage, res: ServerResponse) {
    try {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', async () => {
            try {
                const userData: User = JSON.parse(body);
                const db = await Database.getInstance();

                const existingUser = await db.users.findOne({ id: userData.id });
                if (existingUser) {
                    res.writeHead(409);
                    res.end(JSON.stringify({ error: 'User already exists' }));
                    return;
                }

                await db.users.insertOne(userData);
                res.writeHead(201, {
                    'Content-Type': 'application/json',
                    'Location': `/users/${userData.id}`
                });
                res.end(JSON.stringify(userData));
            } catch (error) {
                console.error('Error parsing request body:', error);
                res.writeHead(400);
                res.end(JSON.stringify({ error: 'Invalid request body' }));
            }
        });
    } catch (error) {
        console.error('Error in PUT /users:', error);
        res.writeHead(500);
        res.end(JSON.stringify({ error: 'Internal Server Error' }));
    }
}

const server = createServer(async (req, res) => {
    const url = new URL(req.url || '', `http://${req.headers.host}`);
    const path = url.pathname;

    try {
        if (path === '/load' && req.method === 'GET') {
            await handleLoad(res);
        } else if (path === '/users' && req.method === 'DELETE') {
            await handleDeleteAllUsers(res);
        } else if (path.match(/^\/users\/\d+$/) && req.method === 'DELETE') {
            const userId = path.split('/')[2];
            await handleDeleteUser(userId, res);
        } else if (path.match(/^\/users\/\d+$/) && req.method === 'GET') {
            const userId = path.split('/')[2];
            await handleGetUser(userId, res);
        } else if (path === '/users' && req.method === 'PUT') {
            await handlePutUser(req, res);
        } else {
            res.writeHead(404);
            res.end(JSON.stringify({ error: 'Not Found' }));
        }
    } catch (error) {
        console.error('Server error:', error);
        res.writeHead(500);
        res.end(JSON.stringify({ error: 'Internal Server Error' }));
    }
});

server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
