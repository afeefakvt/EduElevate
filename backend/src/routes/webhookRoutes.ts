import express from "express";
import WebhookController from "../controllers/webhookController";


const webhookRoutes   = express.Router()
const webhookController = new WebhookController(); // Create an instance



webhookRoutes.post('/webhook',webhookController.stripeWebhook.bind(webhookController))

export default webhookRoutes