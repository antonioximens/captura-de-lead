import { ErrorRequestHandler } from "express";
import { HttpError } from "../errors/HttpError";

// fazendo o tratamento de erro para 3 casos possiveis da palicação
// não esquecer de tipar a função
export const errorHandlerMiddleware: ErrorRequestHandler = (error, req, res, next) => {
    if(error instanceof HttpError) {
        res.status(error.status).json({message: error.message})
    } else if (error instanceof Error) {
        res.status(500).json({message: error.message})
    } else {
        res.status(500).json({message: "Internal Server Error"})
    }
}