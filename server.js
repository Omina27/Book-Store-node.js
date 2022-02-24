const http = require ('http')

const Books = [
    {
        id: 1,
        title: "Sariq devni minib",
        author: "Xudoyberdi To'xtaboyev",
        publishTime: 2010,
        category: "fantastic"
    },
    {
        id: 2,
        title: "Sherlock Xolms",
        author: "Artur Conan Doyle",
        publishTime: 1978,
        category: "detective"
    }
]

const server = http.createServer((req, res) => {
    const route = req.url.split('/')

    if (req.method == 'DELETE') {
        if (route[1] == 'books' && route[2]) {
            const oldBooks = Books.findIndex(e => e.id == route[2])

            Books.splice(oldBooks, 1)

            res.end('DELETE')
        }


    }else if(route[1] == '' && req.method == "POST"){
        let bookInfo = ''
        req.on('data', (chunk) => (bookInfo += chunk))
        req.on('end', ()=> {
            bookInfo = JSON.parse(bookInfo)
            const bookRend = {
                id: Books[Books.length - 1].id + 1,
                title: bookInfo.title,
                author: bookInfo.author,
                publishTime: bookInfo.publishTime,
                category: bookInfo.category
            }
            Books.push(bookRend)
        })
        res.writeHead(200, { "Content-Type": "application/json" });
        res.write(JSON.stringify("New book is added"));
        return res.end("ok");
        

    }else if (req.method == "GET") {
        if (route[1] == 'books' && route[2]) {
            const categoryFilter = Books.filter((e)=> {
                if (e.category == route[2]) {
                    return e
                }
            })
         
            res.writeHead(200, { "Content-Type" : "application/json" })
            res.end(JSON.stringify(categoryFilter))
        }

        if (route[1] == "books") {
            res.writeHead(200, { "Content-Type" : "application/json" })
            res.end(JSON.stringify(Books))

        }



    }else if(req.method == 'PUT'){
        if (route[1] == 'updateBooks' && route[2]) {
            
            const newBook = {}
            const oldBooks = Books.find(e => e.id == route[2])
            const index = Books.findIndex(e => e.id == route[2])
    
            req.on('data',chunk => {
                const { newBooktitle } = JSON.parse(chunk)
                newBook.id = oldBooks.id
                newBook.title = newBooktitle
                newBook.author = oldBooks.author
                newBook.publishTime = oldBooks.publishTime
                newBook.category = oldBooks.category

            
                Books.splice(index, 1, newBook)
                
            })
        }
        res.end('PUT')
    }

   
})
server.listen(3000, () => {
    console.log(3000);
})




