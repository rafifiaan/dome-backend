import express from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { loginUser, getAllUsers, getUserById, requestPasswordReset, resetPassword } from './src/services/userService';
import { getDashboardSummary } from './src/services/dashboardService'; 
import { getAllKaryawan, getKaryawanById } from './src/services/employeeService';
import { validateLogin } from './src/validators/loginValidator';
import authenticate from './middleware/authenticate';
import fs from 'fs'; // Impor fs untuk membaca file/direktori
import cors from 'cors';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use((req, res, next) => {
    console.log(`Request received: ${req.method} ${req.url}`);
    next();
});

// Log untuk memeriksa apakah drizzle-orm terpasang dengan benar
app.listen(port, () => {
    console.log(`Yeay! Server is successfully running on port: ${port}`);
    
    // Log directory contents
    console.log('Checking node-postgres directory contents...');
    fs.readdir('./node_modules/drizzle-orm/node-postgres', (err, files) => {
        if (err) {
            console.error('Error reading directory:', err);
        } else {
            console.log('Files in node-postgres:', files);
        }
    });
});

  // Endpoint untuk merespon "Hello"
app.get('/', (req, res) => {
    res.send('Hello World!');
})

// Endpoint get all users
app.get('/users', async (req, res) => {
    try {
        const users = await getAllUsers();
        console.log(`Successfully retrieved ${users.length} user(s).`);
        res.json({ users });
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: 'Error fetching users' });
    }
});
  
app.get('/users/:id', async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await getUserById(userId);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({ user });
    } catch (error) {
        console.error('Error fetching user by ID:', error);
        res.status(500).json({ error: 'Error fetching user data' });
    }
});

// Endpoint login
app.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        validateLogin({ username, password });

        // Authenticate user
        const user = await loginUser(username, password);

        // Generate a JWT token
        const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '12h' });

        res.json({ message: 'Login successful', user, token });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});


// Endpoint to request password reset
app.post('/forgot-password', async (req, res) => {
    try {
        const { username } = req.body; 
        await requestPasswordReset(username);
        res.json({ message: 'Password reset email sent' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}); 

app.get('/reset/:token', async (req, res) => {
    const { token } = req.params;
    const { username } = req.query;

    if (!username) {
        return res.status(400).send('Username is required');
    }

    // reset password form 
    res.send(`
        <form action="/reset/${token}" method="POST">
            <input type="hidden" name="token" value="${token}" />
            <input type="hidden" name="username" value="${username}" /> 
            <label for="newPassword">New Password:</label>
            <input type="password" name="newPassword" required />
            <button type="submit">Reset Password</button>
        </form>
    `);
});
  
app.post('/reset/:token', async (req, res) => {
    const { token } = req.params;
    const { newPassword, username } = req.body; 

    console.log('Received token:', token);
    console.log('Received new password:', newPassword);
    console.log('Received username:', username);
    
    try {
        // Check if token and new password are provided
        if (!token || !newPassword || !username) {
            return res.status(400).json({ error: 'Token, username, and new password are required' });
        }

        // Call resetPassword service function
        await resetPassword(token, newPassword, username);
        res.status(200).send('Congratulations! Your password has been successfully reset.');
    } catch (error) {
        res.status(400).send(error.message);
    }
});

// Endpoint for home dashboard (accessible only after login)
app.get('/dashboard', authenticate, async (req, res) => {
    try {
        const dashboardSummary = await getDashboardSummary();
        console.log('Successfully retrieved dashboard summary.');
        res.json({ dashboardSummary });
    } catch (error) {
        console.error('Error retrieving dashboard summary:', error);
        res.status(500).json({ error: 'Error retrieving dashboard summary' });
    }
});

// Endpoint untuk mendapatkan daftar karyawan  
app.get('/karyawan', authenticate, async (req, res) => {  
    try {  
        const results = await getAllKaryawan();  
        res.json(results);  
    } catch (error) {  
        console.error('Error fetching karyawan:', error);  
        return res.status(500).json({ error: 'Internal server error' });  
    }  
});  
  
app.get('/karyawan/:id', authenticate, async (req, res) => {  
    try {  
        const karyawanId = req.params.id;  
        const karyawan = await getKaryawanById(karyawanId);  

        res.json(karyawan);  
    } catch (error) {  
        console.error('Error fetching karyawan by ID:', error);  
        return res.status(500).json({ error: error.message });  
    }  
});

export default createRequestHandler(app);