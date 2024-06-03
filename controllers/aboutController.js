import nedb from 'nedb-promises';

const aboutDb = nedb.create({
    filename: 'config/about.db',
    autoload: true
});

const aboutInfo = async (req, res) => {
    try {
        
        // const textInfo = await aboutDb.insert({ 
        //     'desc': 'Pumpkin spice mug, barista cup, sit macchiato, kopi-luwak, doppio, grounds dripper, crema, strong whipped, variety extra iced id lungo half and half mazagran. Pumpkin spice.' 
        // });
        
        const textInfo = await aboutDb.findOne({ _id: 'zCGcKgM2UNsUfG6T' })
        res.status(200).send(textInfo);
    } catch (error) {
        res.status(500).send({ error: 'Failed to insert info' });
    }
};


export { aboutDb, aboutInfo };