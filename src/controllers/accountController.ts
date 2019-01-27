import * as express from 'express';
import { Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';

export class AccountController {
    public app: express.Application = express();
    public login(req: Request, res: Response) {
        if (req.body.username === 'aymen') {
            if (req.body.password === 123) {
                const payload = {
                    check: true
                };
                const token = jwt.sign(payload, 'heymynameismohamedaymen', {
                    expiresIn: 1440 // expires in 24 hours
                });
                res.json({
                    message: 'authentication done ',
                    token: token
                });
            } else {
                res.json({ message: 'please check your password !' });
            }
        } else {
            res.json({ message: 'user not found !' });
        }
    }
}