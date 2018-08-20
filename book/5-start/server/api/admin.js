import express from 'express';
import Book from '../models/Book';

const router = express.Router();


// router level middleware
// when the client calls any API endpoint that 
// contains /api/v1/admin as a base, 
// the function inside router.use() will run
router.use((req, res, next) => {
    if (!req.user || !req.user.isAdmin) {
        res.status(401).json({ error: 'Unauthorized access'});
        return;
    }
    next();
});

// actual route
// get a list of all books
router.get('/books', async (req, res) => {
    console.log('[admin.js] Fetching Books...');
    //console.log(Book);
    try {
        const books = await Book.list();
        res.json(books);
    } catch (err) {
        console.log('[admin.js] Error Fetching Books... ' + err.message);
        res.json({ error: err.message || err.toString() });
    }
});

export default router;



