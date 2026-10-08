import app from './app.js';
import { PORT, UPLOAD_DIR } from './config.js';

const HOST = process.env.HOST || '0.0.0.0';
app.listen(PORT, HOST, () => {
  console.log(`⚡ [SERVER] Listening on http://${HOST}:${PORT}`);
  console.log(`📂 [UPLOADS] Persistent storage at ${UPLOAD_DIR}`);
});
