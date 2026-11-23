import express = require("express");
import type { Request, Response } from "express";

const app = express();
const PUERTO = Number(process.env.PORT) || 9090;

interface Tutor {
  id: number;
  tutor: string;
  materia: string;
  horario: string;
  cupos: number;
}

// Datos de ejemplo del portal de tutorías (en fases siguientes pasarán a una base de datos)
const tutores: Tutor[] = [
  { id: 1, tutor: "Wendy Flores", materia: "Matemáticas", horario: "Lun/Mié 16:00", cupos: 4 },
  { id: 2, tutor: "Anderson Maravilla", materia: "Ciencias", horario: "Mar/Jue 15:00", cupos: 3 },
  { id: 3, tutor: "Rodrigo Mejía", materia: "Inglés", horario: "Vie 14:00", cupos: 5 }
];

// Estado del servicio: sirve para comprobar que Apache llega a Express
app.get("/api/salud", (_req: Request, res: Response) => {
  res.json({ estado: "ok", servicio: "portal-tutorias", hora: new Date().toISOString() });
});

// Lista de materias disponibles (sin repetir)
app.get("/api/materias", (_req: Request, res: Response) => {
  const materias = [...new Set(tutores.map((t) => t.materia))];
  res.json({ total: materias.length, materias });
});

// Lista de tutores. Filtro opcional: /api/tutores?materia=inglés
app.get("/api/tutores", (req: Request, res: Response) => {
  const materia = String(req.query["materia"] || "").toLowerCase().trim();
  const lista = materia
    ? tutores.filter((t) => t.materia.toLowerCase().includes(materia))
    : tutores;

  res.json({ total: lista.length, tutores: lista });
});

// Ruta dinámica: un tutor por su id, ej. /api/tutores/2
app.get("/api/tutores/:id", (req: Request, res: Response) => {
  const id = Number(req.params["id"]);
  const encontrado = tutores.find((t) => t.id === id);

  if (!Number.isInteger(id) || !encontrado) {
    res.status(404).json({ error: "Tutor no encontrado", id: req.params["id"] });
    return;
  }

  res.json(encontrado);
});

// Cualquier otra ruta de la API devuelve un 404 en JSON
app.use("/api", (_req: Request, res: Response) => {
  res.status(404).json({ error: "Ruta de la API no encontrada" });
});

app.listen(PUERTO, () => {
  console.log(`Servidor Express corriendo en http://localhost:${PUERTO}`);
});
