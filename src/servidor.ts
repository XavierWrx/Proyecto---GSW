
import express = require("express");
import type { Request, Response } from "express";

const app = express();
const PUERTO = 9090;

const tutores = [
  { id: 1, tutor: "Wendy Flores", materia: "Matemáticas", horario: "Lun/Mié 16:00", cupos: 4 },
  { id: 2, tutor: "Anderson Maravilla", materia: "Ciencias", horario: "Mar/Jue 15:00", cupos: 3 },
  { id: 3, tutor: "Rodrigo Mejía", materia: "Inglés", horario: "Vie 14:00", cupos: 5 }
];

app.get("/api/tutores", (req: Request, res: Response) => {
  const materia = String(req.query.materia || "").toLowerCase().trim();
  const lista = materia
    ? tutores.filter((t) => t.materia.toLowerCase().includes(materia))
    : tutores;

  res.json({ total: lista.length, tutores: lista });
});

app.listen(PUERTO, () => {
  console.log(`Servidor Express corriendo en http://localhost:${PUERTO}`);
});
