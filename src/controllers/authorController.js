// const { user: authUser } = require('./authController');
const { con } = require('../database/dbconfig');
const { addAuthorToBookLib,
        searchAuthorLib,
        getAuthorLib,
        updateAuthorLib } = require('../lib/authorLib');

const getAllAuthor = (req, res) => {
    con.query('SELECT * FROM authors', (err, results) => {
        res.status(200).json({results});
    });
}

const getAuthor = async(req, res) => {
    // Route to get books by author
    const { id } = req.params;
    const results = await searchAuthorLib(req,res,id);

        if (results.length === 0) {
            res.status(404).send('Author not found');
            return;
        }
        else{
        getAuthorLib(req,res,id,results)
        }   
}

const updateAuthor = async(req,res)=>{
    const { id } = req.params;
    const { author_name, age, about } = req.body;
    // Create object to store the fields to be updated
    const updateFields = {    };
    if (author_name) {
        updateFields.author_name = author_name;
    }
    if (age) {
        updateFields.age = age;
    }
    if (about){
        updateFields.about = about; 
    }
    updateAuthorLib(updateFields, id, req, res);


}

const addAuthorToBook = (req, res) => {
    const { id } = req.params;
    const { author_name } = req.body;
    const addAuthorFields = {
        id: id,
        author_name: author_name
    };
    addAuthorToBookLib(req, res, addAuthorFields);
};



module.exports = { getAuthor, getAllAuthor, addAuthorToBook, updateAuthor }