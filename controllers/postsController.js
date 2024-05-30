const fs = require('fs');
const path = require('path');
const multer = require('multer');
const posts = require('../data/data.json');

// Configurazione multer per salvare le immagini caricate
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/imgs/posts'); // Directory dove salvare le immagini caricate
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + '-' + file.originalname); // Nome unico per evitare conflitti
    }
});
const upload = multer({ storage: storage });

// Funzione per inviare una risposta in vari formati
const sendResponse = (req, res, data, htmlGenerator) => {
    res.format({
        'application/json': () => res.json(data), // Risposta JSON
        'text/html': () => res.send(htmlGenerator(data)), // Risposta HTML
        'default': () => res.status(406).send('Not Acceptable') // Risposta predefinita per formati non supportati
    });
};

// Funzione per scrivere i dati aggiornati nel file JSON
const writeDataToFile = (filePath, data, callback) => {
    fs.writeFile(filePath, JSON.stringify(data, null, 2), (err) => {
        if (err) {
            console.error('Errore durante il salvataggio dei dati:', err);
            return callback(err); // Chiamata al callback con errore
        }
        console.log('Dati salvati correttamente.');
        callback(null); // Chiamata al callback senza errori
    });
};

// Funzione per generare uno slug a partire da una stringa
const generateSlug = (text) => {
    return text
        .toString()
        
};

// Funzione per creare uno slug univoco
const createSlug = (title, allPosts) => {
    let slug = generateSlug(title); // Genera uno slug base
    let uniqueSlug = slug;
    let count = 1;
    while (allPosts.find(post => post.slug === uniqueSlug)) {
        uniqueSlug = `${slug}-${count}`; // Aggiungi un numero allo slug se non è univoco
        count++;
    }
    return uniqueSlug;
};

// Funzione per ottenere tutti i post
exports.getPosts = (req, res) => {
    const initialPage = `<a href="/">Torna alla pagina iniziale</a>`; // Link per tornare alla pagina iniziale
    const generateHTML = (posts) => {
        let html = initialPage + '<ul>';
        posts.forEach(post => {
            const postLink = `<a href="/posts/${post.slug}">${post.title}</a>`; // Link per il singolo post
            html += `
                <li>
                    <h2>${postLink}</h2>
                    <img src="/imgs/posts/${post.image}" alt="${post.title}" style="width:300px">
                    <p>${post.content}</p>
                    <p>Tags: ${post.tags.join(', ')}</p>
                </li>`;
        });
        html += '</ul>';
        return html; // HTML generato per la lista dei post
    };
    sendResponse(req, res, posts, generateHTML);
};

// Funzione per visualizzare un singolo post
exports.getPostBySlug = (req, res) => {
    const slug = req.params.slug;
    const post = posts.find(post => post.slug === slug); // Cerca il post con lo slug specificato
    if (!post) {
        return res.status(404).json({ error: 'Post not found' }); // Restituisce errore se il post non è trovato
    }
    post.image_url = `/imgs/posts/${post.image}`; // URL dell'immagine del post
    const generateHTML = (post) => `
        <a href="/posts">Torna alla lista dei post</a>
        <h2>${post.title}</h2>
        <a href="${post.image_url}" target="_blank">
            <img src="/imgs/posts/${post.image}" alt="${post.title}" style="width:300px">
        </a>
        <p>${post.content}</p>
        <p>Tags: ${post.tags.join(', ')}</p>
        <a href="${post.image_url}" download>Download Image</a>
    `;
    sendResponse(req, res, post, generateHTML);
};

// Funzione per aggiungere un nuovo post
exports.addPost = [
    upload.single('image'), // Middleware per gestire l'upload del file
    (req, res) => {
        const { title, content, tags } = req.body;
        if (!title || !content || !req.file || !tags) {
            return res.status(400).json({ error: 'Assicurati di fornire tutti i campi necessari: title, content, image e tags' }); // Verifica che tutti i campi siano presenti
        }

        const slug = createSlug(title, posts); // Genera uno slug univoco usando la nuova funzione
        const newPost = {
            title,
            content,
            image: req.file.filename, // Usa il nome del file caricato
            tags: tags.split(',').map(tag => tag.trim()), // Converti la stringa dei tag in un array
            slug // Utilizza lo slug univoco
        };
        posts.push(newPost); // Aggiungi il nuovo post all'array dei post
        const dataFilePath = path.join(__dirname, '../data/data.json');
        writeDataToFile(dataFilePath, posts, (err) => {
            if (err) return res.status(500).json({ error: 'Errore durante il salvataggio dei dati' });
            sendResponse(req, res, newPost, () => res.redirect(`/posts/${newPost.slug}`)); // Risponde con il nuovo post o reindirizza alla sua pagina
        });
    }
];

// Funzione per creare una pagina per la creazione di un nuovo post
exports.createPostPage = (req, res) => {
    const accept = req.headers.accept;
    if (accept && accept.includes('text/html')) {
        res.send('<h1>Creazione nuovo post</h1>'); // Restituisce una pagina HTML con un h1
    } else {
        res.status(406).send('Not Acceptable'); // Restituisce un errore 406 per formati non accettati
    }
};

// Funzione per scaricare l'immagine del post tramite lo slug
exports.downloadImageBySlug = (req, res) => {
    const slug = req.params.slug;
    const post = posts.find(post => post.slug === slug); // Cerca il post con lo slug specificato
    if (!post) {
        return res.status(404).json({ error: 'Post not found' }); // Restituisce errore se il post non è trovato
    }
    const imagePath = path.join(__dirname, `../public/imgs/posts/${post.image}`); // Percorso completo dell'immagine
    res.download(imagePath, (err) => {
        if (err) {
            console.error('Errore durante il download dell\'immagine:', err);
            return res.status(500).json({ error: 'Errore durante il download dell\'immagine' }); // Gestisce errori di download
        }
        console.log('Immagine scaricata correttamente.');
    });
};

// Funzione per eliminare un post
exports.deletePost = (req, res) => {
    const slug = req.params.slug;
    const index = posts.findIndex(post => post.slug === slug); // Trova l'indice del post con lo slug specificato
    if (index === -1) {
        return res.status(404).json({ error: 'Post not found' }); // Restituisce errore se il post non è trovato
    }
    const deletedPost = posts.splice(index, 1)[0]; // Rimuove il post dall'array dei post
    const dataFilePath = path.join(__dirname, '../data/data.json');
    writeDataToFile(dataFilePath, posts, (err) => {
        if (err) return res.status(500).json({ error: 'Errore durante il salvataggio dei dati' });
        sendResponse(req, res, { message: 'Post eliminato' }, () => res.redirect('/posts')); // Risponde con messaggio di eliminazione o reindirizza alla lista dei post
    });
};
