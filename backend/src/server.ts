import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { env } from './config/env';
import { router } from './routes';
import { errorHandler } from './middleware/error';

const app=express();
app.use(helmet()); app.use(cors({origin:env.corsOrigin})); app.use(express.json());
app.get('/health',(_req,res)=>res.json({status:'ok',service:'mini-erp-crm-api'}));
app.use('/api',router); app.use(errorHandler);
app.listen(env.port,()=>console.log(`API running on http://localhost:${env.port}`));
