import { Router } from 'express';

const router = Router()

router.post('/', (req, res) => {
    const { error } = userSchema.validate(req.body);

    if (error) {

        const response = {
            success: false,
            message: error.details[0].message,
            status: 400
        };
        return res.status(400).json(response);
    } else {
        const newOrder = createOrder(req.body)
        return res.status(201).json({ order: newOrder });

    }
});

// Hämtar den varukorg som användaren har aktiv. 
// Om det inte finns en aktiv varukorg så skapas en tom.
router.get('/:orderId', (req, res) => {

});
router.post('/:productId', (req, res) => {

});