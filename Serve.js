import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
const app = express();
app.use(express. json()); // API aceita JSON

app.use(cors({
    origin: 'http://localhost:4200', // URL do Angular
    methods: ['GET','POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS' ],
    allowedHeaders: ['Content-Type','Authorization'],
    credentials: false
}));

//Conectar ao MongoDB Atlas
mongoose.connect(process.env.MONGODB_URI, {dbName: 'ControleFinanceiro'})
.then(() => console.log('Conectado ao MongoDB'))
.catch(err => console.error('Erro na conexão : ', err.message));

const ControleFinanceiroSchema = new mongoose.Schema({
    TipoConta: {type: String, required: true,trim: true}, 
    Descricao: {type: String, required: true, trim: true},  
    Data: {type: Date},
    Tag: {type: String, required: true, trim: true},
    Valor: {type: Number, required: true}
}, {collection: 'ControleFinanceiros', timestamps: true});
const ControleFinanceiro =  mongoose.model('ControleFinanceiro', ControleFinanceiroSchema, 'ControleFinanceiros');

app.get('/', (req, res) => res.json({msg: 'API rodando'}));

//Buscar controleFinanceiro por ID
app.get('/controleFinanceiros/:id', async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({ error: 'ID inválido' });
        } 
        const controleFinanceiro = await ControleFinanceiro.findById(req.params.id);
        if (!controleFinanceiro) return res.status(404).json({ error: 'ControleFinanceiro não encontrado'});
        res.json(controleFinanceiro);
    }catch (err) {
        res.status(500).json({ error: err.message });
    }
});

//Listar todos os controleFinanceiros
app.get('/controleFinanceiros', async (req, res) => {
    const controleFinanceiros = await ControleFinanceiro.find();
    res.json(controleFinanceiros);
});

//Criar controleFinanceiro
app.post('/controleFinanceiros', async (req, res) => {
    const controleFinanceiro = await ControleFinanceiro.create(req.body);
    res.status(201).json(controleFinanceiro);
});

//Atualizar controleFinanceiro com PUT
app.put('/controleFinanceiros/:id', async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({ error: 'ID inválido' });
        }
        const controleFinanceiro = await ControleFinanceiro.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true, overwrite: true }
        );
        if (!controleFinanceiro) return res.status(404).json({ error: 'ControleFinanceiro não encontrado' });
        res.json(controleFinanceiro);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

//Deletar controleFinanceiro
app.delete('/controleFinanceiros/:id', async (req, res) => {
    try{
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({ error: 'ID inválido' });
        }
        const controleFinanceiro = await ControleFinanceiro.findByIdAndDelete(req.params.id);
        if (!controleFinanceiro) return res.status(404).json({ error: 'ControleFinanceiro não encontrado'});
        res.json({ ok: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Iniciar servidor
app.listen(process.env.PORT, () =>
    console.log( `Servidor rodando em http://localhost:${process.env. PORT}`)
);