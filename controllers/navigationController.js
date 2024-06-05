import { navigationDb } from "../models/navigationModel.js";

export default class NavigationController{

    getAll = async (req, res) => {
        res.status(200).json({
            success: true,
            message: 'navigation items found.',
            status: 200,
            navigationItems: req.navigationItems
        });
    };

    setup = async (req, res) => {
        let defaultData = req.navigationItems;
        if(req.navigationItems.length === 0){

            defaultData = [
                {
                    title: 'Meny',
                    url: '/menu',
                    isAdmin: false
                },
                {
                    title: 'Vårt kaffe',
                    url: '/about',
                    isAdmin: false
                },
                {
                    title: 'Min profil',
                    url: '/profile',
                    isAdmin: false
                },
                {
                    title: 'Orderstatus',
                    url: '/status',
                    isAdmin: false
                }
            ];
    
            await navigationDb.insert(defaultData);
        }
        
        res.status(200).json({
            success: true,
            message: 'navigation items found.',
            status: 200,
            navigationItems: defaultData
        });
    }; 
}

// // Behöver vi använda oss av detta istället ?
// import errorHandler from '../middlewares/errorHandler.js';
// import { navigationDb } from "../models/navigationModel.js";

// export default class NavigationController{

//     getAll = async (req, res, next) => {
//         try {
//             const navigationItems = req.navigationItems;
//             res.status(200).json({
//                 success: true,
//                 message: 'Navigation items found.',
//                 status: 200,
//                 navigationItems: navigationItems
//             });
//         } catch (error) {
//             next(error); // Skicka fel till errorHandler
//         }
//     };

//     setup = async (req, res, next) => {
//         try {
//             let defaultData = req.navigationItems;
//             if(req.navigationItems.length === 0){
//                 defaultData = [
//                     {
//                         title: 'Meny',
//                         url: '/menu',
//                         isAdmin: false
//                     },
//                     {
//                         title: 'Vårt kaffe',
//                         url: '/about',
//                         isAdmin: false
//                     },
//                     {
//                         title: 'Min profil',
//                         url: '/profile',
//                         isAdmin: false
//                     },
//                     {
//                         title: 'Orderstatus',
//                         url: '/status',
//                         isAdmin: false
//                     }
//                 ];
//                 await navigationDb.insert(defaultData);
//             }
//             res.status(200).json({
//                 success: true,
//                 message: 'Navigation items found.',
//                 status: 200,
//                 navigationItems: defaultData
//             });
//         } catch (error) {
//             next(error); // Skicka fel till errorHandler
//         }
//     }; 
// }

