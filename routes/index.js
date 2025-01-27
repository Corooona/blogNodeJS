const express = require('express');
const router = express.Router();
const {getDb} = require('../config/db');
const {ObjectId} = require('mongodb');


//Ruta principal
router.get('/', async (req,res)=>{
    const db = getDb();    
    const posts = await db.collection('post').find().toArray();
    res.render('index', {posts});
})

router.post('/add', async (req,res)=>{
    let{texto,imagen}=req.body;
    const db=getDb();

    if (!texto) {
        return res.status(400).send("El campo 'texto' es obligatorio.");
    }

    const newPost={
        timestamp: new Date(),
        texto: texto,
    }

    if(imagen){
        newPost.imagen=imagen;
    }
    
    await db.collection('post').insertOne(newPost);

    res.redirect('/');
    
})

router.get('/edit/:id', async(req,res)=>{
    try{
        const db=getDb();
        const postId=req.params.id;
        
        const post = await db.collection('post').findOne({ _id: new ObjectId(postId) });

        if(!post){
            return res.status(404).send('Error al encontrar post');
        }
        res.render('edit', {post})
    }catch(err){
        console.error('Error al cargar el formulario de edicion: ', err)
        res.status(500).send('Error interno');
    }
})

router.post('/update/:id', async(req,res)=>{
    try{
        const db = getDb();
        const postId=req.params.id;
        const {texto,imagen}=req.body;

        if(!texto){
            return res.status(400).send('El campo texto es obligatorio');
        }
        
        const result=await db.collection('post').updateOne(
            {_id: new ObjectId(postId)},
            {$set: {texto,imagen} }
        );

        res.redirect('/');
    }
    catch(err){
        console.error('Error al actualizar el post', err);
        res.status(500).send('Error interno');
    }
})

router.post('/delete/:id', async(req,res)=>{
    try{
        const db=getDb();
        const postId=req.params.id;
        
        const post=await db.collection('post').findOne({ _id: new ObjectId(postId) })
        if (!post) {
            return res.status(404).send("Post fallido");
        }

        const result=await db.collection('post').deleteOne({_id: new ObjectId(postId)});

        if (result.deletedCount === 0) {
            return res.status(404).send("Post no encontrado.");
        }

        res.redirect('/');

    }catch(err){
        console.error('Error al eliminar el post', err);
        res.status(500).send('Error interno');
    }
})



module.exports=router;