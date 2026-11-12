import { Router } from "express";
import { createGuitar, getGuitars } from "./handlers/guitar";

const router = Router();
// GET
router.get("/guitar", getGuitars);


// POST
router.post("/guitar", createGuitar);


// PUT
router.put("/", (req, res) => {
    res.send("Desde PUT");
});

// DELETE
router.delete("/", (req, res) => {
    res.send("Desde DELETE");
});

export default router;
