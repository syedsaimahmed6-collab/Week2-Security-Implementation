# Week2-Security-Implementation
Week 2 - Implementing security fixes (bcrypt, JWT, Helmet.js)
# Week 2 – Implementing Security Measures

**Intern:** Syed Saim Ahmed
**ID:** DHC-1014

## Overview
Implemented security fixes based on vulnerabilities found in Week 1.

## What Was Fixed
- Input validation using validator library
- Password hashing using bcrypt
- JWT token-based authentication
- Security headers using Helmet.js

## How to Run
1. Clone the repo
   git clone https://github.com/TumharaUsername/Week2-Security-Implementation
2. Install dependencies
   npm install
3. Start the server
   npm start
4. Open browser at http://localhost:5000

## Dependencies
- express
- bcrypt
- jsonwebtoken
- helmet
- validator
- mysql
- winston

## Files
- index.js — main server file
- middleware/authenticateToken.js — JWT middleware
- Task02_Week2_SyedSaimAhmed_DHC1014.docx — full report
