import * as express from 'express';
import { Application, NextFunction, Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import { AccountController } from '../controllers/accountController';
import { ContactController } from '../controllers/registrationController';

export class Routes {

    private readonly contactController: ContactController = null;
    private readonly accountController: AccountController = null;

    public constructor() {
        this.contactController = new ContactController();
        this.accountController = new AccountController();
    }

    public routes(anonymous: Application): void {
        const ProtectedRoutes = express.Router();

        anonymous.use('/api', ProtectedRoutes);
        ProtectedRoutes.use((req: Request, res: Response, next: NextFunction) => {
            const token = req.headers['access-token'].toString();
            if (!token) {
                res.send({
                    message: 'No token provided.'
                });
                return;
            }
            jwt.verify(token, anonymous.get('Secret'), (err: any) => {
                if (err) {
                    return res.json({ message: 'invalid token' });
                }
                next();
            });
        });

        anonymous.route('/')
            .get((req: Request, res: Response) => {
                res.status(200).send({
                    message: 'GET request successfulll!!!!'
                });
            });

        // Contact 
        ProtectedRoutes.route('/contact')
            .get((req: Request, res: Response, next: NextFunction) => {
                // middleware
                console.log(`Request from: ${req.originalUrl}`);
                console.log(`Request type: ${req.method}`);
                next();
            }, this.contactController.getContacts)

            // POST endpoint
            .post(this.contactController.addNewContact);

        // Contact detail
        ProtectedRoutes.route('/contact/:contactId')
            // get specific contact
            .get(this.contactController.getContactWithID)
            .put(this.contactController.updateContact)
            .delete(this.contactController.deleteContact);

        anonymous.route('/authenticate')
            .post(this.accountController.login);
    }
}