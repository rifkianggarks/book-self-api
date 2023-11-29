const { addBooksHandler, getAllBooksHandler, getAllBooksByIdHandler, changeBooksByIdHandler, deleteBooksByIdHandler } = require('./handler')

const routes = [
    {
        method: 'POST',
        path: '/books',
        handler: addBooksHandler
    },

    {
        method: 'GET',
        path: '/books',
        handler: getAllBooksHandler
    },

    {
        method: 'GET',
        path: '/books/{bookId}',
        handler: getAllBooksByIdHandler
    },

    {
        method: 'PUT',
        path: '/books/{bookId}',
        handler: changeBooksByIdHandler
    },

    {
        method: 'DELETE',
        path: '/books/{bookId}',
        handler: deleteBooksByIdHandler
    }
 ]

 module.exports = routes