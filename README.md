Impariamo a ragionare in ottica TDD e a scrivere i nostri Unit Tests.
- [x] Creiamo i test per la nostra funzione createSlug che crea gli slug dei nostri post ricevendo come argomento il titolo da convertire e la lista di tutti i post.
Eseguiamo i seguenti test:
- [x] createSlug dovrebbe ritornare una stringa
- [] createSlug dovrebbe ritornare una stringa in lowercase
- [] createSlug dovrebbe ritornare una stringa con gli spazi sostituiti da -
- [] createSlug dovrebbe incrementare di 1 lo slug quando esiste già
- [] createSlug dovrebbe lanciare un errore in caso di titolo non presente o formato errato
- [] createSlug dovrebbe lanciare un errore se manca l'array dei post
Lavoriamo in ottica TDD, quindi prima scriviamo il singolo test, e dopo scriviamo il codice necessario per far superare il nostro test.
Bonus
Creiamo una classe Model la quale dovrà superare i seguenti test:
- [] Model dovrebbe essere una classe (crea un'istanza della classe Model)
- [] L'istanza di model dovrebbe richiedere il nome del file json da usare in fase di creazione dell'istanza
- [] L'istanza di model dovrebbe avere il metodo read
- [] L'istanza di model dovrebbe avere il metodo add
- [] read dovrebbe ritornare un array
- [] add dovrebbe aggiungere un elemento all’array dei dati e ritornare tutta la lista