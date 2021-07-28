const { Assistant } = require('../models/assistant');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

router.get(`/`, async (req, res) => {
    const assistantList = await Assistant.find().select('-passwordHash');

    if (!assistantList) {
        res.status(500).json({ success: false })
    }
    res.send(assistantList);
})

router.get('/:id', async (req, res) => {
    const assistant = await Assistant.findById(req.params.id).select('-passwordHash');

    if (!assistant) {
        res.status(500).json({ message: 'The assistant with the given ID was not found.' })
    }
    res.status(200).send(assistant);
})

router.post('/', async (req, res) => {
    let assistant = new Assistant({
        firstname: req.body.name,
        surname: req.body.name,
        email: req.body.email,
        passwordHash: bcrypt.hashSync(req.body.password, 10),
        phone: req.body.phone,
        market: req.body.market,
        isAssistant: req.body.isAssistant,
        refferalCode: req.body.refferalCode
    })
    assistant = await assistant.save();

    if (!assistant)
        return res.status(400).send('the assistant cannot be created!')

    res.send(assistant);
})

router.put('/:id', async (req, res) => {

    const assistantExist = await Assistant.findById(req.params.id);
    let newPassword
    if (req.body.password) {
        newPassword = bcrypt.hashSync(req.body.password, 10)
    } else {
        newPassword = assistantExist.passwordHash;
    }

    const assistant = await Assistant.findByIdAndUpdate(
        req.params.id,
        {
            firstname: req.body.firstname,
            surname: req.body.surname,
            email: req.body.email,
            phone: req.body.phone,
            market: req.body.market,
            refferalCode: req.body.refferalCode,
            passwordHash: newPassword,
            isAssistant: req.body.isAssistant,
        },
        { new: true }
    )

    if (!assistant)
        return res.status(400).send('the market assistant cannot be created!')

    res.send(assistant);
})

router.post('/login', async (req, res) => {
    const assistant = await Assistant.findOne({ phone: req.body.phone })
    const secret = process.env.secret;
    if (!assistant) {
        return res.status(400).send('Assistant not found');
    }

    if (assistant && bcrypt.compareSync(req.body.password, assistant.passwordHash)) {
        const token = jwt.sign(
            {
                assistantId: assistant.id,
                isAssistant: assistant.isAssistant
            },
            secret,
            { expiresIn: '1d' }
        )

        res.status(200).send({ assistant: assistant.email, token: token })
    } else {
        res.status(400).send('Invalid password!');
    }


})


router.post('/register', async (req, res) => {
    let assistant = new Assistant({
        firstname: req.body.firstname,
        surname: req.body.surname,
        email: req.body.email,
        phone: req.body.phone,
        market: req.body.market,
        refferalCode: req.body.refferalCode,
        passwordHash: bcrypt.hashSync(req.body.password, 10),
        isAssistant: req.body.isAssistant,
    })
    assistant = await assistant.save();

    if (!assistant)
        return res.status(400).send('the assistant cannot be created!')

    res.send(assistant);
})


router.delete('/:id', (req, res) => {
    Assistant.findByIdAndRemove(req.params.id).then(assistant => {
        if (assistant) {
            return res.status(200).json({ success: true, message: 'the assistant is deleted!' })
        } else {
            return res.status(404).json({ success: false, message: "assistant not found!" })
        }
    }).catch(err => {
        return res.status(500).json({ success: false, error: err })
    })
})

router.get(`/get/count`, async (req, res) => {
    const assistantCount = await Assistant.countDocuments((count) => count)

    if (!assistantCount) {
        res.status(500).json({ success: false })
    }
    res.send({
        assistantCount: assistantCount
    });
})


module.exports = router;