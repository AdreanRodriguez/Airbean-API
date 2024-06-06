
export default class NavigationController{

    getAll = async (req, res) => {
        res.status(200).json({
            success: true,
            message: 'navigation items found.',
            status: 200,
            navigationItems: req.navigationItems
        });
    };
}
