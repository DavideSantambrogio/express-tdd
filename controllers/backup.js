const fs = require('fs');
const path = require('path');
const slugify = require('slugify');
const multer = require('multer');
const posts = require('../data/data.json');

// Configurazione multer per salvare le immagini caricate
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/imgs/posts');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + '-' + file.originalname);
    }
});
const upload = multer({ storage: storage });

// Funzione per inviare una risposta in vari formati
const sendResponse = (req, res, data, htmlGenerator) => {
    res.format({
        'application/json': () => res.json(data),
        'text/html': () => res.send(htmlGenerator(data)),
        'default': () => res.status(406).send('Not Acceptable')
    });
};

// Funzione per scrivere i dati aggiornati nel file JSON
const writeDataToFile = (filePath, data, callback) => {
    fs.writeFile(filePath, JSON.stringify(data, null, 2), (err) => {
        if (err) {
            console.error('Errore durante il salvataggio dei dati:', err);
            return callback(err);
        }
        console.log('Dati salvati correttamente.');
        callback(null);
    });
};

// Funzione per ottenere tutti i post
exports.getPosts = (req, res) => {
    const initialPage = `<a href="/">Torna alla pagina iniziale</a>`;
    const generateHTML = (posts) => {
        let html = initialPage + '<ul>';
        posts.forEach(post => {
            const postLink = `<a href="/posts/${post.slug}">${post.title}</a>`;
            html += `
                <li>
                    <h2>${postLink}</h2>
                    <img src="/imgs/posts/${post.image}" alt="${post.title}" style="width:300px">
                    <p>${post.content}</p>
                    <p>Tags: ${post.tags.join(', ')}</p>
                </li>`;
        });
        html += '</ul>';
        return html;
    };
    sendResponse(req, res, posts, generateHTML);
};

// Funzione per visualizzare un singolo post
exports.getPostBySlug = (req, res) => {
    const slug = req.params.slug;
    const post = posts.find(post => post.slug === slug);
    if (!post) {
        return res.status(404).json({ error: 'Post not found' });
    }
    post.image_url = `/imgs/posts/${post.image}`;
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
            return res.status(400).json({ error: 'Assicurati di fornire tutti i campi necessari: title, content, image e tags' });
        }

        const slug = slugify(title, { lower: true, strict: true });
        let uniqueSlug = slug;
        let count = 1;
        while (posts.find(post => post.slug === uniqueSlug)) {
            uniqueSlug = `${slug}-${count}`;
            count++;
        }

        const newPost = {
            title,
            content,
            image: req.file.filename,
            tags: tags.split(',').map(tag => tag.trim()),
            slug: uniqueSlug
        };
        posts.push(newPost);
        const dataFilePath = path.join(__dirname, '../data/data.json');
        writeDataToFile(dataFilePath, posts, (err) => {
            if (err) return res.status(500).json({ error: 'Errore durante il salvataggio dei dati' });
            sendResponse(req, res, newPost, () => res.redirect(`/posts/${newPost.slug}`));
        });
    }
];

// Funzione per creare una pagina per la creazione di un nuovo post
exports.createPostPage = (req, res) => {
    const accept = req.headers.accept;
    if (accept && accept.includes('text/html')) {
        res.send('<h1>Creazione nuovo post</h1>');
    } else {
        res.status(406).send('Not Acceptable');
    }
};

// Funzione per scaricare l'immagine del post tramite lo slug
exports.downloadImageBySlug = (req, res) => {
    const slug = req.params.slug;
    const post = posts.find(post => post.slug === slug);
    if (!post) {
        return res.status(404).json({ error: 'Post not found' });
    }
    const imagePath = path.join(__dirname, `../public/imgs/posts/${post.image}`);
    res.download(imagePath, (err) => {
        if (err) {
            console.error('Errore durante il download dell\'immagine:', err);
            return res.status(500).json({ error: 'Errore durante il download dell\'immagine' });
        }
        console.log('Immagine scaricata correttamente.');
    });
};

// Funzione per eliminare un post
exports.deletePost = (req, res) => {
    const slug = req.params.slug;
    const index = posts.findIndex(post => post.slug === slug);
    if (index === -1) {
        return res.status(404).json({ error: 'Post not found' });
    }
    const deletedPost = posts.splice(index, 1)[0];
    const dataFilePath = path.join(__dirname, '../data/data.json');
    writeDataToFile(dataFilePath, posts, (err) => {
        if (err) return res.status(500).json({ error: 'Errore durante il salvataggio dei dati' });
        sendResponse(req, res, { message: 'Post eliminato' }, () => res.redirect('/posts'));
    });
};
