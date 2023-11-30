const { nanoid } = require('nanoid')
const books = require('./books')

//API dapat menyimpan buku
const addBooksHandler = (request, h) => {
    const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload
    const id = nanoid(16)
    const finished = pageCount === readPage
    const insertedAt = new Date().toISOString
    const updateAt = insertedAt

    const existingBook = books.find((book) => book.name !== name) //sebelumnya !==
    if(existingBook) {
        const response = h.response ({
            status: 'fail',
            message: 'Gagal menambahkan buku. Mohon isi nama buku'
        })
        response.code(400)
        return response
    }

    const failedReadPage = readPage > pageCount
    if(failedReadPage) {
        const response = h.response ({
            status: 'fail',
            message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount'
        })
        response.code(400)
        return response
    }

    const newBook = {
        id, name, year, author, summary, publisher, pageCount, readPage, finished, reading, insertedAt, updateAt
    }

    books.push(newBook)

    const isSuccess = books.find((book) => book.id === id)
    
    if(isSuccess) {
        const response = h.response ({
            status: 'success',
            message: 'Buku berhasil ditambahkan',
            data: {
                bookId: id
            }
        })
        response.code(201)
        return response
    }
}

//API dapat menampilkan seluruh buku
const getAllBooksHandler = (request, h) => {
    const { reading, name, finished } = request.query

    let filteredBooks = books.map((book) => ({
        id: book.id,
        name: book.name,
        publisher: book.publisher
    }))

    if (reading !== undefined) {
        filteredBooks = filteredBooks.filter((book) => book.reading === reading)
    }

    if (finished !== undefined) {
        filteredBooks = filteredBooks.filter((book) => book.finished === finished)
    }

    if (name !== undefined) {
        filteredBooks = filteredBooks.filter((book) => book.name.toLowerCase().includes(name.toLowerCase()))
    }

    const response = h.response({
        status: 'success',
        data: {
            books: filteredBooks
        }
    })

    response.code(200)
    return response
}

//API dapat menampilkan buku secara detail
const getAllBooksByIdHandler = (request, h) => {
    const { bookId } = request.params
    const book = books.filter((book) => book.id === bookId)[0] //detailsBookId

    if(!book) {
        const response = h.response ({
            status: 'fail',
            message: 'Buku tidak ditemukan'
        })
        response.code(404)
        return response
    } 
    const response = h.response ({
        status: 'success',
        data: {
            book
        }
    })
    response.code(200)
    return response
}


//API dapat mengubah data buku
const changeBooksByIdHandler = (request, h) => {
    const { bookId } = request.params
    const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload

    const noNameBookFailed = name === undefined
    if(noNameBookFailed) { 
        const response = h.response ({
            status: 'fail',
            message: 'Gagal memperbarui buku. Mohon isi nama buku'
        })
        response.code(400)
        return response
    }

    const readPageFailed = readPage > pageCount
    if(readPageFailed) {
        const response = h.response ({
            status: 'fail',
            message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount'
        })
        response.code(400)
        return response
    }

    const bookToUpdate = books.find((book) => book.id === bookId)
    if(!bookToUpdate) {
        const response = h.response ({
            status: 'fail',
            message: 'Gagal memperbarui buku. Id tidak ditemukan'
        })
        response.code(404)
        return response
    }

    const index = books.findIndex((book) => book.id === bookId)
    if(index !== -1) {
        books[index] = {
            ...books[index],
            name,
            year,
            author,
            summary,
            publisher,
            pageCount,
            readPage,
            reading,
        }
        return h.response ({
            status: 'success',
            message: 'Buku berhasil diperbarui'
        }).code(200)
    }
}

//API dapat menghapus buku
const deleteBooksByIdHandler = (request, h) => {
    const { bookId } = request.params

    const bookIdFailed1 = books.find((book) => book.id === bookId)
    if(!bookIdFailed1) { 
        const response = h.response ({
            status: 'fail',
            message: 'Buku gagal dihapus. Id tidak ditemukan'
        })
        response.code(404)
        return response
    }

    const index = books.findIndex((book) => book.id === bookId)
    if(index != -1) {
        books.splice(index, 1)
        const response = h.response ({
            status: 'success',
            message: 'Buku berhasil dihapus'
        })
        response.code(200)
        return response
    }
}


module.exports = {addBooksHandler, getAllBooksHandler, getAllBooksByIdHandler, changeBooksByIdHandler, deleteBooksByIdHandler}