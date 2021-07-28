const { Market } = require('../models/market');
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const multer = require('multer');



router.get(`/`, async (req, res) => {
    

    const marketList = await Market.find();

    if (!marketList) {
        res.status(500).json({ success: false });
    }
    res.send(marketList);
});

router.post('/', async (req, res)=>{
    let market = new Market({
        market_name: req.body.market_name,
        market_location: req.body.market_location,
        market_image: req.body.market_image
    })

    market = await market.save();
    if(!market){
        return res.status(404).send('The Market can not be created')
    }

    res.send(market)
})

module.exports = router;