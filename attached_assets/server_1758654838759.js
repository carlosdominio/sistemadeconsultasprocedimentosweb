const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('.'));

// Database
const db = new sqlite3.Database('./database.db');

// Initialize database
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS clients (
        id INTEGER PRIMARY KEY,
        name TEXT
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS client_procedures (
        id INTEGER PRIMARY KEY,
        client_id INTEGER,
        procedure_text TEXT,
        FOREIGN KEY (client_id) REFERENCES clients (id)
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS providers (
        id INTEGER PRIMARY KEY,
        name TEXT,
        image TEXT
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS provider_procedures (
        id INTEGER PRIMARY KEY,
        provider_id INTEGER,
        sinistro_type TEXT,
        procedure_text TEXT,
        FOREIGN KEY (provider_id) REFERENCES providers (id)
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS additional_provider_procedures (
        id INTEGER PRIMARY KEY,
        provider_id INTEGER,
        sinistro_type TEXT,
        procedure_text TEXT,
        FOREIGN KEY (provider_id) REFERENCES providers (id)
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS sinistro_procedures (
        id INTEGER PRIMARY KEY,
        sinistro_type TEXT,
        procedure_text TEXT
    )`);

    // Insert default data if not exists
    db.get("SELECT COUNT(*) as count FROM clients", (err, row) => {
        if (row.count === 0) {
            insertDefaultData();
        }
    });
});

function insertDefaultData() {
    const clients = [
        { id: 1, name: 'Cliente A', procedures: ['Contato inicial', 'Análise de requisitos', 'Proposta', 'Negociação', 'Fechamento'] },
        { id: 2, name: 'Cliente B', procedures: ['Reunião de briefing', 'Desenvolvimento', 'Testes', 'Entrega'] },
        { id: 3, name: 'Cliente C', procedures: ['Avaliação', 'Planejamento', 'Execução', 'Acompanhamento'] }
    ];

    const providers = [
        { id: 1, name: 'Prestador X', image: '', procedures: { acidentes: ['Avaliação de danos', 'Contato com cliente', 'Relatório de acidente'], avarias: ['Inspeção visual', 'Fotografia de avarias', 'Orçamento de reparo'], roubo: ['Verificação de documentos', 'Contato com polícia', 'Bloqueio de bens'], exclusoes: ['Análise contratual', 'Consulta jurídica', 'Decisão de cobertura'] }, additionalProcedures: { acidentes: ['Revisão', 'Aprovação'], avarias: [], roubo: [], exclusoes: [] } },
        { id: 2, name: 'Prestador Y', image: '', procedures: { acidentes: ['Registro do sinistro', 'Avaliação médica', 'Processamento de indenização'], avarias: ['Avaliação técnica', 'Negociação com oficinas', 'Acompanhamento de reparos'], roubo: ['Investigação preliminar', 'Verificação de seguros', 'Liberação de valores'], exclusoes: ['Revisão de cláusulas', 'Parecer técnico', 'Comunicação ao cliente'] }, additionalProcedures: { acidentes: ['Treinamento', 'Manutenção'], avarias: [], roubo: [], exclusoes: [] } },
        { id: 3, name: 'Prestador Z', image: '', procedures: { acidentes: ['Análise de responsabilidade', 'Cálculo de prejuízos', 'Pagamento de indenização'], avarias: ['Perícia especializada', 'Definição de reparos', 'Controle de qualidade'], roubo: ['Análise de risco', 'Recuperação de bens', 'Compensação financeira'], exclusoes: ['Auditoria contratual', 'Decisão final', 'Arquivamento do caso'] }, additionalProcedures: { acidentes: ['Suporte pós-venda', 'Atualizações'], avarias: [], roubo: [], exclusoes: [] } }
    ];

    const sinistroProcedures = [
        { sinistro_type: 'acidentes', procedure_text: 'Notificar imediatamente' },
        { sinistro_type: 'acidentes', procedure_text: 'Documentar o acidente' },
        { sinistro_type: 'acidentes', procedure_text: 'Contato com autoridades' },
        { sinistro_type: 'avarias', procedure_text: 'Avaliar danos' },
        { sinistro_type: 'avarias', procedure_text: 'Fotografar avarias' },
        { sinistro_type: 'avarias', procedure_text: 'Solicitar orçamento' },
        { sinistro_type: 'roubo', procedure_text: 'Registrar boletim de ocorrência' },
        { sinistro_type: 'roubo', procedure_text: 'Bloquear cartões/bens' },
        { sinistro_type: 'roubo', procedure_text: 'Notificar seguradora' },
        { sinistro_type: 'exclusoes', procedure_text: 'Verificar cláusulas contratuais' },
        { sinistro_type: 'exclusoes', procedure_text: 'Consultar especialista' },
        { sinistro_type: 'exclusoes', procedure_text: 'Documentar decisão' }
    ];

    clients.forEach(client => {
        db.run("INSERT INTO clients (id, name) VALUES (?, ?)", [client.id, client.name]);
        client.procedures.forEach(proc => {
            db.run("INSERT INTO client_procedures (client_id, procedure_text) VALUES (?, ?)", [client.id, proc]);
        });
    });

    providers.forEach(provider => {
        db.run("INSERT INTO providers (id, name, image) VALUES (?, ?, ?)", [provider.id, provider.name, provider.image]);
        Object.keys(provider.procedures).forEach(sinistro => {
            provider.procedures[sinistro].forEach(proc => {
                db.run("INSERT INTO provider_procedures (provider_id, sinistro_type, procedure_text) VALUES (?, ?, ?)", [provider.id, sinistro, proc]);
            });
        });
        Object.keys(provider.additionalProcedures).forEach(sinistro => {
            provider.additionalProcedures[sinistro].forEach(proc => {
                db.run("INSERT INTO additional_provider_procedures (provider_id, sinistro_type, procedure_text) VALUES (?, ?, ?)", [provider.id, sinistro, proc]);
            });
        });
    });

    sinistroProcedures.forEach(proc => {
        db.run("INSERT INTO sinistro_procedures (sinistro_type, procedure_text) VALUES (?, ?)", [proc.sinistro_type, proc.procedure_text]);
    });
}

// API Routes
app.get('/api/clients', (req, res) => {
    db.all("SELECT * FROM clients", (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

app.get('/api/clients/:id/procedures', (req, res) => {
    db.all("SELECT * FROM client_procedures WHERE client_id = ?", [req.params.id], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

app.post('/api/clients', (req, res) => {
    const { name } = req.body;
    db.run("INSERT INTO clients (name) VALUES (?)", [name], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ id: this.lastID });
    });
});

app.put('/api/clients/:id', (req, res) => {
    const { name } = req.body;
    db.run("UPDATE clients SET name = ? WHERE id = ?", [name, req.params.id], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ success: true });
    });
});

app.delete('/api/clients/:id', (req, res) => {
    db.run("DELETE FROM client_procedures WHERE client_id = ?", [req.params.id]);
    db.run("DELETE FROM clients WHERE id = ?", [req.params.id], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ success: true });
    });
});

app.post('/api/clients/:id/procedures', (req, res) => {
    const { procedure_text } = req.body;
    db.run("INSERT INTO client_procedures (client_id, procedure_text) VALUES (?, ?)", [req.params.id, procedure_text], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ id: this.lastID });
    });
});

app.put('/api/clients/:clientId/procedures/:id', (req, res) => {
    const { procedure_text } = req.body;
    db.run("UPDATE client_procedures SET procedure_text = ? WHERE id = ? AND client_id = ?", [procedure_text, req.params.id, req.params.clientId], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ success: true });
    });
});

app.delete('/api/clients/:clientId/procedures/:id', (req, res) => {
    db.run("DELETE FROM client_procedures WHERE id = ? AND client_id = ?", [req.params.id, req.params.clientId], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ success: true });
    });
});

// Similar routes for providers, provider_procedures, additional_provider_procedures, sinistro_procedures

app.get('/api/providers', (req, res) => {
    db.all("SELECT * FROM providers", (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

app.post('/api/providers', (req, res) => {
    const { name, image } = req.body;
    db.run("INSERT INTO providers (name, image) VALUES (?, ?)", [name, image], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ id: this.lastID });
    });
});

app.put('/api/providers/:id', (req, res) => {
    const { name, image } = req.body;
    db.run("UPDATE providers SET name = ?, image = ? WHERE id = ?", [name, image, req.params.id], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ success: true });
    });
});

app.delete('/api/providers/:id', (req, res) => {
    db.run("DELETE FROM provider_procedures WHERE provider_id = ?", [req.params.id]);
    db.run("DELETE FROM additional_provider_procedures WHERE provider_id = ?", [req.params.id]);
    db.run("DELETE FROM providers WHERE id = ?", [req.params.id], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ success: true });
    });
});

app.get('/api/providers/:id/procedures/:sinistro', (req, res) => {
    db.all("SELECT * FROM provider_procedures WHERE provider_id = ? AND sinistro_type = ?", [req.params.id, req.params.sinistro], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

app.post('/api/providers/:id/procedures', (req, res) => {
    const { sinistro_type, procedure_text } = req.body;
    db.run("INSERT INTO provider_procedures (provider_id, sinistro_type, procedure_text) VALUES (?, ?, ?)", [req.params.id, sinistro_type, procedure_text], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ id: this.lastID });
    });
});

app.put('/api/providers/:providerId/procedures/:id', (req, res) => {
    const { procedure_text } = req.body;
    db.run("UPDATE provider_procedures SET procedure_text = ? WHERE id = ?", [procedure_text, req.params.id], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ success: true });
    });
});

app.delete('/api/providers/:providerId/procedures/:id', (req, res) => {
    db.run("DELETE FROM provider_procedures WHERE id = ?", [req.params.id], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ success: true });
    });
});

// Similar for additional_provider_procedures and sinistro_procedures

app.get('/api/providers/:id/additional-procedures/:sinistro', (req, res) => {
    db.all("SELECT * FROM additional_provider_procedures WHERE provider_id = ? AND sinistro_type = ?", [req.params.id, req.params.sinistro], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

app.post('/api/providers/:id/additional-procedures', (req, res) => {
    const { sinistro_type, procedure_text } = req.body;
    db.run("INSERT INTO additional_provider_procedures (provider_id, sinistro_type, procedure_text) VALUES (?, ?, ?)", [req.params.id, sinistro_type, procedure_text], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ id: this.lastID });
    });
});

app.put('/api/providers/:providerId/additional-procedures/:id', (req, res) => {
    const { procedure_text } = req.body;
    db.run("UPDATE additional_provider_procedures SET procedure_text = ? WHERE id = ?", [procedure_text, req.params.id], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ success: true });
    });
});

app.delete('/api/providers/:providerId/additional-procedures/:id', (req, res) => {
    db.run("DELETE FROM additional_provider_procedures WHERE id = ?", [req.params.id], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ success: true });
    });
});

app.get('/api/sinistro-procedures/:sinistro', (req, res) => {
    db.all("SELECT * FROM sinistro_procedures WHERE sinistro_type = ?", [req.params.sinistro], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

app.post('/api/sinistro-procedures', (req, res) => {
    const { sinistro_type, procedure_text } = req.body;
    db.run("INSERT INTO sinistro_procedures (sinistro_type, procedure_text) VALUES (?, ?)", [sinistro_type, procedure_text], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ id: this.lastID });
    });
});

app.put('/api/sinistro-procedures/:id', (req, res) => {
    const { procedure_text } = req.body;
    db.run("UPDATE sinistro_procedures SET procedure_text = ? WHERE id = ?", [procedure_text, req.params.id], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ success: true });
    });
});

app.delete('/api/sinistro-procedures/:id', (req, res) => {
    db.run("DELETE FROM sinistro_procedures WHERE id = ?", [req.params.id], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ success: true });
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});