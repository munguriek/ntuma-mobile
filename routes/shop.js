const { Shop } = require('../models/shop');
const express = require('express');
const router = express.Router();

router.get(`/`, async (req, res) => {
    const shopList = await Shop.find();

    if (!shopList) {
        res.status(500).json({ success: false })
    }
    res.status(200).send(shopList);
})

router.get('/:id', async (req, res) => {
    const shop = await Shop.findById(req.params.id);
    if (!shop) {
        res.status(500).json({ message: 'The List with the given ID was not found' })
    }
    res.status(200).send(shop);
})

router.post('/', async (req, res) => {
    let shop = new Shop({
        name: req.body.name,
        description: req.body.description,
        price: req.body.price
    })

    shop = await shop.save();
    if(!shop){
        return res.status(404).send('Custom Order Placed')
    }

    res.send(shop)
})

router.put('/:id', async (req, res) => {
    const shop = await Shop.findByIdAndUpdate(req.params.id, {
        name: req.body.name,
        description: req.body.description,
        price: req.body.price
    },
        { new: true }
    )
    if (!shop) {
        return res.status(404).send('Order Update Failed')
    }

    res.send(shop)
})

router.delete('/:id', (req, res) => {
    Shop.findOneAndRemove(req.params.id).then(shop => {
        if (shop) {
            return res.status(200).json({ success: true, message: 'The Order has been deleted' })
        } else {
            return res.status(404).json({ success: false, message: 'Order not found' })
        }
    }).catch(err => {
        return res.status(400).json({ success: false, error: err })
    })
})

module.exports = router;