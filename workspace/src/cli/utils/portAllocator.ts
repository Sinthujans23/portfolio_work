// src/cli/utils/portAllocator.ts
import * as net from "net";

/**
 * Find a free TCP port on the host.
 * Returns a Promise that resolves with the port number.
 */
export function getFreePort(): Promise<number> {
  return new Promise((resolve, reject) => {
    const server = net.createServer();
    server.unref();
    server.on("error", reject);
    server.listen(0, () => {
      const address = server.address();
      if (address && typeof address === "object") {
        const port = address.port;
        server.close(() => resolve(port));
      } else {
        reject(new Error("Failed to acquire a free port"));
      }
    });
  });
}
