import app from "./app";

const PORT = Number(process.env.PORT) || 5000;

// Bind to 0.0.0.0 to accept LAN connections (useful for testing from mobile devices)
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on http://0.0.0.0:${PORT}`);
});
