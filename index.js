const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const helmet = require('helmet');
const validator = require('validator');
const mysql = require('mysql');
const authenticateToken = require('./middleware/authenticateToken');

const app = express();
app.use(express.json());
app.use(helmet());

app.use(helmet.contentSecurityPolicy({
    directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        objectSrc: ["'none'"],
        upgradeInsecureRequests: [],
    }
}));

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'userdb'
});

// LOGIN ROUTE
app.post('/login', async function(req, res) {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).send("Missing credentials");
    }

    pool.query('SELECT * FROM admin WHERE username = ?', [username], async function(err, rows) {
        if (err || rows.length === 0) {
            return res.status(400).send("User not found");
        }

        const isMatch = await bcrypt.compare(password, rows[0].password);
        if (isMatch) {
            const token = jwt.sign(
                { id: rows[0].id, username: rows[0].username },
                'your-secret-key',
                { expiresIn: '1h' }
            );
            res.status(200).send({
                message: "Authentication successful",
                token: token
            });
        } else {
            return res.status(401).send("Invalid credentials");
        }
    });
});

// CREATE USER
app.post('/create', authenticateToken, function(req, res) {
    var userData = {
        name: req.body.Name,
        studentID: req.body.StudentID,
        department: req.body.Department
    };
    pool.query('INSERT INTO user SET ?', userData, function(err) {
        if (err) return res.status(400).send("Unable to insert into database");
        res.status(200).send("User Added");
    });
});

// LIST USERS
app.get('/list', authenticateToken, function(req, res) {
    pool.query('SELECT * FROM user', (err, result) => {
        if (err) return res.status(400).send("Error in Connection");
        res.status(200).send(result);
    });
});

// DELETE USER
app.delete('/delete/:id', authenticateToken, function(req, res) {
    pool.query('DELETE FROM user WHERE studentID = ?', [req.params.id], (err) => {
        if (err) return res.status(400).send("User not found");
        pool.query('SELECT * FROM user', (err, result) => {
            if (err) return res.status(400).send("Error in Connection");
            res.status(200).send(result);
        });
    });
});

app.listen(5000, () => {
    console.log("Server running on port 5000");
});